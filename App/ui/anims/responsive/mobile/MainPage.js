/*
 *
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
	height   : "1.5cm",
	top      : "0%",
	zIndex   : 200,
	transform: [
		{
			//perspective: "500px",
		},
		{
			//translateX: "-50%",
			translateY: "0%",
			//translateZ : "-50px",
			//rotateX   : "-10deg"
		}
	]
};
export const Highlighter       = {
	position       : "absolute",
	right          : "0%",
	height         : "80%",
	top            : "0%",
	//overflow       : 'hidden',
	transformOrigin: "center top",
	zIndex         : 175,
	transform      : [
		{
			perspective: "500px",
		},
		{
			translateY: "0%",
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
		//translateY: "85%"
	}
};
export const Footer            = {
	height    : "50px",
	left      : "0px",
	top       : "100%",
	width     : "100%",
	background: "green",
	position  : "absolute",
	overflow  : 'hidden',
	transform : {
		//translateY: "100%"
	}
};
export const EventNav          = {
	position: "absolute",
	right   : "0%",
	left    : "0px",
	top     : "0%",
	height  : "100%",
	overflow: "auto"
};
export const events            = {
	position       : "absolute",
	right          : "0%",
	height         : "21%",
	top            : "80%",
	zIndex         : 150,
	//overflow       : 'hidden',
	transformOrigin: "center top",
	transform      : [
		{
			perspective: "500px",
		},
		{
			//translateY: "80%",
			//translateZ : "-50px",
			//rotateX   : "-10deg"
		}
	]
};
export const EventMap          = {
	position       : "absolute",
	right          : "0%",
	height         : "0%",
	zIndex         : 125,
	//overflow       : 'hidden',
	transformOrigin: "center top",
	top            : "100%",
};
export const PageBlock         = {
	
	position       : "absolute",
	right          : "0%",
	height         : "0%",
	top            : "100%",
	//overflow       : 'hidden',
	transformOrigin: "center top",
	zIndex         : 100,
	transform      : [
		{
			perspective: "500px",
		},
		{
			//translateY: "100%",
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
			height: -.5,
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 0,
		duration: 100,
		apply   : {
			height: -60,
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 0,
		duration: 100,
		apply   : {
			height: 34,
			top   : -60
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 0,
		duration: 100,
		apply   : {
			height: 26,
			top   : -25
		}
	},
	//full map
	{
		type    : "Tween",
		target  : "events",
		from    : 100,
		duration: 50,
		apply   : {
			height: -20,
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 100,
		duration: 50,
		apply   : {
			height: 20,
			top   : -20
		}
	},
	//page
	{
		type    : "Tween",
		target  : "PageBlock",
		from    : 150,
		duration: 100,
		apply   : {
			height: 60,
			top   : -80
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 150,
		duration: 100,
		apply   : {
			height: -30,
			top   : -30
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
			zIndex: -100,
			top   : 100
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
			height: -26,
			top   : -55
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 150,
		duration: 50,
		apply   : {
			top: -20
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
			zIndex: -100,
			top   : 120
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
			height: 2,
			top   : -23
		}
	},
	
	// reset to header
	
	{
		type    : "Tween",
		target  : "PageBlock",
		from    : 250,
		duration: 100,
		apply   : {
			//height   : 80,
			top: -80
		}
	},
	{
		type    : "Tween",
		target  : "Highlighter",
		from    : 250,
		duration: 100,
		apply   : {
			height: 58,
			top   : -77
		}
	},
	{
		type    : "Tween",
		target  : "events",
		from    : 250,
		duration: 100,
		apply   : {
			height: 10,
			top   : -10
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 250,
		duration: 50,
		apply   : {
			height: -1,
			top   : -1
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 300,
		duration: 1,
		apply   : {
			zIndex: -100,
			top   : 115
		}
	},
	{
		type    : "Tween",
		target  : "EventMap",
		from    : 300,
		duration: 50,
		apply   : {
			top: -10
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