import { createAsyncAction } from 'typesafe-actions';
import {SettingsModel, ToolsModel} from "typesafe-actions";
import {ToolRequest} from "@/store/types";

export const loadSettingsAsync = createAsyncAction(
    'LOAD_SETTINGS_REQUEST',
    'LOAD_SETTINGS_SUCCESS',
    'LOAD_SETTINGS_FAILURE'
)<undefined, SettingsModel, string>();

export const loadToolsAsync = createAsyncAction(
    'LOAD_TOOLS_REQUEST',
    'LOAD_TOOLS_SUCCESS',
    'LOAD_TOOLS_FAILURE'
)<undefined, ToolsModel, string>();

export const upsertToolAsync = createAsyncAction(
    'CREATE_TOOL_REQUEST',
    'CREATE_TOOL_SUCCESS',
    'CREATE_TOOL_FAILURE'
)<ToolRequest, ToolsModel, string>();

export const deleteToolAsync = createAsyncAction(
    'DELETE_TOOL_REQUEST',
    'DELETE_TOOL_SUCCESS',
    'DELETE_TOOL_FAILURE'
)<{tool_uuid:string}, ToolsModel, string>();