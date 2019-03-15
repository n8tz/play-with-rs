/*
 * The MIT License (MIT)
 * Copyright (c) 2019. Wise Wild Web
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  @author : Nathanael Braun
 *  @contact : n8tz.js@gmail.com
 */
import PropTypes                                    from "prop-types";
import React                                        from "react";
import {Rnd}                                        from "react-rnd";
import {reScope, scopeToProps, propsToScope, Store} from "rscopes";
import CloseIcon                                    from '@material-ui/icons/Close';
import moment                                       from 'moment';
import anims                                        from 'App/ui/anims/(*).js';
import ReactGridLayout                              from 'react-grid-layout';


import {withStateMap, asRef, asStore} from "rescope-spells";
import stores                         from 'App/stores/(*).js';
import DataProvider, {withQueries}    from 'App/stores/DataProvider';
import Comps                          from 'App/ui/components/(*).js';

import {asTweener, TweenRef} from "react-rtween";

if ( typeof window !== "undefined" ) {
	require('react-resizable/css/styles.css');
	require('react-grid-layout/css/styles.css');
}

@reScope(
	{
		@withStateMap(
			{
				FocusedItems: {
					etty : 'FocusedItems',
					limit: 100,
					query: {},
				},
				
				updateQueries() {
					//return { FocusedItems: { ...this.nextState.FocusedItems, $skip: 5 } }
				}
			}
		)
		Queries     : stores.MongoQueries,
		@withStateMap(
			{
				@asRef
				items  : "Queries.FocusedItems.items",
				imgKeys: ["previewImage"]
			}
		)
		WithImgList : stores.ImgFieldsLoader,
		@withStateMap(
			{
				@asRef
				items      : "WithImgList.items",
				toMountKeys: ["targetEtty"]
			}
		)
		MountedItems: stores.MongoListRefsLoader,
		@withStateMap(
			{
				HomeGridLayout: {
					id       : "HomeGridLayout",
					etty     : "Assets",
					"default": {
						layout: []
					}
				}
			}
		)
		GridLayout  : stores.MongoRecords,
		@asStore
		Grid        : {
			@asRef
			items: "MountedItems.items",
			
			@asRef
			layout: "GridLayout.HomeGridLayout.layout",
		},
		
	}
)
@scopeToProps("MountedItems", "Grid")
//@asTweener({ initialScrollPos: { scrollX: 100 }, propagateAxes: { scrollY: true } })
export default class Highlighter extends React.Component {
	static propTypes = {};
	state            = {};
	
	onLayoutChange = ( layout ) => {
	}
	
	render() {
		let {
			    Grid: { items: gridItems = [], layout = [] },
			    $actions, onSelect, selected
		    }     = this.props,
		    state = this.state;
		return (
			<div
				onClick={ $actions.saveState }
				className={ "Highlighter container" }
			>
				<div className={ " today" } onClick={ e => e.preventDefault() }>
					{/*<ReactGridLayout className="layout" layout={ layout } cols={ 8 } rowHeight={ 50 }*/ }
					{/*onLayoutChange={ this.onLayoutChange }*/ }
					{/*isResizable={ true }*/ }
					{/*width={ 1200 }>*/ }
					{
						gridItems.map(
							( item, i ) =>
								<TweenRef key={ item._id }
								          initial={ {
									          perspective: "200px",
									          //width      : "200px",
									          //height     : "100px",
									          //margin     : "10px",
									          //display    : "inline-block",
									          //overflow   : "hidden"
								          } }
								          scrollableAnims={ {
									          scrollY: anims.flyOut(i * 5, 100),
									          scrollX: [...anims.flip(0, 100), ...anims.flip(100, 100)]
								          } }
								>
									<div>
										<Comps.FocusedItems record={ item }/>
									</div>
								</TweenRef>
						)
					}
					{/*</ReactGridLayout>*/ }
				</div>
			</div>
		);
	}
};