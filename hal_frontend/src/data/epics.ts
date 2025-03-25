
import { from, of} from 'rxjs';
import {filter, switchMap, map, catchError} from 'rxjs/operators';
import { isActionOf} from 'typesafe-actions';

import {
    upsertToolAsync, deleteToolAsync,
    loadSettingsAsync, loadToolsAsync
} from './actions';
import { RootEpic } from 'typesafe-actions';
import {upsertTool, deleteTool, loadConfiguration, loadTools} from "@/data/api_fetch.ts";
import {loadAgentsAsync} from "@/components/agentCanvas/data/agents_actions.ts";


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
        filter(isActionOf(upsertToolAsync.request)),
        switchMap((action) =>
            from(upsertTool(action.payload)).pipe(
                map(loadAgentsAsync.request),
                catchError(message => of(upsertToolAsync.failure(message)))
            )
        )
    );

export const deleteToolEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(deleteToolAsync.request)),
        switchMap((action) =>
            from(deleteTool(action.payload)).pipe(
                map(loadAgentsAsync.request),
                catchError(message => of(deleteToolAsync.failure(message)))
            )
        )
    );
