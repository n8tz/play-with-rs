/*
 * Copyright (C) 2019 Nathanael Braun
 * All rights reserved
 *
 *   @author : Nathanael Braun
 *   @contact : n8tz.js@gmail.com
 */

import * as easingFn                     from "d3-ease";
import is                                from "is";
import React                             from "react";
import ReactDom                          from "react-dom";
import tweenAxis                         from "tween-axis";
import TweenerContext                    from "../comps/TweenerContext";
import {deMuxLine, deMuxTween, muxToCss} from "../utils/css";
import domUtils                          from "../utils/dom";
import Inertia                           from '../utils/inertia';

/**
 * @todo : clean & comments
 */


let isBrowserSide           = (new Function("try {return this===window;}catch(e){ return false;}"))(),
    isArray                 = is.array,
    _live, lastTm, _running = [];

const SimpleObjectProto = ({}).constructor;

const Runner = {
	run  : function ( tl, ctx, duration, cb ) {
		let apply = ( pos, size ) => tl.go(pos / size, ctx);
		_running.push({ apply, duration, cpos: 0, cb });
		tl.go(0, ctx, true);//reset tl
		
		if ( !_live ) {
			_live  = true;
			lastTm = Date.now();
			// console.log("TL runner On");
			setTimeout(this._tick, 16);
		}
	},
	_tick: function _tick() {
		let i  = 0, o, tm = Date.now(), delta = tm - lastTm;
		lastTm = tm;
		for ( ; i < _running.length; i++ ) {
			_running[i].cpos = Math.min(delta + _running[i].cpos, _running[i].duration);//cpos
			_running[i].apply(
				_running[i].cpos, _running[i].duration
			);
			// console.log("TL runner ",_running[i][3]);
			if ( _running[i].cpos == _running[i].duration ) {
				
				_running[i].cb && setTimeout(_running[i].cb);
				_running.splice(i, 1), i--;
			}
			
		}
		if ( _running.length )
			setTimeout(_tick, 16);
		else {
			// console.log("TL runner Off");
			_live = false;
		}
	},
};


/**
 * asTweener decorator
 * @param argz
 * @returns {*}
 */
