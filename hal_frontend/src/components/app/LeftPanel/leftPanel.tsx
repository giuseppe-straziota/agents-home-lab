import {Agent} from "@/store/types";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {AgentsModel, RootState} from "typesafe-actions";


export default function LeftPanel() {
    const [agents, setAgents] = useState<AgentsModel>([]);
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list)


    useEffect(() => {
        setAgents(listOfAgents)
    }, [listOfAgents]);

    return (
        <div className={"w-50 flex-none  bg-gray-200 p-5"}>
            {(agents || []).map((item: Agent) => (
                    <div key={item.title} className={'flex flex-row gap-5'}>
                        <item.icon/>
                        <span>{item.title}</span>
                    </div>
            ))}
        </div>
    )
}

