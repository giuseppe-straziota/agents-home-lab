
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import {SettingsModel} from 'SettingsModel'

import {
    loadSettingsAsync
} from '../data/actions';

const reducer = combineReducers({
    list: createReducer([] as SettingsModel)
        .handleAction(
            [
                loadSettingsAsync.success,
            ],
            (state, action) => {
                console.log('reducer action', action, state);
                return action.payload
            }
        )

});

export default reducer;