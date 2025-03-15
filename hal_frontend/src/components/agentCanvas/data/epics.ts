
import { from, of} from 'rxjs';
import {filter, switchMap, map, catchError} from 'rxjs/operators';
import { isActionOf} from 'typesafe-actions';

import {
    loadAgentAsync
} from './agents_actions.ts';
import {Bot} from "lucide-react";
import {AgentsModel} from "typesafe-actions";
import { RootEpic } from 'typesafe-actions';

function loadAgent(): Promise<AgentsModel>  {
    return new Promise((resolve) => {
        fetch('/api/agent', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log('data from api agent', data);
                resolve(data.map((agent: { name: string; }) => {
                    return {
                        title: agent.name,
                        url: "#",
                        icon: Bot,
                    }
                }) as AgentsModel)
            });
    })
}

export const loadArticlesEpic: RootEpic = (action$) =>
    action$.pipe(
        filter(isActionOf(loadAgentAsync.request)),
        switchMap(() =>
            from(loadAgent()).pipe(
                map(loadAgentAsync.success),
                catchError(message => of(loadAgentAsync.failure(message)))
            )
        )
    );
