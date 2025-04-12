
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
            (state:AgentsModel, action: ActionType<typeof loadAgentsAsync.success>): AgentsModel => {
                console.log("reducer action", action, state);
                return action.payload;
            }
         )
         .handleAction([upsertAgentAsync.success],
            (state:AgentsModel, action: ActionType<typeof upsertAgentAsync.success>): AgentsModel => {
                console.log("reducer action addAgentAsync", action, state);
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
            (state: string, action: ActionType<typeof selectedAgentAct>): string => {
                console.log("reducer action", action, state);
                return action.payload;
            }
        ),
    selectedMsg: createReducer([] as Message[])
        .handleAction([loadAgentMsgAsync.success],
            (state: Message[], action: ActionType<typeof loadAgentMsgAsync.success>): Message[] => {
                console.log("reducer action", action, state);
                return action.payload;
            }
        ),
    lastAgentMsg: createReducer({} as Message)
        .handleAction([setLastAgentMsgAct],
            (state: Message, action: ActionType<typeof setLastAgentMsgAct>): Message => {
                console.log("reducer action", action, state);
                return action.payload;
            }
        ),
    processingState: createReducer("")
        .handleAction([setProcessingAct],
            (state: string  , action: ActionType<typeof setProcessingAct>): string => {
                console.log("reducer action", action, state);
                return action.payload;
            }
        )
});


export default reducer;