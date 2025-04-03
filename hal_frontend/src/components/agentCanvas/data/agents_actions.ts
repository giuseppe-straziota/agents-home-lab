import {createAction, createAsyncAction} from "typesafe-actions";
import {AgentsModel} from "typesafe-actions";
import {AgentRequest, Message} from "@/store/types";

export const loadAgentsAsync = createAsyncAction(
    "LOAD_AGENTS_REQUEST",
    "LOAD_AGENTS_SUCCESS",
    "LOAD_AGENTS_FAILURE"
)<undefined, AgentsModel, string>();

export const upsertAgentAsync = createAsyncAction(
    "ADD_AGENT_REQUEST",
    "ADD_AGENT_SUCCESS",
    "ADD_AGENT_FAILURE"
)<AgentRequest, AgentsModel, string>();

export const deleteAgentAsync = createAsyncAction(
    "DELETE_AGENT_REQUEST",
    "DELETE_AGENT_SUCCESS",
    "DELETE_AGENT_FAILURE"
)<{agent_uuid:string}, AgentsModel, string>();

export const loadAgentMsgAsync = createAsyncAction(
    "DELETE_AGENT_MSG_REQUEST",
    "DELETE_AGENT_MSG_SUCCESS",
    "DELETE_AGENT_MSG_FAILURE"
)<{agent_uuid:string}, Array<Message>, string>();

export const selectedAgentAct = createAction("selected/agent")<string>();
export const selectedAgentMsgAct = createAction("selected/agent/msg")<Array<Message>>();
export const setLastAgentMsgAct = createAction("last/agent/msg")<Message>();