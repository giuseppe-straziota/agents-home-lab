
import { combineReducers } from "redux";
import {createReducer} from "typesafe-actions";
import {SettingsModel,TemplateTypeModel} from "typesafe-actions";

import {
    loadLlmAsync,
    loadSettingsAsync, loadToolsAsync
} from "../data/actions";

const reducer = combineReducers({
    configuration: createReducer([] as SettingsModel)
        .handleAction(
            [
                loadSettingsAsync.success,
            ],
            (state: SettingsModel, action) => {
                console.log("reducer action", action, state);
                return action.payload;
            }
        ),
    tools: createReducer([] as TemplateTypeModel)
        .handleAction(
            [
                loadToolsAsync.success,
            ],
            (state: TemplateTypeModel, action) => {
                console.log("reducer action", action, state);
                return action.payload;
            }
        ),
    llm: createReducer([] as TemplateTypeModel)
        .handleAction(
            [
                loadLlmAsync.success,
            ],
            (state: TemplateTypeModel, action) => {
                console.log("reducer action", action, state);
                return action.payload;
            }
        )

});

export default reducer;