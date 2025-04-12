import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadAgentsAsync, selectedAgentAct} from "@/components/agentCanvas/data/agents_actions.ts";
import {loadLlmAsync, loadSettingsAsync, loadToolsAsync} from "@/data/actions.ts";
import {Toaster} from "sonner";
import {AgentsModel, RootState} from "typesafe-actions";
import {BotIcon} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode}) {
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list);
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadAgentsAsync.request());
        dispatch(loadSettingsAsync.request());
        dispatch(loadToolsAsync.request());
        dispatch(loadLlmAsync.request());
        setTimeout(()=>{
            setLoading(false);
        },4000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedAgent==="" && listOfAgents.length>0){
            console.log("update selectedAgent",listOfAgents );
            dispatch(selectedAgentAct(listOfAgents[0].uuid));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listOfAgents]);

    return (
        <>
            <div className="flex h-dvh overflow-auto ">
                {loading && <div className={"  absolute h-dvh overflow-auto bg-zinc-400/20 backdrop-blur-lg w-full z-11"}>
                    <div className={"blurContent  h-screen w-screen flex items-center justify-center  animate-moveToTopLeft "}>
                        <BotIcon  size={500} className={" stroke-emerald-100 opacity-40 blurContentSvg scaleToTopLeft"}/>
                    </div>
            </div>}
            {children}
            <Toaster position={"top-right"} theme={"dark"}/>
            </div>
        </>
    );
}

