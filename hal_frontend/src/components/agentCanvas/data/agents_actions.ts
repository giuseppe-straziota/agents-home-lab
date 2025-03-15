import { createAsyncAction } from 'typesafe-actions';
import {AgentsModel} from "typesafe-actions";

export const loadAgentAsync = createAsyncAction(
    'LOAD_AGENT_REQUEST',
    'LOAD_AGENT_SUCCESS',
    'LOAD_AGENT_FAILURE'
)<undefined, AgentsModel, string>();