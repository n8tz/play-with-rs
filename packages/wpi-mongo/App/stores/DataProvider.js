/*
 * Copyright (C) 2019 Nathanael Braun
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Context, Store, scopeToProps} from "rescope";
import React                          from 'react'
import debounce                       from 'debounce'
import is                             from 'is'
import shortid                        from 'shortid'
import xxhashjs                       from 'xxhashjs'
import {types, query, get}            from 'App/db';

var H = xxhashjs.h64(0)	// seed = 0xABCD


/**
 * base data provider
 *  - centralize record update & dispatch
 *
 */

export default class DataProvider extends Store {
	static singleton = true;
	static state     = {};
	
	static actions = {
		dataProvider_flushAll() {
			this.flushAndReload()
		},
		data_create( etty, record, cb ) {
			if ( !this.nextState )
				return console.error("DataProvider: Unknown data type '" + etty + "'")
			
			if ( !this.nextState.remove )
				return console.error("DataProvider: no create api for data type '" + etty + "'")
			
			this.state
			    .create({ record })
			    .then(
				    ( data ) => {
					    cb && cb(null, data.result);
					    this.flushAndReload(etty)
				    },
				    ( err ) => {
					    if ( err ) {
						    cb && cb(err)
					    }
				    }
			    );
		},
		data_save( etty, record, cb ) {
			if ( !this.nextState )
				return console.error("DataProvider: Unknown data type '" + etty + "'")
			
			if ( !this.nextState.save )
				return console.error("DataProvider: no save api for data type '" + etty + "'")
			
			this.state
			    .save({ id: record.id, record })
			    .then(
				    ( data ) => {
					    cb && cb(null, data.result);
					    this.flushAndReload(etty)
				    },
				    ( err ) => {
					    if ( err ) {
						    cb && cb(err)
					    }
				    }
			    );
		},
		data_remove( etty, query, cb ) {
			if ( !this.nextState )
				return console.error("DataProvider: Unknown data type '" + etty + "'")
			
			if ( !this.nextState.remove )
				return console.error("DataProvider: no remove api for data type '" + etty + "'")
			
			this.state
			    .remove(query)
			    .then(
				    ( data ) => {
					    cb && cb(null, data.result || true);
					    this.flushAndReload(etty)
				    },
				    ( err ) => {
					    if ( err ) {
						    cb && cb(err)
					    }
				    }
			    );
		}
	};
	data           = {};
	
	constructor() {
		super(...arguments);
		this.retain("keepAlive");
		
	}
	
	// data cache
	//data           ;
	// recently updated records & queries
	updatedRecords = {};
	
	apply( data, state, changes ) {
		return data;
	}
	
	/**
	 * Get record by Id if available
	 * @param etty
	 * @param id
	 * @returns {*}
	 */
	getRecord( etty, id ) {
		return this.data
			&& this.data[id];
	}
	
	/**
	 * Get query results if available
	 * @param query
	 * @returns {*}
	 */
	getQuery( query, hash ) {
		hash = hash || H.update(JSON.stringify(query)).digest().toString(32);
		return query && this.data
			&& this.data[hash];
	}
	
	/**
	 * Update record in the store & dispatch it to the listeners
	 * @param etty
	 * @param id
	 * @param rec
	 */
	pushRemoteRecord( etty, id, rec ) {
		this.data[id]           = rec;
		this.updatedRecords[id] = rec;
		
		this.dispatchUpdates();
	}
	
	/**
	 * Update query results in the store & dispatch it to the listeners
	 * @param etty
	 * @param id
	 * @param rec
	 */
	pushRemoteQuery( etty, query, results, hash ) {
		hash = hash || H.update(JSON.stringify(query)).digest().toString(32);
		
		this.data[hash]           = results;
		this.updatedRecords[hash] = results;
		
		results.items.forEach(
			record => this.pushRemoteRecord(record._cls, record._id, record)
		)
		
		if ( results.refs ) {
			Object.keys(results.refs)
			      .forEach(
				      id => this.pushRemoteRecord(results.refs[id]._cls, id, results.refs[id])
			      )
		}
		
		this.dispatchUpdates();
	}
	
	/**
	 * Order API call to update/get a record
	 * @param etty
	 * @param id
	 */
	syncRemoteRecord( etty, id ) {
		//if ( !this.state ) {
		//	this.pushRemoteRecord(etty, id, {})
		//	return console.error("DataProvider: Unknown data type '" + etty + "'")
		//}
		//if ( !this.state.query ) {
		//	this.pushRemoteRecord(etty, id, {})
		//	return console.error("DataProvider: No query API for data type '" + etty + "'")
		//}
		//this.dispatch('setLoading');
		this.wait();
		get(etty, id)
			.then(
				( data ) => {
					this.pushRemoteRecord(etty, id, data)
					//this.dispatch('setLoaded');
					this.release()
				},
				( err ) => {
					//this.dispatch('setLoaded');
					this.release()
					if ( err ) {
						this.pushRemoteRecord(etty, id, {})
						return console.error("DataProvider: query fail '", etty, err);
					}
				}
			);
	}
	
