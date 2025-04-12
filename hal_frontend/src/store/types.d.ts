import { StateType, ActionType } from "typesafe-actions";
import { Epic } from "redux-observable";


export interface Setting  {
    name:string,
    value: string,
    type?: string,
    description?: string,
}

export interface Template {
    [key: string]:
        {
            [key: string]: string | string[]
        }
}

export interface TemplateType {
    name: string,
    template: Template,
    label: string
}

export interface LlmConfig { description:string, model:string,prompt:string }
export interface ToolConfig {
    action: string,
    description: string,
    fields: string[] | Array<{ value: string; uuid: string;}>,
    table:string,
    tool_name:string,
    parameters?: string
}

export interface ConfType  {
    agent_uuid: string,
    name: string,
    llm_config?: LlmConfig,
    llm_name?: string,
    llm_uuid?: string,
    tool_config?: ToolConfig,
    tool_name?: string,
    tool_uuid?: string,
}


export interface Agent  {
    name:string,
    active: boolean,
    icon:  LucideIcon,
    llms: Array<ConfType>,
    tools: Array<ConfType>,
    uuid: string,
    description: string
}

export interface AgentRequest {
    agent_uuid: string|undefined,
    name:string,
    active: boolean,
    description: string|undefined,
}

export interface ToolRequest {
    agent_uuid: string,
    fn_name: string,
    config: { tool_name: string , table: string,
        fields: string[], description: string, parameters?: object },
    tool_uuid: string|undefined,
}
export interface LlmRequest {
    agent_uuid: string,
    llm_name: string,
    config: { description: string, prompt: string, model: string },
    llm_uuid: string|undefined,
}

export interface Message {
    role: string;
    content: string;
    timestamp: number;
    agent_uuid: string;
}

declare module "typesafe-actions" {
    export type Store = StateType<typeof import("./store").default>;

    //export type RootState = StateType<typeof import("./root-reducer").default>;

    export type RootAction = ActionType<typeof import("./root-action").default>;

    export type SettingsModel = Setting[]
    export type TemplateTypeModel = TemplateType[];
    //export type ToolsModel = Tool[];
    //export type LlmModel = Llm[];
   // export type Store = StateType<typeof import('./index').default>;
   export type RootState = StateType<ReturnType<typeof import("./root-reducer").default>>;
   // export type RootAction = ActionType<typeof import('./root-action').default>;
    export type RootEpic = Epic<RootAction, RootAction, RootState>;
    export type AgentsModel = Agent[];
    interface Types {
        RootAction: ActionType<typeof import("./root-action").default>;
    }
}