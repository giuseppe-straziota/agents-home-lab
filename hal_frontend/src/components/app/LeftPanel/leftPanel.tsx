import {Agent} from "@/store/types";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {AgentsModel, RootState} from "typesafe-actions";
import {BotIcon, PlusIcon} from "lucide-react";
import {Label} from "@radix-ui/react-dropdown-menu";
import {Button} from "@/components/ui/button.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";


export default function LeftPanel() {
    const [agents, setAgents] = useState<AgentsModel>([]);
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list)


    useEffect(() => {
        setAgents(listOfAgents)
    }, [listOfAgents]);

    return (
        <div className={"w-50 flex-none bg-lime-50 p-5"}>
                <BotIcon size={100} className={'m-5'}/>

            <div className={"w-50 flex flex-row p-5 gap-3"}>
                <Label className={'py-5'}>Agents</Label>
                <Button>
                    <PlusIcon/>
                </Button>
            </div>
            {(agents || []).map((item: Agent) => (
                    <div key={item.title} className={'flex flex-row gap-5'}>
                        <div className={"rounded-full bg-gray shadow-lg w-fit p-1"}>
                            <item.icon/>
                        </div>
                        <span>{item.title}</span>
                    </div>
            ))}
            <Sheet open={false}>
                <SheetContent side={"left"}>
                    <SheetHeader>
                        <SheetTitle>ttt</SheetTitle>
                        <SheetDescription>
                            form
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

