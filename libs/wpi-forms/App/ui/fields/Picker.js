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

import React                                                                        from "react";
import FormControlLabel
                                                                                    from '@material-ui/core/FormControlLabel';
import TextField                                                                    from '@material-ui/core/TextField';
import {asFieldType}                                                                from "App/ui/spells";
import {reScope, scopeToProps, asScope, withStateMap, asRef, asStore, propsToScope} from "rscopes";
import RS                                                                           from "rscopes";
import stores                                                                       from 'App/stores/(*).js';

@reScope(
	{
		@asScope
		Picker: {
			@asStore
			SelectedQuery: {
				$apply( data, { selectedType, types } ) {
					return {
						etty : selectedType || types && types[0],
						query: {},
						limit: 3,
					}
				}
			},
			@withStateMap(
				{
					@asRef
					Query: "SelectedQuery",
					updateQuery( Query ) {
						return { Query }
					}
				}
			)
			Query        : stores.MongoQueries,
			@asStore
			SelectedRef  : {
				$apply( data, { ref: { objId, cls } = {} } ) {
					return { id: objId, etty: cls }
				}
			},
			@withStateMap(
				{
					@asRef
					record: "SelectedRef",
					updateQuery( Query ) {
						return { Query }
					}
				}
			)
			Selected     : stores.MongoRecords,
		},
		
	}
)
@propsToScope(
	"defaultValue:Picker.SelectedRef.ref",
	"allowTypeSelection:Picker.SelectedQuery.types",
	"defaultValue.cls:Picker.SelectedQuery.selectedType"
)
@scopeToProps("Picker.Query", "Picker.Selected")
@asFieldType
export default class Picker extends React.Component {
	static displayName = "Picker";
	
	render() {
		let { defaultValue, value = defaultValue, Query, Selected, allowTypeSelection } = this.props;
		//debugger
		return (
			<>
				<pre>
					{
						JSON.stringify(Selected, null, 2)
					}
				</pre>
				<pre>
					{
						JSON.stringify(Query, null, 2)
					}
				</pre>
			</>
		);
	}
}
;
