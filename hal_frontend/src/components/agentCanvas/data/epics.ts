
import { from, of} from 'rxjs';
import { filter, switchMap, map, catchError} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import {
    upsertAgentAsync,
    loadAgentsAsync,
    deleteAgentAsync
} from './agents_actions.ts';
import { RootEpic } from 'typesafe-actions';
import {upsertAgent, loadAgents, deleteAgent} from "@/components/agentCanvas/data/api_fetch.ts";

export const loadAgentsEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(loadAgentsAsync.request)),
        switchMap(() =>
            from(loadAgents()).pipe(
                map(loadAgentsAsync.success),
                catchError(message => of(loadAgentsAsync.failure(message)))
            )
        )
    );

export const addAgentEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(upsertAgentAsync.request)),
        switchMap((action) =>
            from(upsertAgent(action.payload)).pipe(
                // map(upsertAgentAsync.success),
                map(loadAgentsAsync.request),
                catchError(message => of(upsertAgentAsync.failure(message)))
            )
        )
    );

export const deleteAgentEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(deleteAgentAsync.request)),
        switchMap((action) =>
            from(deleteAgent(action.payload)).pipe(
                // map(upsertAgentAsync.success),
                map(loadAgentsAsync.request),
                catchError(message => of(deleteAgentAsync.failure(message)))
            )
        )
    );
