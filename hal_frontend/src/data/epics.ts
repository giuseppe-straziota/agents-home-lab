
import { from, of} from 'rxjs';
import {filter, switchMap, map, catchError} from 'rxjs/operators';
import { isActionOf} from 'typesafe-actions';

import {
    loadSettingsAsync, loadToolsAsync
} from './actions';
import {SettingsModel, ToolsModel} from "typesafe-actions";
import { RootEpic } from 'typesafe-actions';

function loadAgent(): Promise<SettingsModel>  {
    return new Promise((resolve) => {
        fetch('/api/configuration', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                resolve(data);
            });

    })
}
function loadTools(): Promise<ToolsModel>  {
    return new Promise((resolve) => {
        fetch('/api/tool', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                resolve(data);
            });

    })
}

export const loadArticlesEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(loadSettingsAsync.request)),
        switchMap(() =>
            from(loadAgent()).pipe(
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
