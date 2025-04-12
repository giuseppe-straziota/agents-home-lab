
import { from, of} from "rxjs";
import {filter, switchMap, map, catchError} from "rxjs/operators";
import { isActionOf} from "typesafe-actions";

import {
    upsertToolAsync, deleteToolAsync,
    loadSettingsAsync, loadToolsAsync, loadLlmAsync, upsertLlmAsync, deleteLlmAsync, updateSettingsAsync
} from "./actions";
import { RootEpic } from "typesafe-actions";
import {
    upsertTool,
    deleteTool,
    loadConfiguration,
    loadTools,
    loadLlm,
    deleteLlm,
    upsertLlm,
    updateConfiguration
} from "@/data/api_fetch.ts";
import {loadAgentsAsync} from "@/components/agentCanvas/data/agents_actions.ts";
import {toast} from "sonner";


export const loadSettingsEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(loadSettingsAsync.request)),
        switchMap(() =>
            from(loadConfiguration()).pipe(
                map(loadSettingsAsync.success),
                catchError(message => of(loadSettingsAsync.failure(message)))
            )
        )
    );

export const updateSettingsEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(updateSettingsAsync.request)),
        switchMap((action) =>
            from(updateConfiguration(action.payload)).pipe(
                map(loadSettingsAsync.request, toast.success("Settings successfully updated")),
                catchError(message => of(updateSettingsAsync.failure(message)))
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

export const upsertToolEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(upsertToolAsync.request)),
        switchMap((action) =>
            from(upsertTool(action.payload)).pipe(
                map(loadAgentsAsync.request, toast.success("Successfully ".concat(action.payload.tool_uuid?"updated":"created"))),
                catchError(message => of(upsertToolAsync.failure(message)))
            )
        )
    );

export const deleteToolEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(deleteToolAsync.request)),
        switchMap((action) =>
            from(deleteTool(action.payload)).pipe(
                map(loadAgentsAsync.request, toast.success("Successfully deleted")),
                catchError(message => of(deleteToolAsync.failure(message)))
            )
        )
    );

export const loadLlmEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(loadLlmAsync.request)),
        switchMap(() =>
            from(loadLlm()).pipe(
                map(loadLlmAsync.success),
                catchError(message => of(loadLlmAsync.failure(message)))
            )
        )
    );

export const upsertLlmlEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(upsertLlmAsync.request)),
        switchMap((action) =>
            from(upsertLlm(action.payload)).pipe(
                map(loadAgentsAsync.request, toast.success("Successfully ".concat(action.payload.llm_uuid?"updated":"created"))),
                catchError(message => of(upsertLlmAsync.failure(message)))
            )
        )
    );

export const deleteLlmEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(deleteLlmAsync.request)),
        switchMap((action) =>
            from(deleteLlm(action.payload)).pipe(
                map(loadAgentsAsync.request, toast.success("Successfully deleted ")),
                catchError(message => of(deleteLlmAsync.failure(message)))
            )
        )
    );
