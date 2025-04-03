import {createAsyncAction, LlmModel} from "typesafe-actions";
import {SettingsModel, ToolsModel} from "typesafe-actions";
import {LlmRequest, ToolRequest} from "@/store/types";

export const loadSettingsAsync = createAsyncAction(
    "LOAD_SETTINGS_REQUEST",
    "LOAD_SETTINGS_SUCCESS",
    "LOAD_SETTINGS_FAILURE"
)<undefined, SettingsModel, string>();

export const updateSettingsAsync = createAsyncAction(
    "UPDATE_SETTINGS_REQUEST",
    "UPDATE_SETTINGS_SUCCESS",
    "UPDATE_SETTINGS_FAILURE"
)<{[key:string]: string | number}, SettingsModel, string>();

//tools actions
export const loadToolsAsync = createAsyncAction(
    "LOAD_TOOLS_REQUEST",
    "LOAD_TOOLS_SUCCESS",
    "LOAD_TOOLS_FAILURE"
)<undefined, ToolsModel, string>();

export const upsertToolAsync = createAsyncAction(
    "CREATE_TOOL_REQUEST",
    "CREATE_TOOL_SUCCESS",
    "CREATE_TOOL_FAILURE"
)<ToolRequest, ToolsModel, string>();

export const deleteToolAsync = createAsyncAction(
    "DELETE_TOOL_REQUEST",
    "DELETE_TOOL_SUCCESS",
    "DELETE_TOOL_FAILURE"
)<{tool_uuid:string}, ToolsModel, string>();

//llm actions

export const loadLlmAsync = createAsyncAction(
    "LOAD_LLM_REQUEST",
    "LOAD_LLM_SUCCESS",
    "LOAD_LLM_FAILURE"
)<undefined, LlmModel, string>();

export const upsertLlmAsync = createAsyncAction(
    "CREATE_LLM_REQUEST",
    "CREATE_LLM_SUCCESS",
    "CREATE_LLM_FAILURE"
)<LlmRequest, ToolsModel, string>();

export const deleteLlmAsync = createAsyncAction(
    "DELETE_LLM_REQUEST",
    "DELETE_LLM_SUCCESS",
    "DELETE_LLM_FAILURE"
)<{llm_uuid:string}, ToolsModel, string>();
