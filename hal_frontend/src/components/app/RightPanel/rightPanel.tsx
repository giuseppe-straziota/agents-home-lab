import {useEffect, useState} from "react";
import {useSelector,useDispatch} from "react-redux";
import {LlmModel, RootState, ToolsModel} from "typesafe-actions";
import {BrainCircuitIcon, Database, Hammer} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Llm, Tool} from "@/store/types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";


import { useForm, SubmitHandler } from "react-hook-form";
import {upsertLlmAsync, upsertToolAsync} from "@/data/actions.ts";
import { Textarea } from "@/components/ui/textarea";
interface ConfType {
   name:string;
   conf: { [key: string]: { [key: string]: string } }
}

export default function RightPanel() {
    const dispatch = useDispatch();
    const tools = useSelector<RootState, ToolsModel>((state: RootState) => state.settings.tools);
    const llm = useSelector<RootState, LlmModel>((state: RootState) => state.settings.llm);
    const [openSheet, setOpenSheet] = useState<boolean>(false);
    const [actionSelected, setActionSelected] = useState<string | undefined>(undefined);
    const [selectedConf, setSelectedConf] = useState<ConfType>();
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);

    const componentsList = [{
        title: "LLM",
        id: "llm",
        icon: BrainCircuitIcon,
        items: llm
    }, {
        title: "Tools",
        id: "tools",
        icon: Hammer,
        items: tools
    }, {
        title: "Store",
        id: "store",
        icon: Database,
        items: []
    }];

    useEffect(() => {
        if (!openSheet) {
            setActionSelected(undefined);
            setSelectedConf(undefined);
        }
    }, [openSheet]);

    const { register, handleSubmit, setValue } = useForm();

    const onSubmit: SubmitHandler<React.SyntheticEvent<HTMLFormElement>> = (data:React.SyntheticEvent<HTMLFormElement>) => {
        switch(actionSelected) {
            case "tools":
                dispatch(upsertToolAsync.request({
                    tool_uuid: undefined,
                    agent_uuid: selectedAgent,
                    fn_name: selectedConf!.name,
                    config: {
                        tool_name: data.tool_name, table: data.table,
                        field: data.field, action: data.action
                   }
                })); break;
            case "llm":
                dispatch(upsertLlmAsync.request({
                    llm_uuid: undefined,
                    agent_uuid: selectedAgent,
                    llm_name: selectedConf!.name,
                    config: {description: data.description, prompt: data.prompt, model: data.model},
                })); break;
            default: break;
        }
        console.log(selectedAgent, data);
        setOpenSheet(false);
    };

    return (
        <>
        <div className={"w-15 h-dvh  align-center flex flex-col flex-none  bg-zinc-800 gap-3 py-3"}>
            {componentsList.map((item) => (
               <Tooltip delayDuration={100}  key={item.id} >
                   <TooltipContent data-arrow={false}
                       side={"left"} sideOffset={5}  className={"rounded bg-zinc-700 border-1 border-zinc-600 "}>
                       <p>{item.title}</p>
                   </TooltipContent>
                   <TooltipTrigger asChild>
                    <Button className={"hover:bg-zinc-700"}
                        onClick={() => {
                            setOpenSheet(!openSheet);
                            setActionSelected(item.id);
                        }}
                        variant={"ghost"} key={item.id}   >
                        <item.icon  className={"stroke-gray-400"}/>
                    </Button>
                   </TooltipTrigger>
               </Tooltip>
            ))}
        </div>
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent  className={"bg-zinc-800 text-zinc-500"}>
                    <SheetHeader>
                        <SheetTitle className={"text-zinc-400"}>Add agent's components</SheetTitle>
                        <SheetDescription>
                            Add a new {actionSelected}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                            <Label>{"Select a " + actionSelected}</Label>
                            <Select onValueChange={(data) => {
                                console.log(data);
                                const conf: { [key: string]: { [key: string]: string } } =
                                    componentsList
                                        .find(component=>component.id === actionSelected)!.items
                                        .find(
                                            (t) => {
                                                return t.name === data;
                                            }
                                        )!.template;
                                setSelectedConf({name: data, conf: conf});
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={"select a " + actionSelected}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {(componentsList
                                            .find(component=>component.id === actionSelected) || {items:[]}).items.map(
                                            (t: Tool | Llm) => {
                                                return <SelectItem
                                                    value={t.name}>{t.name}
                                                </SelectItem>;
                                            }
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    {selectedConf &&
                        <form  onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                         {Object.keys(selectedConf.conf)
                                                .map((key: string) => {
                                                    const element = selectedConf.conf[key];
                                                    if (element.type === "input") {
                                                        return (
                                                            <div
                                                                className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                                                                <Label htmlFor={key}>{element.label}</Label>
                                                                <Input type="text" id={key} {...register(key)}/>
                                                            </div>
                                                        );
                                                    }
                                                    if (element.type === "textarea") {
                                                        return (
                                                            <div
                                                                className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                                                                <Label htmlFor={key}>{element.label}</Label>
                                                                <Textarea id={key} {...register(key)}/>
                                                            </div>
                                                        );
                                                    }
                                                    if (element.type === "select") {
                                                        return (
                                                            <div
                                                                className="grid w-90 max-w-sm items-center gap-1.5 p-4">
                                                                <Label>{"select a " + element.label}</Label>
                                                                <Select
                                                                    onValueChange={(data) => {
                                                                        console.log(data);
                                                                         setValue(key, data);
                                                                    }}>
                                                                    <SelectTrigger className="w-[180px]">
                                                                        <SelectValue
                                                                            placeholder={"select a " + element.label}/>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {element.items.map(
                                                                                (item) => {
                                                                                    return <SelectItem
                                                                                        value={item}>{item}
                                                                                    </SelectItem>;
                                                                                }
                                                                            )}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        );
                                                    }
                                                    return <div key={key}>{key}</div>;
                                                })
                                            }
                            <Button type="submit" className={"float-right mx-5"}>save</Button>
                        </form>
                    }
                </SheetContent>
            </Sheet>
        </>
    );
}

