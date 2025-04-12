
import { from, of} from "rxjs";
import { filter, switchMap, map, catchError} from "rxjs/operators";
import { isActionOf } from "typesafe-actions";

import {
    upsertAgentAsync,
    loadAgentsAsync,
    deleteAgentAsync, loadAgentMsgAsync,
} from "./agents_actions.ts";
import { RootEpic } from "typesafe-actions";
import {upsertAgent, loadAgents, deleteAgent, loadAgentMsg} from "@/components/agentCanvas/data/api_fetch.ts";
import {toast} from "sonner";

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
                map(loadAgentsAsync.request, toast.success("Successfully created")),
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
                map(loadAgentsAsync.request, toast.success("Successfully deleted")),
                catchError(message => of(deleteAgentAsync.failure(message)))
            )
        )
    );

export const loadAgentMsgEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(loadAgentMsgAsync.request)),
        switchMap((action) =>
            from(loadAgentMsg(action.payload.agent_uuid)).pipe(
                map(loadAgentMsgAsync.success),
                catchError(message => of(loadAgentMsgAsync.failure(message)))
            )
        )
    );