	/**
	 * Order API call to update/get a query result
	 * @param query
	 */
	syncRemoteQuery( queryData, hash ) {
		//console.info("! query : ", hash, queryData)
		this.wait()
		query(queryData)
			.then(
				( data ) => {
					this.pushRemoteQuery(queryData.etty, queryData, data, hash)
					this.release()
				},
				( err ) => {
					this.release()
					if ( err ) {
						this.pushRemoteQuery(queryData.etty, queryData, { items: [], total: 0, length: 0 })
						return console.error("DataProvider: query fail '", queryData.etty, err);
					}
				}
			);
	}
	
	/**
	 * re dld all active queries & records (when remove create or update query success)
	 * ( @todo: need optims )
	 * @param types
	 */
	flushAndReload( types ) {
		types = types
			&& (
				is.string(types)
				&& [types]
				|| types
			)
			|| Object.keys(this.data);
		
		//types.forEach(
		//	etty => {
		//		if ( etty !== "__queries" )
		//			this.activeRecords &&
		//			Object.keys(this.activeRecords)
		//			      .map(
		//				      id => this.syncRemoteRecord(etty, id)
		//			      )
		//	}
		//)
		Object.keys(this.activeQueries).forEach(
			id => {
				this.syncRemoteQuery(this.activeQueries[id], id)
			}
		)
	}
	
	/**
	 * Dispatch last updates to listeners
	 * @type {debounced}
	 */
	dispatchUpdates = debounce(() => {
		let updates  = this.updatedRecords,
		    watchers = this.watchersByEttyId;
		Object
			.keys(updates)
			.forEach(
				etty => {
					Object
						.keys(updates)
						.forEach(
							id => {
								if ( watchers && watchers[id] )
									watchers[id]
										.forEach(
											watcher => watcher(updates[id])
										)
							}
						)
				}
			)
		this.updatedRecords = {};
	});
	
	_scrapStack = [];
	
	/**
	 * Order auto clean of not used data
	 * @param etty
	 * @param id
	 */
	scrapIt( etty, id ) {
		this._scrapStack.push(
			{
				etty, id, dt: Date.now()
			}
		)
		if ( !this._scraperTm ) {
			this._scraperTm = setTimeout(this._autoClean)
		}
	}
	
	_autoClean = () => {
		//let watchers = this.watchersByEttyId,
		//    data     = this.data,
		//    item,
		//    toClean  = this._scrapStack,
		//    dtLimit  = Date.now() - 1000 * 60; // 1mn ttl for unused items
		//
		//while ( toClean.length ) {
		//	item = toClean[0];
		//	if ( watchers[item.id]
		//		&& watchers[item.id].length )// was put in scrap then réused, remove from scrap list
		//		toClean.shift()
		//	else if ( item.dt < dtLimit ) {// timeout: delete it
		//		console.log("clean", item)
		//		delete data[item.id];
		//		toClean.shift()
		//	}
		//	else break;
		//}
		//
		//if ( toClean.length )
		//	this._scraperTm = setTimeout(this._autoClean, 5000);// clean interval
		//else
		//	this._scraperTm = null;
	};
	
	watchersByEttyId = {};
	activeQueries    = {};
	activeRecords    = {};
	
	/**
	 * Add new record listener & query it if not available
	 * @param etty
	 * @param id
	 * @param watcher
	 */
	bindRecord( etty, id, watcher ) {
		let refs   = this.watchersByEttyId, newRequest,
		    noData = !this.data || !this.data[id];
		
		refs       = refs || {};
		newRequest = !refs[id];
		refs[id]   = refs[id] || [];
		
		refs[id].push(watcher);
		
		if ( newRequest ) {
			this.activeRecords     = this.activeRecords || {};
			this.activeRecords[id] = id;
		}
		
		//console.info("! watch record : ", id)
		// + socket watch record (debounced)
		if ( newRequest ) {
			if ( noData )
				this.syncRemoteRecord(etty, id);
			else
				watcher(this.data[id])
		}
		else
			!noData && watcher(this.data[id])
		
		return etty + "." + id;
	}
	
	unBindRecord( etty, id, watcher ) {
		let refs = this.watchersByEttyId;
		
		refs     = refs || {};
		refs[id] = refs[id] || [];
		
		let i = refs[id].indexOf(watcher);
		if ( i != -1 )
			refs[id].splice(i, 1);
		
		if ( !refs[id].length ) {
			delete refs[id];
			if ( this.activeRecords )
				delete this.activeRecords[id];
			this.scrapIt(etty, id);
		}
		
		//console.info("! unwatch record : ", id)
		// - socket watch record if no more watchers
	}
	
	/**
	 * Add new query listener & query it if not available
	 * @param etty
	 * @param id
	 * @param watcher
	 */
	bindQuery( query, watcher ) {
		let refs   = this.watchersByEttyId,
		    hash   = H.update(JSON.stringify(query)).digest().toString(32),
		    etty   = query.etty,
		    newRequest,
		    noData = !this.data || !this.data[hash];
		
		refs       = refs || {};
		newRequest = !refs[hash];
		refs[hash] = refs[hash] || [];
		
		refs[hash].push(watcher);
		
		if ( newRequest ) {
			this.activeQueries       = this.activeQueries || {};
			this.activeQueries[hash] = query;
		}
		
		// + socket watch / sync query record (debounced)
		//console.info("! watch query : ", hash, query)
		if ( newRequest ) {
			if ( noData )
				this.syncRemoteQuery(query, hash);
			else
				watcher(this.data[hash])
		}
		else
			!noData && watcher(this.data[hash])
		
		return hash;
	}
	
