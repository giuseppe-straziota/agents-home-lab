import { createAsyncAction } from 'typesafe-actions';
import {SettingsModel, ToolsModel} from "typesafe-actions";

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

export const createToolAsync = createAsyncAction(
    'CREATE_TOOL_REQUEST',
    'CREATE_TOOL_SUCCESS',
    'CREATE_TOOL_FAILURE'
)<{
    agent_uuid: string;
    table: string;
    fn_name: string;
    field: string;
    config: { tool_name: string };
}, ToolsModel, string>();