
import { combineReducers } from 'redux';
import {createReducer, LlmModel} from 'typesafe-actions';
import {SettingsModel,ToolsModel} from 'typesafe-actions'

import {
    loadLlmAsync,
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
        ),
    llm: createReducer([] as LlmModel)
        .handleAction(
            [
                loadLlmAsync.success,
            ],
            (state: LlmModel, action) => {
                console.log('reducer action', action, state);
                return action.payload
            }
        )

});

export default reducer;