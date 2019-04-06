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
import {reScope, scopeToProps, propsToScope, Store} from "rscopes";
import moment                                       from 'moment';
import Slider                                       from "react-slick";
import anims                                        from 'App/ui/anims/(*).js';
import Comps                                        from 'App/ui/components/(*).js';
import {withStateMap, asRef, asStore}               from "rescope-spells";
import stores                                       from 'App/stores/(*).js';
import {asTweener, TweenRef}                        from "react-rtween";

var CaipiSlideshow
if ( typeof window !== "undefined" ) {
	require('slick-carousel/slick/slick.css');
	require('slick-carousel/slick/slick-theme.css');
	CaipiSlideshow = require('react-caipi-slider');
}
else CaipiSlideshow = 'div';

@reScope(
	{
		@withStateMap(
			{
				FocusedItems: {
					etty     : 'FocusedItems',
					limit    : 4,
					query    : {},
					mountKeys: ["targetEtty"],
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
		MountedItems: stores.ImgFieldsLoader,
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
		    }          = this.props,
		    state      = this.state;
		const settings = {
			className    : "center",
			centerMode   : true,
			infinite     : true,
			centerPadding: "60px",
			slidesToShow : 1,
			variableWidth: true,
			autoplay     : true,
			autoplaySpeed: 5000,
			speed        : 500
		};
		return (
			<div
				className={ "Highlighter container" }
			>
				<TweenRef
					id={ "header" }
					initial={ {
						height: "2cm",
						zIndex: "50"
					} }
				>
					<header
						className={ "container" }
						onClick={ e => $actions.setPageFocus("head") }
						style={ {
							display: "inline-block",
							//width  : "100%",
							//background: "red",
						} }>
						<TweenRef
							id={ "logo" }
							initial={ {
								height: "100%"
							} }
						>
							<div className={ "logo" }/>
						</TweenRef>
					</header>
				</TweenRef>
				
				<div className={ "headBackground" }>
					<TweenRef
						initial={ {
							//position : "absolute",
							//top      : "0px",
							//left     : "0px",
							//width    : "100%",
							//height   : "100%",
							transform: {
								translateY: '-50vh',
							}
						} }
						tweenLines={ {
							scrollY: [
								{
									type    : "Tween",
									from    : 0,
									duration: 100,
									apply   : {
										filter   : {
											//blur: "5px",
											//translateY: "-50px",
										},
										transform: {
											translateZ: "50px",
											//translateY: "-20vh",
										}
									}
								}
							],
						} }
					>
						<img src={ require("App/ui/assets/couvs/test.jpg") }/>
					</TweenRef>
				</div>
				{/*<div className={ " today" } onClick={ e => e.preventDefault() }>*/ }
				
				
				<TweenRef
					initial={ {
						position : "absolute",
						bottom   : "0px",
						left     : "0px",
						width    : "100%",
						zIndex   : "100",
						transform: {
							perspective: "200px",
							translateY : '0px',
							rotateX    : "2deg"
						}
					} }
					tweenLines={ {
						scrollY: [
							{
								type    : "Tween",
								from    : 0,
								duration: 100,
								apply   : {
									//opacity  : "-1",
									transform: {
										translateZ : "15px",
										translateY : "-10px",
										perspective: "100px",
										rotateX    : "-4deg"
									}
								}
							}
						],
					} }
				>
					<div className={ "slider" }>
						<CaipiSlideshow
							showArrow
							vignets
							autoSlide={ 10000 }
							
							onClick={
								( e, item ) => {
									//
								}
							}
							config={
								{
									hPositioningFn    : 'hCentralZoom',
									//predictiveMomentum_maxMomentumJump: 1,
									predictiveMomentum: true,
									//forceSlotRatio                    : 7 / 5,
									//infiniteMode                       : false,
									autoScroll        : true,
									autoScrollPeriod  : 5000,
									visibleItems      : 5,
									hSlotWidth        : .85,
									hSlotHeight       : 1,
									listenMouseWheel  : false,
									direction         : 'horizontal',
									//
									//itemClicked : function ( item, offset, index, slot, e ) {
									//
									//	let { App: { history } } = me.context;
									//	if ( offset ) {
									//		e.preventDefault();
									//		e.stopPropagation();
									//		//
									//		me.refs.slider._slideShow.goTo(offset);
									//		return false;
									//	}
									//	else {//debugger;
									//		var item = me.refs.slider.state.items[index].targetEtty;
									//		var View = require('App/ui/View');
									//		history.push(db.getRouteTo(item.cls, item.objId));
									//		return false;
									//
									//	}
									//},
									//itemTargeted: function ( item, node ) {
									//	var SlideshowDom = require('App/ui/utils/Dom');
									//	if ( node && node != me._selected ) {
									//		var s = me._selected;
									//		SlideshowDom.addCls(node, "selected");
									//		me._selected = node;
									//		setTimeout(function () {
									//			s && SlideshowDom.rmCls(s, "selected");
									//		});
									//
									//	}
									//}
								}
							}>
							{
								gridItems.map(
									( item, i ) =>
										<div key={ item._id }><Comps.FocusedItems record={ item }/></div>
								)
							}
						</CaipiSlideshow>
					</div>
				</TweenRef>
				{/*</div>*/ }
			</div>
		);
	}
};