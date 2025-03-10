export interface Setting  {
    name:string,
    value: string,
}


declare module 'SettingsModel' {
    export type SettingsModel = Setting[]
}

