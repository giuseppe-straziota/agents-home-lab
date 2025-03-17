import { StateType, ActionType } from 'typesafe-actions';
import { Epic } from 'redux-observable';


export interface Setting  {
    name:string,
    value: string,
}

export interface Tool {
    name: string,
    template: object
}

export interface Agent  {
    title:string,
    url: string,
    icon:  LucideIcon
}

declare module "typesafe-actions" {
    export type Store = StateType<typeof import("./store").default>;

    //export type RootState = StateType<typeof import("./root-reducer").default>;

    export type RootAction = ActionType<typeof import("./root-action").default>;

    export type SettingsModel = Setting[]
    export type ToolsModel = Tool[];
   // export type Store = StateType<typeof import('./index').default>;
   export type RootState = StateType<ReturnType<typeof import('./root-reducer').default>>;
   // export type RootAction = ActionType<typeof import('./root-action').default>;
    export type RootEpic = Epic<RootAction, RootAction, RootState>;
    export type AgentsModel = Agent[]
    interface Types {
        RootAction: ActionType<typeof import('./root-action').default>;
    }
}