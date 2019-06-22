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

var props = {
	"margin"                     : { "properties": ["marginTop", "marginRight", "marginBottom", "marginLeft"] },
	"marginBottom"               : { "types": ["length"] },
	"marginLeft"                 : { "types": ["length"] },
	"marginRight"                : { "types": ["length"] },
	"marginTop"                  : { "types": ["length"] },
	"padding"                    : { "properties": ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
	"paddingBottom"              : { "types": ["length"] },
	"paddingLeft"                : { "types": ["length"] },
	"paddingRight"               : { "types": ["length"] },
	"paddingTop"                 : { "types": ["length"] },
	"bottom"                     : { "types": ["length-percentage-calc"] },
	"left"                       : { "types": ["length-percentage-calc"] },
	"right"                      : { "types": ["length-percentage-calc"] },
	"top"                        : { "types": ["length-percentage-calc"] },
	"zIndex"                     : { "types": ["integer"] },
	"width"                      : { "types": ["length-percentage-calc"] },
	"maxWidth"                   : { "types": ["length-percentage-calc"] },
	"minWidth"                   : { "types": ["length-percentage-calc"] },
	"height"                     : { "types": ["length-percentage-calc"] },
	"maxHeight"                  : { "types": ["length-percentage-calc"] },
	"minHeight"                  : { "types": ["length-percentage-calc"] },
	"lineHeight"                 : { "types": ["number", "length"] },
	"verticalAlign"              : { "types": ["length"] },
	"visibility"                 : { "types": ["visibility"] },
	"borderSpacing"              : { "types": ["length"], "multiple": true },
	"color"                      : { "types": ["color"] },
	"opacity"                    : { "types": ["number"] },
	"background"                 : { "properties": ["backgroundColor", "backgroundPosition", "backgroundSize"] },
	"backgroundColor"            : { "types": ["color"] },
	"backgroundPosition"         : { "types": ["length-percentage-calc"], "multiple": true, "repeatable": true },
	"backgroundSize"             : { "types": ["length-percentage-calc"], "multiple": true, "repeatable": true },
	"border"                     : { "properties": ["borderColor", "borderWidth"] },
	"borderBottom"               : { "properties": ["borderBottomColor", "borderBottomWidth"] },
	"borderLeft"                 : { "properties": ["borderLeftColor", "borderLeftWidth"] },
	"borderRight"                : { "properties": ["borderRightColor", "borderRightWidth"] },
	"borderTop"                  : { "properties": ["borderTopColor", "borderTopWidth"] },
	"borderColor"                : { "properties": ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"] },
	"borderWidth"                : { "properties": ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"] },
	"borderBottomColor"          : { "types": ["color"] },
	"borderLeftColor"            : { "types": ["color"] },
	"borderRightColor"           : { "types": ["color"] },
	"borderTopColor"             : { "types": ["color"] },
	"borderBottomWidth"          : { "types": ["length"] },
	"borderLeftWidth"            : { "types": ["length"] },
	"borderRightWidth"           : { "types": ["length"] },
	"borderTopWidth"             : { "types": ["length"] },
	"borderRadius"               : { "properties": ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"] },
	"borderTopLeftRadius"        : { "types": ["length-percentage-calc"], "multiple": true },
	"borderTopRightRadius"       : { "types": ["length-percentage-calc"], "multiple": true },
	"borderBottomRightRadius"    : { "types": ["length-percentage-calc"], "multiple": true },
	"borderBottomLeftRadius"     : { "types": ["length-percentage-calc"], "multiple": true },
	"boxShadow"                  : { "types": ["shadow-list"] },
	"caretColor"                 : { "types": ["color"] },
	"outline"                    : { "properties": ["outlineColor", "outlineWidth"] },
	"outlineColor"               : { "types": ["color"] },
	"outlineWidth"               : { "types": ["length"] },
	"outlineOffset"              : { "types": ["length"] },
	"flex"                       : { "properties": ["flexGrow", "flexShrink", "flexBasis"] },
	"flexGrow"                   : { "types": ["number"] },
	"flexShrink"                 : { "types": ["number"] },
	"flexBasis"                  : { "types": ["length-percentage-calc"] },
	"order"                      : { "types": ["integer"] },
	"font"                       : { "properties": ["fontWeight", "fontStretch", "fontSize", "lineHeight"] },
	"fontWeight"                 : { "types": ["font-weight"] },
	"fontStretch"                : { "types": ["font-stretch"] },
	"fontSize"                   : { "types": ["length"] },
	"fontSizeAdjust"             : { "types": ["number"] },
	"gridTemplateColumns"        : { "types": ["length-percentage-calc"], "multiple": true },
	"gridTemplateRows"           : { "types": ["length-percentage-calc"], "multiple": true },
	"gridTemplate"               : { "properties": ["gridTemplateRows", "gridTemplateColumns"] },
	"grid"                       : { "properties": ["gridTemplateRows", "gridTemplateColumns"] },
	"gridRowGap"                 : { "types": ["length-percentage-calc"] },
	"gridColumnGap"              : { "types": ["length-percentage-calc"] },
	"gridGap"                    : { "properties": ["gridRowGap", "gridColumnGap"] },
	"clip"                       : { "types": ["rectangle"] },
	"clipPath"                   : { "types": ["basic-shape"] },
	"mask"                       : { "properties": ["maskPosition", "maskSize"] },
	"maskPosition"               : { "types": ["length-percentage-calc"], "multiple": true, "repeatable": true },
	"maskSize"                   : { "types": ["length-percentage-calc"], "multiple": true, "repeatable": true },
	"shapeOutside"               : { "types": ["basic-shape"] },
	"shapeMargin"                : { "types": ["length-percentage-calc"] },
	"shapeImageThreshold"        : { "types": ["number"] },
	"scrollPadding"              : { "properties": ["scrollPaddingTop", "scrollPaddingRight", "scrollPaddingBottom", "scrollPaddingLeft"] },
	"scrollPaddingTop"           : { "types": ["length-percentage-calc"] },
	"scrollPaddingRight"         : { "types": ["length-percentage-calc"] },
	"scrollPaddingBottom"        : { "types": ["length-percentage-calc"] },
	"scrollPaddingLeft"          : { "types": ["length-percentage-calc"] },
	"scrollPaddingBlock"         : { "properties": ["scrollPaddingBlockStart", "scrollPaddingBlockEnd"] },
	"scrollPaddingBlockStart"    : { "types": ["length-percentage-calc"] },
	"scrollPaddingBlockEnd"      : { "types": ["length-percentage-calc"] },
	"scrollPaddingInline"        : { "properties": ["scrollPaddingInlineStart", "scrollPaddingInlineEnd"] },
	"scrollPaddingInlineStart"   : { "types": ["length-percentage-calc"] },
	"scrollPaddingInlineEnd"     : { "types": ["length-percentage-calc"] },
	"scrollSnapMargin"           : { "properties": ["scrollSnapMarginTop", "scrollSnapMarginRight", "scrollSnapMarginBottom", "scrollSnapMarginLeft"] },
	"scrollSnapMarginTop"        : { "types": ["length"] },
	"scrollSnapMarginRight"      : { "types": ["length"] },
	"scrollSnapMarginBottom"     : { "types": ["length"] },
	"scrollSnapMarginLeft"       : { "types": ["length"] },
	"scrollSnapMarginBlock"      : { "properties": ["scrollSnapMarginBlockStart", "scrollSnapMarginBlockEnd"] },
	"scrollSnapMarginBlockStart" : { "types": ["length"] },
	"scrollSnapMarginBlockEnd"   : { "types": ["length"] },
	"scrollSnapMarginInline"     : { "properties": ["scrollSnapMarginInlineStart", "scrollSnapMarginInlineEnd"] },
	"scrollSnapMarginInlineStart": { "types": ["length"] },
	"scrollSnapMarginInlineEnd"  : { "types": ["length"] },
	"textDecoration"             : { "properties": ["textDecorationColor"] },
	"textDecorationColor"        : { "types": ["color"] },
	"textEmphasis"               : { "properties": ["textEmphasisColor"] },
	"textEmphasisColor"          : { "types": ["color"] },
	"textShadow"                 : { "types": ["shadow-list"] },
	"columns"                    : { "properties": ["columnWidth", "columnCount"] },
	"columnWidth"                : { "types": ["length"] },
	"columnCount"                : { "types": ["integer"] },
	"columnGap"                  : { "types": ["length-percentage-calc"] },
	"columnRule"                 : { "properties": ["columnRuleColor", "columnRuleWidth"] },
	"columnRuleColor"            : { "types": ["color"] },
	"columnRuleWidth"            : { "types": ["length"] },
	"letterSpacing"              : { "types": ["length"] },
	"tabSize"                    : { "types": ["length"] },
	"textIndent"                 : { "types": ["length-percentage-calc"] },
	"wordSpacing"                : { "types": ["length-percentage-calc"] },
	"transform"                  : { "types": ["transform"] },
	"transformOrigin"            : { "types": ["length-percentage-calc"], "multiple": true },
	"perspective"                : { "types": ["length"] },
	"perspectiveOrigin"          : { "types": ["length-percentage-calc"], "multiple": true }
}

//
///**
// * List of animatable types used by properties, with descriptions of how to interpolate each type.
// * Data taken from https://www.w3.org/TR/css3-transitions/#animatable-types and some other W3C specs.
// *
// * @type {Object}
// */
//exports.types = {
//	'color'                 : {
//		name: 'color',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-color'
//	},
//	'length'                : {
//		name: 'length',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-length'
//	},
//	'percentage'            : {
//		name: 'percentage',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-percentage'
//	},
//	'length-percentage-calc': {
//		name: 'length, percentage, or calc',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-lpcalc'
//	},
//	'integer'               : {
//		name: 'integer',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-integer'
//	},
//	'font-weight'           : {
//		name: 'font weight',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-font-weight'
//	},
//	'number'                : {
//		name: 'number',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-number'
//	},
//	'rectangle'             : {
//		name: 'rectangle',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-rect'
//	},
//	'visibility'            : {
//		name: 'visibility',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-visibility'
//	},
//	'shadow-list'           : {
//		name: 'shadow list',
//		href: 'https://www.w3.org/TR/css3-transitions/#animtype-shadow-list'
//	},
//	// Other specs
//	'transform'             : {
//		name: 'transform',
//		href: 'https://www.w3.org/TR/css3-transforms/#interpolation-of-transforms'
//	},
//	'font-stretch'          : {
//		name: 'font stretch',
//		href: 'https://www.w3.org/TR/css3-fonts/#font-stretch-animation'
//	},
//	'basic-shape'           : {
//		name: 'basic shape',
//		href: 'https://www.w3.org/TR/css-shapes-1/#basic-shape-interpolation'
//	},
//};
//
export function expandShorthandProperty( property, value, target = {} ) {
	let type       = props[property],
	    childProps = type && type.properties,
	    values     = value.split(' ');
	
	childProps && childProps.forEach(
		( k, i ) => {
			target[k] = values[i % values.length];
		}
	)
	return target;
};

export function isShorthandProperty( property ) {
	let type       = props[property],
	    childProps = type && type.properties;
	return childProps && !!childProps.length;
};


export function isValidDeclaration( property, value ) {
	return !!props[property];
};

/**
 * Check if a CSS property can be animated
 * @param  {string} property CSS property name
 * @return {boolean}         True if the property can be animated
 */
export function canAnimate( property ) {
	return props.hasOwnProperty(property);
};

/**
 * Get a definition of how a CSS property can be animated
 * @param  {string} property CSS property name
 * @param  {boolean} expand  Expand definitions for sub-properties, when available
 * @return {object}          Property definition, or null if it can't be animated
 */
export function getProperty( property, expand ) {
	if ( !exports.canAnimate(property) ) {
		return null;
	}
	var prop = props[property];
	var ret  = { name: property };
	Object.keys(prop).forEach(function ( key ) {
		var value = prop[key];
		if ( Array.isArray(value) ) {
			if ( key === 'properties' && expand ) {
				value = value.map(function ( subProp ) {
					return exports.getProperty(subProp, expand);
				});
			}
			else {
				value = value.slice(); // clone
			}
		}
		ret[key] = value;
	});
	return ret;
};
