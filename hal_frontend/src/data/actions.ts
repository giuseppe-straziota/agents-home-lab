import { createAsyncAction } from 'typesafe-actions';
import {SettingsModel} from "typesafe-actions";

export const loadSettingsAsync = createAsyncAction(
    'LOAD_SETTINGS_REQUEST',
    'LOAD_SETTINGS_SUCCESS',
    'LOAD_SETTINGS_FAILURE'
)<undefined, SettingsModel[], string>();