export default function asTweener( ...argz ) {
	
	let BaseComponent = (!argz[0] || argz[0].prototype instanceof React.Component || argz[0] === React.Component) && argz.shift(),
	    opts          = (!argz[0] || argz[0] instanceof SimpleObjectProto) && argz.shift() || {};
	
	if ( !BaseComponent ) {
		return function ( BaseComponent ) {
			return asTweener(BaseComponent, opts)
		}
	}
	
	opts = {
		wheelRatio    : 5,
		maxClickTm    : 200,
		maxClickOffset: 50,
		...opts,
		
	};
	
	class TweenableComp extends React.Component {
		static displayName = String.fromCharCode(0xD83E, 0xDDD9) + (BaseComponent.displayName || BaseComponent.name);// mage
		
		constructor() {
			super(...arguments);
			this._           = {
				refs       : {},
				muxByTarget: {},
			};
			this._.box       = {
				x: 100,
				y: 100,
				z: 800
			};
			this._._rafLoop  = this._rafLoop.bind(this);
			this.__isTweener = true;
			this._.rootRef   = this.props.forwardedRef || React.createRef();
		}
		
		// ------------------------------------------------------------
		// -------------------- TweenRefs utils -----------------------
		// ------------------------------------------------------------
		
		/**
		 * Register tweenable element
		 * return its current style
		 * @param id
		 * @param iStyle
		 * @param iMap
		 * @param pos
		 * @param noref
		 * @param mapReset
		 * @returns {style,ref}
		 */
		tweenRef( id, iStyle, iMap, pos, noref, mapReset ) {// ref initial style
			this.makeTweenable();
			
			let _            = this._,
			    tweenableMap = {};
			
			let initials = {};
			if ( !_.tweenRefs[id] )
				_.tweenRefTargets.push(id);
			
			//debugger
			if ( _.tweenRefs[id] && (_.iMapOrigin[id] !== iMap || mapReset) ) {
				// hot switch initial values
				
				_.iMapOrigin[id] = iMap;
				iStyle           = iStyle || {};
				iMap             = iMap || {};
				if ( _.tweenRefCSS[id]&&mapReset ) {
					_.muxByTarget[id]     = {};
					_.muxDataByTarget[id] = {};
					
					Object.keys(_.tweenRefCSS[id])// unset
					      .forEach(
						      key => (iStyle[key] = iStyle[key] || '')
					      );
					_.tweenRefMaps[id] = tweenableMap = { ..._.tweenRefOrigin[id] };
					iStyle             = {
						...iStyle, ...deMuxTween(iMap, tweenableMap, initials,
						                         _.muxDataByTarget[id], _.muxByTarget[id], true)
					};
					Object.assign(_.tweenRefCSS[id], _.tweenRefOriginCss[id]);
				}
				else {
					//_.muxByTarget[id] = {};
					
					// should reset only a part of.. complex
					//_.muxDataByTarget[id] = {};
					
					
					iStyle = { ...iStyle, ...deMuxTween(iMap, tweenableMap, initials, _.muxDataByTarget[id], _.muxByTarget[id], true, true) };
					// minus initial values
					Object.keys(_.tweenRefOrigin[id])
					      .forEach(
						      key => (_.tweenRefMaps[id][key] -= _.tweenRefOrigin[id][key])
					      );
					// set defaults values in case of
					Object.keys(initials)
					      .forEach(
						      key => (_.tweenRefMaps[id][key] = is.number(_.tweenRefMaps[id][key])
						                                        ? _.tweenRefMaps[id][key]
						                                        : initials[key])
					      );
					// add new initial values
					Object.keys(tweenableMap)
					      .forEach(
						      key => (_.tweenRefMaps[id][key] += tweenableMap[key])
					      );
					
					Object.keys(_.tweenRefMaps[id])// unset
					      .forEach(
						      key => {
							      //key == "width" &&
							      if ( _.tweenRefOrigin[id].hasOwnProperty(key) && !tweenableMap.hasOwnProperty(key) ) {
								      delete _.tweenRefMaps[id][key]
								      delete _.muxByTarget[id][key]
								      _.refs[id] && _.refs[id].style && (_.refs[id].style[key] = undefined);
							      }
						      }
					      );
					_.tweenRefOrigin[id]    = { ...tweenableMap };
					_.tweenRefOriginCss[id] = { ...iStyle };
				}
				
				//let newCss        = {};
				//_.tweenRefMaps[t] = { ..._.tweenRefOrigin[t] };
				
				muxToCss(_.tweenRefMaps[id], _.tweenRefCSS[id], _.muxByTarget[id], _.muxDataByTarget[id], _.box);
			}
			else if ( !_.tweenRefs[id] ) {
				_.iMapOrigin[id] = iMap;
				iStyle           = iStyle || {};
				iMap             = iMap || {};
				
				_.tweenRefs[id]       = true;
				_.muxByTarget[id]     = _.muxByTarget[id] || {};
				_.muxDataByTarget[id] = _.muxDataByTarget[id] || {};
				
				
				iStyle = { ...iStyle, ...deMuxTween(iMap, tweenableMap, initials, _.muxDataByTarget[id], _.muxByTarget[id], true) };
				//_.tweenRefUnits[id] = extractUnits(iMap);
				//}
				_.tweenRefOrigin[id]    = tweenableMap;
				_.tweenRefOriginCss[id] = { ...iStyle };
				_.tweenRefCSS[id]       = iStyle;
				_.tweenRefMaps[id]      = _.tweenRefMaps[id] || {};
				
				
				// if this ref was initialized by its scroll anims we minus initial values
				Object.keys(tweenableMap)
				      .forEach(
					      key => {
						      if ( _.tweenRefMaps[id].hasOwnProperty(key) )
							      _.tweenRefMaps[id][key] -= initials[key];
					      }
				      );
				//
				// init / reset or get the tweenable view
				tweenableMap = Object.assign({}, initials, tweenableMap || {});
				// set defaults values in case of
				// add new initial values
				Object.keys(tweenableMap)
				      .forEach(
					      key => (_.tweenRefMaps[id][key] = (_.tweenRefMaps[id][key] || 0) + tweenableMap[key])
				      );
				tweenableMap = _.tweenRefMaps[id];
				muxToCss(tweenableMap, iStyle, _.muxByTarget[id], _.muxDataByTarget[id], _.box);
				
			}
			//console.log('tweenRef::tweenRef:519: ', id, { ..._.tweenRefCSS[id]  }, { ...tweenableMap  });
			if ( noref )
				return {
					style: { ..._.tweenRefCSS[id] }
				};
			else
				return {
					style: { ..._.tweenRefCSS[id] },
					ref  : node => (_.refs[id] = node)
					//,
					// __tweenMap : this._.tweenRefMaps[id],
					// __tweenCSS : this._.tweenRefCSS[id]
				};
		}
		
		/**
		 * Delete tweenable element
		 * @param id
		 */
		rmTweenRef( id ) {
			if ( this._.tweenRefs[id] ) {
				this._.tweenRefTargets.splice(this._.tweenRefTargets.indexOf(id), 1);
				delete this._.tweenRefs[id];
				delete this._.muxByTarget[id];
				delete this._.muxDataByTarget[id];
				delete this._.iMapOrigin[id];
				delete this._.tweenRefOrigin[id];
				delete this._.tweenRefCSS[id];
				delete this._.tweenRefMaps[id];
				delete this._.refs[id];
			}
		}
		
		/**
		 * Reset tweenRefs
		 * @param targets
		 */
		resetTweenable( ...targets ) {
			let _ = this._;
			targets.forEach(
				( t ) => {
					this.tweenRef(t, _.tweenRefOriginCss[t], _.iMapOrigin[t], null, null, true)
				}
			);
			this._updateTweenRefs();
		}
		
		/**
		 * Update tweenRefs style ( anims & axis will still update the ref )
		 * @param target
		 * @param style
		 * @param postPone
		 * @returns {*}
		 */
		updateRefStyle( target, style, postPone ) {
			let _ = this._, initials = {};
			if ( isArray(target) && isArray(style) )
				return target.map(( m, i ) => this.updateRefStyle(m, style[i], postPone));
			if ( isArray(target) )
				return target.map(( m ) => this.updateRefStyle(m, style, postPone));
			
			if ( !this._.tweenRefCSS )
				this.makeTweenable();
			
			deMuxTween(style, _.tweenRefMaps[target], initials, _.muxDataByTarget[target], _.muxByTarget[target], true);
			this._updateTweenRef(target);
		}
		
		/**
		 * Retrieve the tween ref dom node
		 * @param id
		 * @returns {*}
		 */
		getTweenableRef( id ) {
			return this._.refs[id] && ReactDom.findDOMNode(this._.refs[id]);
		}
		
		/**
		 * Get the root dom node of the tweener element
		 * @returns {*}
		 */
		getRootNode() {
			return this._.rootRef && this.getTweenableRef(this._.rootRef) || ReactDom.findDOMNode(this);
		}
		
		// ------------------------------------------------------------
		// -------------------- Pushable anims ------------------------
		// ------------------------------------------------------------
		
		/**
		 * Push anims
		 * @param anim
		 * @param then
		 * @param skipInit
		 * @returns {tweenAxis}
		 */
		pushAnim( anim, then, skipInit ) {
			let sl, initial, muxed, initials = {}, fail;
			if ( isArray(anim) ) {
				sl = anim;
			}
			else {
				sl      = anim.anims;
				initial = anim.initial;
			}
			
			if ( !(sl instanceof tweenAxis) ) {
				// tweenLine, initials, data, demuxers
				sl = deMuxLine(sl, initials, this._.muxDataByTarget, this._.muxByTarget);
				sl = new tweenAxis(sl, this._.tweenRefMaps);
				Object.keys(initials)
				      .forEach(
					      id => (
						      this._.tweenRefMaps[id] &&
						      Object.assign(this._.tweenRefMaps[id], {
							      ...initials[id],
							      ...this._.tweenRefMaps[id]
						      }) || (fail = console.warn("react-voodoo : Can't find tween target ", id, " in ", TweenableComp.displayName) || true)
					      )
				      )
			}
			if ( fail )
				return;
			
			this.makeTweenable();
			
			return new Promise(
				resolve => {
					
					!skipInit && initial && Object.keys(initial).map(
						( id ) => this.applyTweenState(id, initial[id], anim.reset)
					);
					
					// start timer launch @todo
					sl.run(this._.tweenRefMaps, () => {
						let i = this._.runningAnims.indexOf(sl);
						if ( i != -1 )
							this._.runningAnims.splice(i, 1);
						
						sl.destroy();
						resolve(sl);
					});
					
					this._.runningAnims.push(sl);
					
					if ( !this._.live ) {
						this._.live = true;
						requestAnimationFrame(this._._rafLoop = this._._rafLoop || this._rafLoop.bind(this));
					}
				}
			).then(sl => (then && then(sl)));
			
		}
		
		
		/**
		 * Update tweenRef raw tweened values
		 * @param id
		 * @param map
		 * @param reset
		 */
		applyTweenState( id, map, reset ) {
			let tmap = {}, initials = {};
			deMuxTween(map, tmap, initials, this._.muxDataByTarget[id], this._.muxByTarget[id])
			Object.keys(tmap).map(
				( p ) => this._.tweenRefMaps[id][p] = (!reset && this._.tweenRefMaps[id][p] || initials[p]) + tmap[p]
			);
		}
		
		// ------------------------------------------------------------
		// ------------------ Scrollable axes -------------------------
		// ------------------------------------------------------------
		
		/**
		 * Will init / update a scrollable axis
		 * @param axe
		 * @param _inertia
		 * @param _scrollableArea
		 * @param _scrollableBounds
		 * @param _scrollableWindow
		 * @param defaultPosition
		 * @param scrollFirst
		 * @param reset
		 */
		initAxis( axe, { inertia: _inertia, scrollableArea: _scrollableArea = 0, scrollableBounds: _scrollableBounds, scrollableWindow: _scrollableWindow, defaultPosition, scrollFirst }, reset ) {
			this.makeTweenable();
			this.makeScrollable();
			let _                = this._,
			    dim              = _.axes[axe],
			    scrollableBounds = _scrollableBounds,
			    scrollPos        = !reset && dim
			                       ? dim.scrollPos
			                       : defaultPosition || scrollableBounds && scrollableBounds.min || 0,
			    scrollableArea   = Math.max(dim && dim.scrollableArea || 0, _scrollableArea),
			    scrollableWindow = Math.max(dim && dim.scrollableWindow || 0, _scrollableWindow),
			    targetPos        = dim ? dim.targetPos : scrollPos,
			    inertia          = _inertia !== false && (
				    dim ? dim.inertia : new Inertia({// todo mk pure
					                                    ...(_inertia || {}),
					                                    value: scrollPos
				                                    })),
			    nextDescr        = {
				    //...(_inertia || {}),
				    scrollFirst,
				    tweenAxis: dim && dim.tweenAxis || [],
				    scrollPos,
				    targetPos,
				    inertia,
				    scrollableWindow,
				    scrollableBounds,
				    scrollableArea
			    };
			
			this._.axes[axe] = nextDescr;
			(_inertia) && inertia && (inertia._.wayPoints = _inertia.wayPoints);
			(_inertia) && inertia && !inertia.active && (inertia._.pos = scrollPos);
			if ( inertia && scrollableBounds )
				inertia.setBounds(scrollableBounds.min, scrollableBounds.max);
			else
				inertia && inertia.setBounds(0, scrollableArea)
		}
		
		_getAxis( axe = "scrollY" ) {
			let _ = this._;
			
			_.axes[axe] = _.axes[axe] || {
				tweenAxis       : [],
				scrollPos       : opts.initialScrollPos && opts.initialScrollPos[axe] || 0,
				targetPos       : 0,
				scrollableWindow: 0,
				scrollableArea  : 0,
				inertia         : new Inertia({
					                              value: opts.initialScrollPos && opts.initialScrollPos[axe] || 0,
					                              ...(opts.axes && opts.axes[axe] && opts.axes[axe].inertia || {})
				                              }),
			};
			
			return _.axes[axe];
		}
		
		/**
		 * Return axis infos
		 */
		getAxisState(axe) {
			let _ = this._, state = {};
			_.axes && Object.keys(_.axes)
			                .forEach(
				                axe => (state[axe] = _.axes[axe].targetPos || _.axes[axe].scrollPos)
			                );
			return state;
		}
		
		/**
		 * Do scroll an axis
		 * @param newPos
		 * @param ms
		 * @param axe
		 * @param ease
		 * @returns {Promise<any | never>}
		 */
		scrollTo( newPos, ms = 0, axe = "scrollY", ease ) {
			let _ = this._;
			return new Promise(
				(( resolve, reject ) => {
					if ( _.axes && _.axes[axe] ) {
						let oldPos = _.axes[axe].targetPos,
						    setPos = pos => {
							    pos                   = (~~(pos * 10000)) / 10000;
							    //console.log('TweenableComp::setPos:514: ', this.constructor.displayName);
							    _.axes[axe].targetPos = _.axes[axe].scrollPos = pos;
							    if ( _.axes[axe].inertia ) {
								    _.axes[axe].inertia.setPos(pos);
								    //_.axes[axe].inertia._doSnap()
							    }
							    _.rootRef &&
							    _.rootRef.current &&
							    _.rootRef.current.componentDidScroll &&
							    _.rootRef.current.componentDidScroll(~~pos, axe);
							    this._updateTweenRefs()
						    }
						;
						
						newPos                = Math.max(0, newPos);
						newPos                = Math.min(newPos, _.axes[axe].scrollableArea || 0);
						_.axes[axe].targetPos = newPos;
						
						if ( !ms ) {
							_.axes[axe].tweenAxis.forEach(
								sl => sl.goTo(newPos, _.tweenRefMaps)
							);
							setPos(newPos);
							resolve()
						}
						else {
							this._runScrollGoTo(axe, newPos, ms, easingFn[ease], setPos, resolve)
						}
						
						if ( !_.live ) {
							_.live = true;
							requestAnimationFrame(_._rafLoop);
						}
					}
				})).then(
				p => {
					if ( _.axes[axe].inertia ) {
						_.axes[axe].inertia._detectCurrentSnap();
					}
				}
			)
		}
		
		/**
		 * Add scrollable tween axis (scrollable anims) to a global axis
		 * @param anim
		 * @param axe
		 * @param size
		 * @returns {tweenAxis}
		 */
		addScrollableAnim( anim, axe = "scrollY", size ) {
			let sl,
			    _        = this._,
			    initials = {},
			    dim      = this._getAxis(axe);
			
			if ( isArray(anim) ) {
				sl = anim;
			}
			else {
				sl   = anim.anims;
				size = anim.length;
			}
			
			if ( !(sl instanceof tweenAxis) ) {
				sl = deMuxLine(sl, initials, this._.muxDataByTarget, this._.muxByTarget);
				sl = new tweenAxis(sl, _.tweenRefMaps);
				Object.keys(initials)
				      .forEach(
					      id => {
						      this._.tweenRefMaps[id] = this._.tweenRefMaps[id] || {},
							      Object.assign(this._.tweenRefMaps[id], {
								      ...initials[id],
								      ...this._.tweenRefMaps[id]
							      })
					      }
				      )
			}
			
			this.makeTweenable();
			this.makeScrollable();
			
			// init scroll
			dim.tweenAxis.push(sl);
			dim.scrollPos      = dim.scrollPos || 0;
			dim.scrollableArea = dim.scrollableArea || 0;
			dim.scrollableArea = Math.max(dim.scrollableArea, sl.duration);
			if ( !dim.scrollableBounds )
				dim.inertia.setBounds(0, dim.scrollableArea);
			sl.goTo(dim.scrollPos, this._.tweenRefMaps);
			this._updateTweenRefs();
			return sl;
		}
		
		/**
		 * Remove a tweenAxis object from a component scrollable axis
		 * @param sl
		 * @param axe
		 */
		rmScrollableAnim( sl, axe = "scrollY" ) {
			let _   = this._, found,
			    dim = this._getAxis(axe), twAxis;
			let i   = dim.tweenAxis.indexOf(sl);
			if ( i != -1 ) {
				dim.tweenAxis[i].destroy();
				dim.tweenAxis.splice(i, 1);
				dim.scrollableArea = Math.max(...dim.tweenAxis.map(tl => tl.duration), 0);
				if ( !dim.scrollableBounds )
					dim.inertia.setBounds(0, dim.scrollableArea || 0);
				sl.goTo(0, this._.tweenRefMaps)
				found = true;
			}
			!found && console.warn("TweenAxis not found !")
		}
		
		
		/**
		 * @private fn to push scrollTo
		 * @param axe
		 * @param to
		 * @param tm
		 * @param easing
		 * @param tick
		 * @param cb
		 * @private
		 */
		_runScrollGoTo( axe, to, tm, easing = x => x, tick, cb ) {
			let from   = this._.axes[axe].scrollPos,
			    length = to - from;
			
			_running.push(
				{
					apply   : ( pos, max ) => {
						let x = (from + (easing(pos / max)) * length);
						if ( this._.tweenEnabled ) {
							//console.log('TweenableComp::setPos:514: ', x);
							this._.axes[axe].tweenAxis.forEach(
								sl => sl.goTo(x, this._.tweenRefMaps)
							);
							tick && tick(x);
						}
					},
					duration: tm,
					cpos    : 0,
					cb
				})
			;
			
			if ( !_live ) {
				_live  = true;
				lastTm = Date.now();
				// console.log("TL runner On");
				setTimeout(Runner._tick, 16);
			}
		}
		
		/**
		 * Return scrollable parent node list basing a dom node
		 * @param node
		 * @returns {T[]}
		 */
		getScrollableNodes( node ) {
			let scrollable = domUtils.findReactParents(node), _ = this._;
			scrollable     = _.rootRef &&
				_.rootRef.current &&
				_.rootRef.current.hookScrollableTargets &&
				_.rootRef.current.hookScrollableTargets(scrollable)
				|| scrollable;
			
			return scrollable.map(
				id => (is.string(id)
				       ? this._.refs[id] && ReactDom.findDOMNode(this._.refs[id]) || this.refs[id] || document.getElementById(id)
				       : id));
		}
		
		/**
		 * Hook to know if the composed element allow scrolling
		 * @returns {boolean}
		 */
		componentShouldScroll() {
			let _ = this._;
			return _.rootRef &&
			       _.rootRef.current &&
			       _.rootRef.current.componentShouldScroll ?
			       _.rootRef.current.componentShouldScroll(...arguments) : true
		}
		
		/**
		 * todo rewrite or use lib
		 * Init touch & scroll listeners
		 * Drive scroll & drag values updates
		 * @private
		 */
		_registerScrollListeners() {
			let _static = this.constructor,
			    _       = this._;
			if ( this._.rendered ) {
				let rootNode   = this.getRootNode(),
				    debounceTm = 0,
				    debounceTr = 0,
				    scrollLoad = { x: 0, y: 0 },
				    lastScrollEvt;
				if ( !this._parentTweener && isBrowserSide ) {
					
					if ( !rootNode )
						console.warn("fail registering scroll listener !! ")
					else
						domUtils.addWheelEvent(
							rootNode,
							this._.onScroll = ( e ) => {//@todo
								let now       = Date.now(), prevent;
								scrollLoad.y += e.deltaY;
								scrollLoad.x += e.deltaX;
								lastScrollEvt = e.originalEvent;
								prevent       = this._doDispatch(document.elementFromPoint(lastScrollEvt.clientX, lastScrollEvt.clientY), scrollLoad.x * 5, scrollLoad.y * 5)
								scrollLoad.y  = 0;
								scrollLoad.x  = 0;
								debounceTm    = 0;
								debounceTr    = lastScrollEvt = undefined;
								if ( prevent ) {
									e.originalEvent.stopPropagation();
									e.originalEvent.preventDefault();
								}
							}
						);
					
					let lastStartTm,
					    cLock, dX,
					    parents, dY,
					    parentsState;
					if ( !rootNode )
						console.warn("fail registering drag listener !! ")
					else
						domUtils.addEvent(
							rootNode, this._.dragList = {
								'dragstart': ( e, touch, descr ) => {//@todo
									let tweener,
									    x,
									    y, i, style;
									
									parents      = this.getScrollableNodes(e.target);
									//console.log("start")
									lastStartTm  = Date.now();
									dX           = 0;
									dY           = 0;
									parentsState = [];
									for ( i = 0; i < parents.length; i++ ) {
										tweener = parents[i];
										// react comp with tweener support
										if ( tweener.__isTweener && tweener._.scrollEnabled ) {
											x = tweener._getAxis("scrollX");
											y = tweener._getAxis("scrollY");
										}
										else if ( is.element(tweener) ) {
											style = getComputedStyle(tweener, null);
											if ( /(auto|scroll)/.test(
												style.getPropertyValue("overflow")
												+ style.getPropertyValue("overflow-x")
												+ style.getPropertyValue("overflow-y")) ) {
												parentsState[i] = {
													y      : tweener.scrollTop,
													x      : tweener.scrollLeft,
													scrollX: /(auto|scroll)/.test(style.getPropertyValue("overflow-x")),
													scrollY: /(auto|scroll)/.test(style.getPropertyValue("overflow-y"))
													//inertia: this._activateNodeInertia(tweener)
												};
											}
										}
										
									}
									this._updateNodeInertia()
									//e.stopPropagation();
									//e.preventDefault();
								},
								'click'    : ( e, touch, descr ) => {//@todo
									if ( lastStartTm && !((lastStartTm > Date.now() - opts.maxClickTm) && Math.abs(dY) < opts.maxClickOffset && Math.abs(dX) < opts.maxClickOffset) )// skip tap & click
									{
										e.preventDefault();
										e.stopPropagation();
										//console.log("prevented click", Math.abs(dX), Math.abs(dY))
										//console.log(':o ' + (lastStartTm - Date.now()) + ' ' + dX + ' ' + dY)
									}
									//else console.log("click", Math.abs(dX), Math.abs(dY))
									
								},
								'drag'     : ( e, touch, descr ) => {//@todo
									let tweener,
									    x, deltaX, xDispatched, vX,
									    y, deltaY, yDispatched, vY,
									    cState, i;
									
									dX = -(descr._lastPos.x - descr._startPos.x);
									dY = -(descr._lastPos.y - descr._startPos.y);
									
									if ( lastStartTm && ((lastStartTm > Date.now() - opts.maxClickTm) && Math.abs(dY) < opts.maxClickOffset && Math.abs(dX) < opts.maxClickOffset) )// skip tap & click
									{
										//console.log(':u ' + (lastStartTm - Date.now()) + ' ' + dX + ' ' + dY)
										return;
									}
									else {
										
										xDispatched = !dX;
										yDispatched = !dY;
										if ( opts.dragDirectionLock ) {
											if ( cLock === "Y" || !cLock && Math.abs(dY * .5) > Math.abs(dX) ) {
												cLock = "Y";
												dX    = 0;
												//xDispatched = true;
											}
											else if ( cLock === "X" || !cLock && Math.abs(dX * .5) > Math.abs(dY) ) {
												cLock = "X";
												dY    = 0;
												//yDispatched = true;
											}
										}
										//console.log("drag", dX, dY, cLock, opts.dragDirectionLock);
										for ( i = 0; i < parents.length; i++ ) {
											tweener = parents[i];
											// react comp with tweener support
											if ( tweener.__isTweener && tweener._.scrollEnabled ) {
												
												x = tweener._getAxis("scrollX");
												y = tweener._getAxis("scrollY");
												
												if ( !parentsState[i] ) {
													parentsState[i] = { x: x.scrollPos, y: y.scrollPos };
													x.inertia.startMove();
													y.inertia.startMove();
													!x.inertiaFrame && tweener.applyInertia(x, "scrollX");
													!y.inertiaFrame && tweener.applyInertia(y, "scrollY");
												}
												deltaX = dX && (dX / tweener._.box.x) * (x.scrollableWindow || x.scrollableArea) || 0;
												deltaY = dY && (dY / tweener._.box.y) * (y.scrollableWindow || y.scrollableArea) || 0;
												if ( !xDispatched && !tweener.isAxisOut("scrollX", parentsState[i].x + deltaX, true)
													&& (tweener.componentShouldScroll("scrollX", deltaX)) ) {
													x.inertia.hold(parentsState[i].x + deltaX);
													xDispatched = true;
												}
												//console.log("scrollY", tweener.isAxisOut("scrollY", parentsState[i].y
												// + deltaY, true));
												if ( !yDispatched && !tweener.isAxisOut("scrollY", parentsState[i].y + deltaY, true)
													&& (tweener.componentShouldScroll("scrollY", deltaY)) ) {
													y.inertia.hold(parentsState[i].y + deltaY);
													yDispatched = true;
												}
											}
											else if ( is.element(tweener) ) {
												cState = parentsState[i];
												if ( cState ) {
													if ( !yDispatched &&
														cState.scrollY &&
														((dY < 0 && tweener.scrollTop !== 0)
															||
															(dY > 0 && tweener.scrollTop !== (tweener.scrollHeight - tweener.clientHeight)))
													) {
														//cState.lastY = cState.y + dY;
														//
														//tweener.scrollTo({
														//	                 top: cState.y + dY,
														//	                 //left    : undefined,
														//	                 //behavior: 'smooth'
														//                 })
														//tweener.dispatchEvent(e)
														//cState.inertia.y.hold(cState.y + dY)
														//tweener.scrollTop = cState.y + dY;
														if ( opts.dragDirectionLock && cLock === "Y" )
															return;
														else if ( !opts.dragDirectionLock ) {
															return;
														}
														yDispatched = true;
													} // let the node do this scroll
													if ( !xDispatched &&
														cState.scrollX &&
														((dX < 0 && tweener.scrollLeft !== 0)
															||
															(dX > 0 && tweener.scrollLeft !== (tweener.scrollWidth - tweener.clientWidth)))
													) {
														//cState.lastX = cState.x + dX;
														//tweener.scrollTo({
														//	                 left: cState.x + dX,
														//	                 //behavior: 'smooth'
														//                 })
														//tweener.dispatchEvent(e)
														//tweener.scrollTo(style.x + dX)
														//cState.inertia.x.hold(cState.x + dX)
														//tweener.scrollLeft = cState.x + dX;
														xDispatched = true;
													} // let the node do this scroll
												}
												
											}
											
										}
										if ( yDispatched && xDispatched ) {
											e.stopPropagation();
											e.cancelable && e.preventDefault();
											//return;
										}
										//dX = 0;
										//dY = 0;
									}
								}
								
								,
								'dropped': ( e, touch, descr ) => {
									let tweener,
									    x, deltaX, xDispatched, vX,
									    y, deltaY, yDispatched, vY,
									    cState, i;
									
									cLock = undefined;
									//lastStartTm                     = undefined;
									//document.body.style.userSelect  = '';
									//document.body.style.touchAction = '';
									for ( i = 0; i < parents.length; i++ ) {
										tweener = parents[i];
										// react comp with tweener support
										if ( tweener.__isTweener && tweener._.scrollEnabled && parentsState[i] ) {
											tweener._getAxis("scrollY").inertia.release();
											tweener._getAxis("scrollX").inertia.release();
										}
										//else if ( is.element(tweener) ) {
										//	cState = parentsState[i];
										//	if ( cState ) {
										//		cState.inertia.x.release();
										//		cState.inertia.y.release();
										//	}
										//}
										
									}
									if ( lastStartTm && !((lastStartTm > Date.now() - opts.maxClickTm) && Math.abs(dY)
										< opts.maxClickOffset && Math.abs(dX) < opts.maxClickOffset) )// skip tap
									                                                                  // &
									                                                                  // click
									{
										e.stopPropagation();
										e.cancelable && e.preventDefault();
										//console.log("prevented", Math.abs(dX), Math.abs(dY))
										//return;
									}
									//else {
									//console.log("not prevented", Math.abs(dX), Math.abs(dY))
									//}
									//lastStartTm = 0;
									parents = parentsState = null;
								}
							},
							null,
							opts.enableMouseDrag
						)
				}
				this._.doRegister = !!rootNode;
			}
			else {
				this._.doRegister = true;
			}
		}
		
		// ------------------------------------------------------------
		// --------------- Inertia & scroll modifiers -----------------
		// ------------------------------------------------------------
		
		/**
		 * Retrieve updates from an axis inertia & apply them
		 * @param dim
		 * @param axe
		 */
		applyInertia( dim, axe ) {
			let x = dim.inertia.update(), _ = this._;
			
			this._.axes[axe].tweenAxis.forEach(
				sl => {
					this._.axes[axe].targetPos = this._.axes[axe].scrollPos = x;
					sl.goTo(x, this._.tweenRefMaps)
				}
			);
			//console.log("scroll at " + x, axe, dim.inertia.active || dim.inertia.holding);
			//this.scrollTo(x, 0, axe);
			_.rootRef &&
			_.rootRef.current &&
			_.rootRef.current.componentDidScroll &&
			_.rootRef.current.componentDidScroll(x, axe);
			this._updateTweenRefs()
			if ( dim.inertia.active || dim.inertia.holding ) {
				dim.inertiaFrame = setTimeout(this.applyInertia.bind(this, dim, axe));
			}
			else {
				dim.inertiaFrame = null;
				//console.log("complete");
			}
		}
		
		/**
		 * Return true if at least 1 of this tweener axis have it's inertia active
		 * @returns {boolean}
		 */
		isInertiaActive() {//todo
			let _ = this._, active = false;
			_.axes &&
			Object.keys(_.axes)
			      .forEach(
				      axe => (active = active || _.axes[axe] && _.axes[axe].inertia.active)
			      );
			return active;
		}
		
		dispatchScroll( delta, axe = "scrollY" ) {
			let prevent,
			    dim    = this._.axes[axe],
			    oldPos = dim && dim.scrollPos,
			    newPos = oldPos + delta;
			
			if ( dim && oldPos !== newPos ) {
				
				dim.inertia.dispatch(delta, 100);
				!dim.inertiaFrame && this.applyInertia(dim, axe);
				
			}
			
			return prevent;
		}
		
		isAxisOut( axis, v, abs ) {
			let _   = this._,
			    dim = _.axes && _.axes[axis],
			    pos = abs ? v : dim && (dim.scrollPos + v);
			
			pos = pos && Math.round(pos);
			
			return !dim
				|| (
					dim.scrollableBounds
					?
					(pos <= dim.scrollableBounds.min || pos >= dim.scrollableBounds.max)
					:
					(pos <= 0 || pos >= dim.scrollableArea)
				);
		}
		
		_doDispatch( target, dx, dy, holding ) {
			let style,
			    Comps,
			    headTarget = target,
			    nodeInertia,
			    i;
			
			// check if there scrollable stuff in dom targets
			// get all the parents components & dom node of an dom element ( from fibers )
			
			Comps = this.getScrollableNodes(headTarget);
			//console.log("dispatching ", dx, dy, Comps);
			for ( i = 0; i < Comps.length; i++ ) {
				// react comp with tweener support
				if ( Comps[i].__isTweener ) {
					//debugger
					//console.log(Comps[i], dx, dy, Comps[i].isAxisOut("scrollX", dx), Comps[i].isAxisOut("scrollY",
					// dy));
					if ( !Comps[i].isAxisOut("scrollX", dx) && (!Comps[i].componentShouldScroll || Comps[i].componentShouldScroll("scrollX", dx)) ) {
						Comps[i].dispatchScroll(dx, "scrollX", holding);
						dx = 0;
					}
					if ( !Comps[i].isAxisOut("scrollY", dy) && (!Comps[i].componentShouldScroll || Comps[i].componentShouldScroll("scrollY", dy)) ) {
						Comps[i].dispatchScroll(dy, "scrollY", holding);
						dy = 0;
					}
				}
				// dom element
				else if ( is.element(Comps[i]) ) {
					style = getComputedStyle(Comps[i], null)
					if ( /(auto|scroll)/.test(
						style.getPropertyValue("overflow")
						+ style.getPropertyValue("overflow-x")
						+ style.getPropertyValue("overflow-y")
					)
					) {
						if (
							(dy < 0 && Comps[i].scrollTop !== 0)
							||
							(dy > 0 && Comps[i].scrollTop !== (Comps[i].scrollHeight - Comps[i].clientHeight))
						) {
							return;
							//nodeInertia.y.dispatch(dy * 10)
							//dy = 0;
						} // let the node do this scroll
						//if ( nodeInertia.x.isOutbound(dx) ) {
						//	nodeInertia.x.dispatch(dx * 10)
						//	dx = 0;
						//} // let the node do this scroll
					}
					
					//headTarget = headTarget.parentNode;
					//if ( headTarget === document || headTarget === target )
					//	break;
				}
				if ( !dx && !dy )
					break;
			}
			this._updateNodeInertia();
			if ( !dx && !dy )
				return true;
		}
		
		_activateNodeInertia( node ) {
			let _ = this._,
			    i = _.activeInertia.findIndex(item => (item.target === node));
			if ( i === -1 ) {
				_.activeInertia.push(
					{
						inertia: {
							x: new Inertia({ max: node.scrollWidth - node.offsetLeft, value: node.scrollLeft }),
							y: new Inertia({ max: node.scrollHeight - node.offsetHeight, value: node.scrollTop })
						},
						target : node
					});
				i = _.activeInertia.length - 1;
			}
			return _.activeInertia[i].inertia;
			
		}
		
		_updateNodeInertia = () => {
			let _ = this._, current, ln = _.activeInertia.length;
			
			if ( this._inertiaRaf )
				cancelAnimationFrame(this._inertiaRaf);
			
			for ( let i = 0; ln > i; i++ ) {
				current = _.activeInertia[i];
				if ( current.inertia.x.active || current.inertia.x.holding ) {
					current.target.scrollLeft = ~~current.inertia.x.update()
				}
				if ( current.inertia.y.active || current.inertia.y.holding ) {
					current.target.scrollTop = ~~current.inertia.y.update()
				}
				
				if ( !current.inertia.x.active && !current.inertia.y.active && !current.inertia.x.holding && !current.inertia.y.holding ) {
					_.activeInertia.slice(i, 1);
					i--;
					ln--;
				}
			}
			if ( ln !== 0 )
				this._inertiaRaf = requestAnimationFrame(this._updateNodeInertia)
			else this._inertiaRaf = null;
		}
		
		
		// ------------------------------------------------------------
		// --------------- Initialization & drawers -------------------
		// ------------------------------------------------------------
		
		makeTweenable() {
			let _ = this._;
			
			if ( !_.tweenEnabled ) {
				_.tweenRefCSS         = {};
				_.tweenRefs           = {};
				_.tweenRefMaps        = {};
				_.iMapOrigin          = {};
				_.tweenRefInitialData = {};
				_.tweenEnabled        = true;
				_.tweenRefOrigin      = {};
				_.tweenRefOriginCss   = {};
				_.axes                = {};
				_.muxDataByTarget     = _.muxDataByTarget || {};
				_.tweenRefDemuxed     = _.tweenRefDemuxed || {};
				_.tweenRefTargets     = _.tweenRefTargets || [];
				_.runningAnims        = _.runningAnims || [];
				
				isBrowserSide && window.addEventListener(
					"resize",
					this._.onResize = ( e ) => {//@todo
						this._updateBox();
						this._updateTweenRefs();
						_.rootRef &&
						_.rootRef.current &&
						_.rootRef.current.windowDidResize &&
						_.rootRef.current.windowDidResize(e)
					});
			}
		}
		
		setRootRef( id ) {
			this._.rootRef = id;
		}
		
		
		makeScrollable() {
			if ( !this._.scrollEnabled ) {
				this._.scrollEnabled = true;
				this._.scrollHook    = [];
				this._.activeInertia = [];
				this._registerScrollListeners();
			}
		}
		
		_updateBox() {
			let node = this.getRootNode();
			if ( node ) {
				this._.box.inited = true;
				this._.box.x      = node.offsetWidth;
				this._.box.y      = node.offsetHeight;
			}
		}
		
		_rafLoop() {
			this._updateTweenRefs();
			if ( this._.runningAnims.length ) {
				requestAnimationFrame(this._._rafLoop);
			}
			else {
				//this._.live && console.log("RAF off", this.constructor.displayName);
				this._.live = false;
			}
		}
		
		_updateTweenRefs() {
			if ( this._.tweenEnabled ) {
				for ( let i = 0, target, node, style; i < this._.tweenRefTargets.length; i++ ) {
					target = this._.tweenRefTargets[i];
					style  = this._updateTweenRef(target);
				}
			}
		}
		
		_swap = {};
		
		_updateTweenRef( target ) {
			let node, swap = this._swap, changes;
			this._.tweenRefCSS[target] &&
			muxToCss(this._.tweenRefMaps[target], swap, this._.muxByTarget[target], this._.muxDataByTarget[target], this._.box);
			node = this.getTweenableRef(target);
			//console.log('no changes', target, swap)
			if ( node )
				for ( let o in swap )
					if ( this._.tweenRefCSS[target].hasOwnProperty(o) ) {
						if ( swap[o] !== this._.tweenRefCSS[target][o] ) {
							node.style[o] = this._.tweenRefCSS[target][o] = swap[o];
							changes=true;
						}
						delete swap[o];
					}
			//if (!changes)
			return this._.tweenRefCSS[target];
		}
		
		
		// ------------------------------------------------------------
		// --------------- React Hooks --------------------------------
		// ------------------------------------------------------------
		
		
		componentWillUnmount() {
			let node = this.getRootNode();
			if ( this._.tweenEnabled ) {
				this._.tweenEnabled = false;
				window.removeEventListener("resize", this._.onResize);
			}
			
			if ( this._.scrollEnabled ) {
				this._.scrollEnabled = false;
				
				//this._.axes          = undefined;
				node && this._.onScroll && !this._parentTweener && domUtils.rmWheelEvent(
					node,
					this._.onScroll);
				node && this._.dragList && domUtils.removeEvent(node
					, this._.dragList)
			}
			
			super.componentWillUnmount && super.componentWillUnmount(...arguments);
		}
		
		componentDidMount() {
			let _static = this.constructor;
			
			this._.rendered = true;
			if ( this._.tweenEnabled ) {
				// debugger;
				this._updateBox();
				this._updateTweenRefs();
			}
			if ( _static.scrollableAnim ) {
				if ( is.array(_static.scrollableAnim) )
					this.addScrollableAnim(_static.scrollableAnim);
				else
					Object.keys(_static.scrollableAnim)
					      .forEach(
						      axe => this.addScrollableAnim(_static.scrollableAnim[axe], axe)
					      )
			}
			if ( this._.doRegister || this.__isFirst ) {
				
				this._registerScrollListeners();
				this._.doRegister = false;
			}
			super.componentDidMount && super.componentDidMount(...arguments);
		}
		
		componentDidUpdate( prevProps, prevState ) {
			
			if ( this._.tweenEnabled ) {
				this._updateBox();
				this._updateTweenRefs();
			}
			super.componentDidUpdate && super.componentDidUpdate(...arguments);
		}
		
		render() {
			return <TweenerContext.Consumer>
				{
					parentTweener => {
						this._parentTweener = parentTweener;
						return <TweenerContext.Provider value={this}>
							<BaseComponent {...this.props} ref={this._.rootRef} tweener={this}/>
						</TweenerContext.Provider>;
					}
				}
			</TweenerContext.Consumer>;
		}
	}
	
	let withRef         = React.forwardRef(( props, ref ) => {
		return <TweenableComp {...props} forwardedRef={ref}/>;
	});
	withRef.displayName = TweenableComp.displayName;
	return withRef;
}
