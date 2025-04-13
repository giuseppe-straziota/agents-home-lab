
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
            // @ts-expect-error state is not used but lint don't know that it is here to stay ;)
            (state: SettingsModel, action) => {
                return action.payload;
            }
        ),
    tools: createReducer([] as TemplateTypeModel)
        .handleAction(
            [
                loadToolsAsync.success,
            ],
            // @ts-expect-error state is not used but lint don't know that it is here to stay ;)
            (state: TemplateTypeModel, action) => {
                return action.payload;
            }
        ),
    llm: createReducer([] as TemplateTypeModel)
        .handleAction(
            [
                loadLlmAsync.success,
            ],
            // @ts-expect-error state is not used but lint don't know that it is here to stay ;)
            (state: TemplateTypeModel, action) => { 
                return action.payload;
            }
        )

});

export default reducer;