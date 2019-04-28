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

'use strict';

import React, {Component} from "react";


export default ( { record, record: { title, place, category }, onClose, refs, className, style, ref } ) =>
	(
		<div className={ "Popin " + (className || '') } style={ { ...(style || {}) } } ref={ ref }>
			<div className="closeBtn" onClick={ onClose }/>
			<div className="topBlock">
				<img className="logo"
				     src={ refs[place.objId].previewImage || refs[category.objId].icon }/>
				<div className="name">
					{ title }&nbsp;au { refs[place.objId].label }
				</div>
			</div>
			<div className="address">
				{ refs[record.place.objId] && refs[place.objId].address.address },<br/>
			</div>
		</div>
	);
	