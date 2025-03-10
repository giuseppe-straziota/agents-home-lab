export interface Agent  {
    title:string,
    url: string,
    icon:  LucideIcon
}


declare module 'AgentModel' {
    export type AgentsModel = Agent[]
}

