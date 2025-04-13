
import { combineReducers } from "redux";
import {ActionType, AgentsModel, createReducer} from "typesafe-actions";
import {
    loadAgentsAsync, upsertAgentAsync, selectedAgentAct, loadAgentMsgAsync, setLastAgentMsgAct, setProcessingAct
} from "./agents_actions.ts";
import {BotIcon, BotOffIcon} from "lucide-react";
import {Message} from "@/store/types";

const reducer = combineReducers({
    list: createReducer([] as AgentsModel)
        .handleAction([loadAgentsAsync.success],
            // @ts-expect-error state is not used but lint don't know that it is here to stay ;)
            (state:AgentsModel, action: ActionType<typeof loadAgentsAsync.success>): AgentsModel => {
                return action.payload;
            }
         )
         .handleAction([upsertAgentAsync.success],
            (state:AgentsModel, action: ActionType<typeof upsertAgentAsync.success>): AgentsModel => {
                state.push( {
                    name: action.payload[0].name,
                    description: action.payload[0].description,
                    active: action.payload[0].active,
                    llms: [],
                    tools: [],
                    uuid: action.payload[0].uuid,
                    icon: action.payload[0]?BotIcon:BotOffIcon
                });
                return [...state];
            }
        ),
    selected: createReducer("")
        .handleAction([selectedAgentAct],
            // @ts-expect-error state is not used but lint don't know that it is here to stay ;)
            (state: string, action: ActionType<typeof selectedAgentAct>): string => {
                return action.payload;
            }
        ),
    selectedMsg: createReducer([] as Message[])
        .handleAction([loadAgentMsgAsync.success],
            // @ts-expect-error state is not used but lint don't know that it is here to stay ;)
            (state: Message[], action: ActionType<typeof loadAgentMsgAsync.success>): Message[] => {
                return action.payload;
            }
        ),
    lastAgentMsg: createReducer({} as Message)
        .handleAction([setLastAgentMsgAct],
            // @ts-expect-error state is not used but lint don't know that it is here to stay ;)
            (state: Message, action: ActionType<typeof setLastAgentMsgAct>): Message => {
                return action.payload;
            }
        ),
    processingState: createReducer("")
        .handleAction([setProcessingAct],
            // @ts-expect-error state is not used but lint don't know that it is here to stay ;)
            (state: string  , action: ActionType<typeof setProcessingAct>): string => {
                return action.payload;
            }
        )
});


export default reducer;