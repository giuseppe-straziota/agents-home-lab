
import { from, of} from 'rxjs';
import {filter, switchMap, map, catchError} from 'rxjs/operators';
import { isActionOf} from 'typesafe-actions';

import {
    createToolAsync,
    loadSettingsAsync, loadToolsAsync
} from './actions';
import { RootEpic } from 'typesafe-actions';
import {createTool, loadConfiguration, loadTools} from "@/data/api_fetch.ts";


export const loadArticlesEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(loadSettingsAsync.request)),
        switchMap(() =>
            from(loadConfiguration()).pipe(
                map(loadSettingsAsync.success),
                catchError(message => of(loadSettingsAsync.failure(message)))
            )
        )
    );
export const loadToolsEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(loadToolsAsync.request)),
        switchMap(() =>
            from(loadTools()).pipe(
                map(loadToolsAsync.success),
                catchError(message => of(loadToolsAsync.failure(message)))
            )
        )
    );

export const createToolEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(createToolAsync.request)),
        switchMap((action) =>
            from(createTool(action.payload)).pipe(
                map(createToolAsync.success),
                catchError(message => of(createToolAsync.failure(message)))
            )
        )
    );
