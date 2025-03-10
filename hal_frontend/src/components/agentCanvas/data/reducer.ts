
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import {AgentsModel} from 'AgentModel'
import {
    loadAgentAsync
} from './agents_actions.ts';

const reducer = combineReducers({
    list: createReducer([] as AgentsModel)
        .handleAction(
            [
                loadAgentAsync.success,
            ],
            (state, action) => {
                console.log('reducer action', action, state);
                return action.payload
            }
        )

});

export default reducer;