	unBindQuery( query, watcher ) {
		let refs = this.watchersByEttyId,
		    hash = JSON.stringify(query),
		    etty = "__queries";
		
		refs[hash] = refs[hash] || [];
		
		let i = refs[hash].indexOf(watcher);
		if ( i != -1 )
			refs[hash].splice(i, 1);
		
		if ( !refs[hash].length ) {
			delete refs[hash];
			delete this.activeQueries[hash];
			this.scrapIt(etty, hash);
		}
		
		// - socket watch record if no more watchers
		//console.info("! unwatch query : ", hash)
	}
}


function walk( obj, path ) {
	if ( is.string(path) )
		path = path.split('.');
	return path.length
	       ? obj[path[0]] && walk(obj[path[0]], path.slice(1))
	       : obj;
}

export function clearWatchers( target, DataProvider, idKeys, isQuery ) {
	let watchKey = !isQuery ? "__recWatchers" : "__queryWatchers",
	    watchs   = target[watchKey] =
		    target[watchKey] || {};
	Object.keys(
		watchs
	).map(
		idKey =>
			!isQuery ? DataProvider.unBindRecord(
				idKeys[idKey].etty,
				watchs[idKey].value,
				watchs[idKey].fn
			) : DataProvider.unBindQuery(
				watchs[idKey].value,
				watchs[idKey].fn
			)
	);
	target.__recWatchers = {};
}

export function updateWatchers( target, DataProvider, idKeys, changes, isQuery ) {
	let watchKey            = !isQuery ? "__recWatchers" : "__queryWatchers",
	    watchs              = target[watchKey] =
		    target[watchKey] || {},
	    hasChanges;
	target.__activeRequests = target.__activeRequests || 0;
	Object.keys(idKeys)
	      .forEach(
		      idKey => {
			      let newValue = isQuery ? changes[idKey] : idKeys[idKey] && changes[idKey].id;
			      if ( idKeys[idKey] &&
				      (!watchs[idKey] || watchs[idKey].value !== newValue)
			      ) {
				      let initial = newValue &&
					      (
						      isQuery
						      ? !DataProvider.getQuery(newValue)
						      : !DataProvider.getRecord(idKeys[idKey].etty, newValue)
					      );
				      target.__activeRequests++;
				      hasChanges = true;
				      if ( !isQuery )
					      watchs[idKey] && DataProvider.unBindRecord(
						      idKeys[idKey].etty,
						      watchs[idKey].value,
						      watchs[idKey].fn
					      );
				      else
					      watchs[idKey] && DataProvider.unBindQuery(
						      watchs[idKey].value,
						      watchs[idKey].fn
					      );
				
				      delete watchs[idKey];
				      if ( newValue ) {
					
					      watchs[idKey] = {
						      value: newValue,
						      fn   : ( update ) => {
							      initial && target.__activeRequests--;
							      initial = false;
							      !target.dead &&
							      target.push(
								      {
									      ...target.data,
									      [idKeys[idKey].target || idKey]: update
								      })
						      }
					      }
					
					      if ( !isQuery )
						      watchs[idKey].key = DataProvider.bindRecord(
							      idKeys[idKey].etty,
							      watchs[idKey].value,
							      watchs[idKey].fn
						      )
					      else
						      watchs[idKey].key = DataProvider.bindQuery(
							      watchs[idKey].value,
							      watchs[idKey].fn
						      );
					      if ( (!target.data || !target.data[idKeys[idKey].target]) && changes[idKey].default )
						      target.push(
							      {
								      [idKeys[idKey].target || idKey]: { ...changes[idKey].default }
							      })
				      }
				      else {
					      target.push(
						      {
							      ...target.data,
							      [idKeys[idKey].target || idKey]: null
						      })
				      }
			      }
			      else if ( !newValue ) {
				      target.push(
					      {
						      ...target.data,
						      [idKeys[idKey] && idKeys[idKey].target || idKey]: null
					      })
			      }
		      }
	      )
	return hasChanges;
}

export function getRecordsFromIdKeys( DataProvider, idKeys, changes ) {
	let results = {};
	Object.keys(idKeys)
	      .forEach(
		      idKey => {
			      results[idKeys[idKey].target] = DataProvider.getRecord(idKeys[idKey].etty, walk(changes, idKey))
		      }
	      )
	return results;
}

export function getQueriesFromIdKeys( DataProvider, idKeys, changes ) {
	let results = {};
	Object.keys(idKeys)
	      .forEach(
		      idKey => {
			      results[idKeys[idKey].target || idKey] = DataProvider.getQuery(walk(changes, idKey)) || idKeys[idKey].default
		      }
	      )
	return results;
}