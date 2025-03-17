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