
import { from, of} from 'rxjs';
import {filter, switchMap, map, catchError} from 'rxjs/operators';
import { isActionOf} from 'typesafe-actions';

import {
    loadSettingsAsync
} from './actions';
import {SettingsModel} from "SettingsModel";
import { RootEpic } from 'MyTypes';

function loadAgent(): Promise<SettingsModel[]>  {
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

export const loadArticlesEpic: RootEpic = (action$, state$,) =>
    action$.pipe(
        filter(isActionOf(loadSettingsAsync.request)),
        switchMap(() =>
            from(loadAgent()).pipe(
                map(loadSettingsAsync.success),
                catchError(message => of(loadSettingsAsync.failure(message)))
            )
        )
    );
