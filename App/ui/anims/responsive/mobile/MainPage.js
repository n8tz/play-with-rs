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
import {tweenTools} from "react-rtween";

export const page              = {
	position: "absolute",
	top     : "0cm",
	left    : "50%",
	bottom  : "0px",
	
	transform: {
		translateX: "-50%"
	}
};
export const header            = {
	position : "absolute",
	//right    : "0%",
	//left     : "0%",
	height   : "2cm",
	top      : "0%",
	zIndex   : 200,
	transform: [
		{
			//perspective: "500px",
		},
		{
			//translateX: "-50%",
			translateY: "0box",
			//translateZ : "-50px",
			//rotateX   : "-10deg"
		}
	]
};
export const Highlighter       = {
	position       : "absolute",
	right          : "0%",
	height         : ".80box",
	top            : "0%",
	//overflow       : 'hidden',
	transformOrigin: "center top",
	zIndex         : 175,
	transform      : [
		{
			perspective: "500px",
		},
		{
			translateY: "0box",
			//translateZ : "-50px",
			//rotateX   : "-10deg"
		}
	]
};
export const NavBox            = {
	height    : "100%",
	left      : "0px",
	top       : "0px",
	width     : "0px",
	background: "green",
	position  : "absolute",
	transform : {
		//translateY: ".85box"
	}
};
export const Footer            = {
	height    : "50px",
	left      : "0px",
	top       : "-0px",
	width     : "100%",
	background: "green",
	position  : "absolute",
	overflow  : 'hidden',
	transform : {
		translateY: "1box"
	}
};
export const EventNav          = {
	position: "absolute",
	right   : "0%",
	left    : "0px",
	top     : "0%",
	height  : "100%",
};
export const events            = {
	position       : "absolute",
	right          : "0%",
	height         : ".15box",
	top            : "0%",
	zIndex         : 150,
	//overflow       : 'hidden',
	transformOrigin: "center top",
	transform      : [
		{
			perspective: "500px",
		},
		{
			translateY: ".8box",
			//translateZ : "-50px",
			//rotateX   : "-10deg"
		}
	]
};
export const EventMap          = {
	position       : "absolute",
	right          : "0%",
	height         : ".05box",
	top            : "0%",
	zIndex         : 125,
	//overflow       : 'hidden',
	transformOrigin: "center top",
	transform      : [
		{
			perspective: "500px",
		},
		{
			translateY: ".95box",
			//translateZ : "-50px",
			//rotateX   : "-10deg"
		}
	]
};
export const PageBlock         = {
	
	position       : "absolute",
	right          : "0%",
	height         : ".0box",
	top            : "0%",
	//overflow       : 'hidden',
	transformOrigin: "center top",
	zIndex         : 100,
	transform      : [
		{
			perspective: "500px",
		},
		{
			translateY: "1box",
			//translateZ : "-50px",
			//rotateX   : "-10deg"
		}
	]
};
export const EventMap_Gradient = {
	opacity: 1
};

export const YAxis             = [
	{
		type    : "Tween",
		target  : "header",
		from    : 0,
		duration: 100,
		apply   : {
			height: -1,
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 0,
		duration: 100,
		apply   : {
			height: -.6,
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 0,
		duration: 100,
		apply   : {
			height   : .44,
			transform: {
				translateY: "-.6box"
			},
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 0,
		duration: 100,
		apply   : {
			height   : .21,
			transform: [{}, {
				translateY: -.20
			}]
		}
	},
	//full map
	{
		type    : "Tween",
		target  : "events",
		from    : 100,
		duration: 50,
		apply   : {
			height: -.25,
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 100,
		duration: 50,
		apply   : {
			height   : .25,
			transform: [{}, {
				translateY: -.25
			}],
		}
	},
	//page
	{
		type    : "Tween",
		target  : "PageBlock",
		from    : 150,
		duration: 100,
		apply   : {
			height   : .8,
			transform: [{}, {
				translateY: -1
			}],
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 150,
		duration: 100,
		apply   : {
			height   : -.30,
			transform: [{}, {
				translateY: -.30
			}],
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 247,
		duration: 1,
		apply   : {
			opacity: -1
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 248,
		duration: 1,
		apply   : {
			zIndex   : -100,
			transform: [{}, {
				translateY: 1
			}],
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 249,
		duration: 1,
		apply   : {
			opacity: 1
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 150,
		duration: 100,
		apply   : {
			height   : -.26,
			transform: [{}, {
				translateY: -.55
			}],
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 150,
		duration: 50,
		apply   : {
			transform: [{}, {
				translateY: -.20
			}],
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 199,
		duration: 1,
		apply   : {
			opacity: -1
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 200,
		duration: 1,
		apply   : {
			zIndex   : -100,
			transform: [{}, {
				translateY: 1.2
			}],
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 201,
		duration: 1,
		apply   : {
			opacity: 1
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 200,
		duration: 50,
		apply   : {
			height   : .02,
			transform: [{}, {
				translateY: -.23
			}],
		}
	},
	
	// reset to header
	
	{
		type    : "Tween",
		target  : "PageBlock",
		from    : 250,
		duration: 100,
		apply   : {
			//height   : .8,
			transform: [{}, {
				translateY: -.8
			}],
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 250,
		duration: 100,
		apply   : {
			height   : .58,
			transform: [{}, {
				translateY: -.77
			}],
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 250,
		duration: 100,
		apply   : {
			height   : .1,
			transform: [{}, {
				translateY: -.1
			}],
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 250,
		duration: 50,
		apply   : {
			height   : -.1,
			transform: [{}, {
				translateY: -.1
			}],
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 300,
		duration: 1,
		apply   : {
			zIndex   : -100,
			transform: [{}, {
				translateY: 1.15
			}],
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 300,
		duration: 50,
		apply   : {
			transform: [{}, {
				translateY: -.1
			}],
		}
	},
	{
		type    : "Tween",
		target  : "header",
		from    : 300,
		duration: 50,
		apply   : {
			height: 1,
		}
	},
];