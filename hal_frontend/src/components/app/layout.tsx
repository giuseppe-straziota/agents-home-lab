import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {loadAgentAsync} from "@/components/agentCanvas/data/agents_actions.ts";
import {loadSettingsAsync, loadToolsAsync} from "@/data/actions.ts";


export default function Layout({ children }: { children: React.ReactNode}) {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadAgentAsync.request());
        dispatch(loadSettingsAsync.request());
        dispatch(loadToolsAsync.request())
    }, []);

    return (
        <>
            <div className="flex h-dvh overflow-auto ">
                {children}
            </div>
        </>
    )
}

