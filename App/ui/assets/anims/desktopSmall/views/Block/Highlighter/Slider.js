/*
 * Copyright (C) 2019 Nathanael Braun
 * All rights reserved
 *
 *   @author : Nathanael Braun
 *   @contact : n8tz.js@gmail.com
 */

let stepAngle = "3deg";

export const defaultInitial  = {
	position : "absolute",
	height   : "100%",
	top      : "50%",
	left     : "50%",
	zIndex   : 50,
	opacity  : 0,
	transform: [
		{
			perspective: "1250px",
			translateY : "32000px",
			rotate     : stepAngle
		},
		{
			translateY: "-32010px",
			translateZ: "-500px",
			rotateY   : "15deg",
		},
		{
			translateX: "-50%",
			translateY: "-50%"
		}]
};
export const scrollAxis      = [
	{
		from    : 0,
		duration: 100,
		//easeFn  : "easeSinIn",
		apply   : {
			transform: {
				rotate: stepAngle,
			},
			zIndex   : 150,
		}
	},
];
export const defaultEntering = [
	{
		from    : 0,
		duration: 100,
		//easeFn  : "easeSinIn",
		apply   : {
			transform: {
				rotate: "-" + stepAngle,
			},
			zIndex   : 150,
		}
	},
	{
		from    : 25,
		duration: 10,
		apply   : {
			opacity: 1,
		}
	}, {
		from    : 20,
		duration: 80,
		apply   : {
			transform: [{}, {
				rotateY   : "-15deg",
				translateZ: "500px",
				//rotateX: "-90deg",
			}],
		}
	},
];
export const defaultLeaving  = [
	{
		from    : 0,
		duration: 80,
		apply   : {
			transform: [{}, {
				rotateY   : "-15deg",
				translateZ: "-500px",
			}]
		}
	},
	{
		from    : 65,
		duration: 10,
		apply   : {
			opacity: -1,
		}
	}, {
		from    : 0,
		duration: 100,
		//easeFn  : "easeSinOut",
		apply   : {
			zIndex: -150,
			
			transform: {
				rotate: "-" + stepAngle,
			}
		}
	}]
;