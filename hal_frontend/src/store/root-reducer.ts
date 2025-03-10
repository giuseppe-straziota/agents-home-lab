import { combineReducers } from 'redux';
import agentReducer from "@/components/agentCanvas/data/reducer";
import settingsReducer from "@/data/reducer";

const rootReducer = (  ) =>
    combineReducers({
        agents: agentReducer,
        settings: settingsReducer
    });

export default rootReducer;