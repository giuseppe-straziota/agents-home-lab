
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import {SettingsModel,ToolsModel} from 'typesafe-actions'

import {
    loadSettingsAsync, loadToolsAsync
} from '../data/actions';

const reducer = combineReducers({
    configuration: createReducer([] as SettingsModel)
        .handleAction(
            [
                loadSettingsAsync.success,
            ],
            (state: SettingsModel, action) => {
                console.log('reducer action', action, state);
                return action.payload
            }
        ),
    tools: createReducer([] as ToolsModel)
        .handleAction(
            [
                loadToolsAsync.success,
            ],
            (state: ToolsModel, action) => {
                console.log('reducer action', action, state);
                return action.payload
            }
        )

});

export default reducer;