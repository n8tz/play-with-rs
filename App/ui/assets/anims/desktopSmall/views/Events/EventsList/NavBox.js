/*
 * Copyright (C) 2019 Nathanael Braun
 * All rights reserved
 *
 *   @author : Nathanael Braun
 *   @contact : n8tz.js@gmail.com
 */
import {collWidth, footerMiniHeight, mapHeight} from "../../../vars";

let startPos      = 50,
    openDuration  = 50,
    closeDuration = 50,
    maxHeight     = "150px",
    minHeight     = "40px";

export const Axis           = [
	{
		from    : 50,
		duration: 50,
		apply   : {
			top: ["-" + maxHeight, minHeight]
		}
	},
	{
		from    : 100,
		duration: 100,
		apply   : {
			top: ["-100%", maxHeight]
		}
	},
];
export const SearchBarAxis  = [];
export const typesNav       = {
	position : "absolute",
	width    : ["100%", "-" + collWidth],
	right    : "10px",
	top      : ["100%", "-" + minHeight],
	height   : "40px",
	transform: {
		//translateY: "85%"
	}
};
export const SearchBarProps = {
	startPos     : 50,
	openDuration : 50,
	closeDuration: 100,
	minBottom    : footerMiniHeight,
	maxBottom    : mapHeight,
	minHeight,
	
	boxStyle: {
		position: "absolute",
		width   : [collWidth, -10],
		left    : "10px",
		top     : ["100%", "-" + minHeight],
		height  : "40px"
	},
	titleAxis: [
		{
			from    : startPos,
			duration: openDuration,
			apply   : {
				paddingLeft: "3em"
			}
		},
		{
			from    : startPos + openDuration,
			duration: closeDuration,
			apply   : {
				paddingLeft: "-3em"
			}
		}
	],
	rootAxis: [
		{
			from    : 50,
			duration: 50,
			apply   : {
				top: ["-" + maxHeight, minHeight]
			}
		},
		{
			from    : 100,
			duration: 100,
			apply   : {
				top: ["-100%", maxHeight]
			}
		},
		{
			from    : startPos,
			duration: openDuration,
			apply   : {
				height   : [maxHeight, "-" + minHeight],
				transform: [, , {}],
			}
		},
		{
			from    : startPos + openDuration,
			duration: closeDuration,
			apply   : {
				height   : ["-" + maxHeight, "100%", "-" + mapHeight, -50],
				transform: [, , {}],
			}
		}
	]
};
export const StretchBox     = {
	width    : "15vw",
	boxStyle : {
		position            : "relative",
		width               : "15vw",
		maxWidth            : "220px",
		height              : minHeight,
		borderTopLeftRadius : "10px",
		borderTopRightRadius: "10px",
		//marginLeft          : "5px",
		overflow            : "hidden",
		display             : "inline-block",
	},
	rootAxis : [
		{
			from    : startPos,
			duration: openDuration,
			apply   : {
				height   : [maxHeight, "-" + minHeight],
				transform: [, , {}],
			}
		},
		{
			from    : startPos + openDuration,
			duration: closeDuration,
			apply   : {
				height   : ["-" + maxHeight, minHeight],
				transform: [, , {}],
			}
		}
	],
	iconAxis : [
		{
			from    : startPos,
			duration: openDuration,
			apply   : {
				opacity: -.5,
				top    : minHeight,
				left   : ["100%", "-" + maxHeight, minHeight],
				height : [maxHeight, "-" + minHeight, "-" + minHeight],
				width  : [maxHeight, "-" + minHeight, "-" + minHeight],
			}
		}
	]
};