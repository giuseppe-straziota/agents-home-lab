import {AgentsModel, RootAction, RootState, SettingsModel, TemplateTypeModel} from "typesafe-actions";
import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { composeEnhancers } from "./utils";
import rootReducer from "./root-reducer";
import rootEpic from "./root-epic";
import {Message} from "@/store/types";

export const epicMiddleware = createEpicMiddleware<
    RootAction,
    RootAction,
    RootState
>();

// configure middlewares
const middlewares = [  epicMiddleware];
// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// rehydrate state on app start
const initialState : RootState= {
    agents: {list: [] as AgentsModel, selected: "", lastAgentMsg: {} as Message, selectedMsg: [], processingState: "" },
    settings: {configuration: [] as SettingsModel, tools: [] as TemplateTypeModel , llm: [] as TemplateTypeModel}
};

// create store
// @ts-expect-error possible recursive object
const store = createStore(rootReducer(), initialState, enhancer);

epicMiddleware.run(rootEpic);

// export store singleton instance
export default store;