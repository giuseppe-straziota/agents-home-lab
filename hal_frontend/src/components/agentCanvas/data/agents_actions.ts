import { createAsyncAction } from 'typesafe-actions';
import {AgentsModel} from "AgentModel";

export const loadAgentAsync = createAsyncAction(
    'LOAD_AGENT_REQUEST',
    'LOAD_AGENT_SUCCESS',
    'LOAD_AGENT_FAILURE'
)<undefined, AgentsModel[], string>();