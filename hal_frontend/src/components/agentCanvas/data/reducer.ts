
import { combineReducers } from 'redux';
import {ActionType, AgentsModel, createReducer} from 'typesafe-actions';
import {
    loadAgentAsync
} from './agents_actions.ts';

const reducer = combineReducers({
    list: createReducer([] as AgentsModel)
        .handleAction([loadAgentAsync.success],
            (state:AgentsModel, action: ActionType<typeof loadAgentAsync.success>): AgentsModel => {
                console.log('reducer action', action, state);
                return action.payload
            }
        )

});


export default reducer;