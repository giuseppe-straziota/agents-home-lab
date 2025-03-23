import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadAgentsAsync, selectedAgentAct} from "@/components/agentCanvas/data/agents_actions.ts";
import {loadSettingsAsync, loadToolsAsync} from "@/data/actions.ts";
import {Toaster} from "sonner";
import {AgentsModel, RootState} from "typesafe-actions";


export default function Layout({ children }: { children: React.ReactNode}) {
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list)
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadAgentsAsync.request());
        dispatch(loadSettingsAsync.request());
        dispatch(loadToolsAsync.request())
    }, []);

    useEffect(() => {
        if (selectedAgent==="" && listOfAgents.length>0){
            console.log('update selectedAgent',listOfAgents );
            dispatch(selectedAgentAct(listOfAgents[0].uuid))
        }
    }, [listOfAgents]);

    return (
        <>
            <div className="flex h-dvh overflow-auto ">
                {children}
                <Toaster/>
            </div>
        </>
    )
}

