import {useEffect, useState} from "react";
import {useSelector,useDispatch} from "react-redux";
import {RootState, TemplateTypeModel} from "typesafe-actions";
import {BrainCircuitIcon, Hammer, PlusIcon, TrashIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {LlmConfig, LlmRequest, Template, TemplateType, ToolConfig, ToolRequest} from "@/store/types";
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


import {FieldValues, useForm} from "react-hook-form";
import {upsertLlmAsync, upsertToolAsync} from "@/data/actions.ts";
import { Textarea } from "@/components/ui/textarea";


export default function RightPanel() {
    const dispatch = useDispatch();
    const tools = useSelector<RootState, TemplateTypeModel>((state: RootState) => state.settings.tools);
    const llm = useSelector<RootState, TemplateTypeModel>((state: RootState) => state.settings.llm);
    const [openSheet, setOpenSheet] = useState<boolean>(false);
    const [actionSelected, setActionSelected] = useState<string | undefined>(undefined);
    const [selectedConfRP, setSelectedConfRP] = useState<{
        conf: Template;
        name: string;
        values: LlmConfig | ToolConfig | undefined;
    }>();
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
    }
    ];

    useEffect(() => {
        if (!openSheet) {
            setActionSelected(undefined);
            setSelectedConfRP(undefined);
        }
    }, [openSheet]);

    const { register, handleSubmit, setValue, reset, unregister } = useForm();

    const onSubmit = (data:FieldValues) => {
        switch(actionSelected) {
            case "tools":
                dispatch(upsertToolAsync.request({
                    tool_uuid: undefined,
                    agent_uuid: selectedAgent,
                    fn_name: selectedConfRP!.name as unknown as string,
                    config: {
                        tool_name: data.tool_name,
                        table: data.table,
                        description: data.description,
                        fields: Object.keys(data)
                            .filter((key:string)=> key.startsWith("value_"))
                            .reduce((acc:Array<string> ,key) => { acc.push(data[key]); return acc;}, [] ),
                        action: data.action
                   }
                } as ToolRequest)); break;
            case "llm":
                dispatch(upsertLlmAsync.request({
                    llm_uuid: undefined,
                    agent_uuid: selectedAgent,
                    llm_name: selectedConfRP!.name  as unknown as string,
                    config: {description: data.description, prompt: data.prompt, model: data.model},
                } as LlmRequest)); break;
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
                            reset();
                        }}
                        variant={"ghost"} key={item.id}   >
                        <item.icon  className={"stroke-gray-400"}/>
                    </Button>
                   </TooltipTrigger>
               </Tooltip>
            ))}
        </div>
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent  className={"bg-zinc-800 text-zinc-500  overflow-y-auto overflow-x-none"}>
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
                                const conf:  Template=
                                    componentsList
                                        .find(component=>component.id === actionSelected)!.items
                                        .find(
                                            (t) => {
                                                return t.name === data;
                                            }
                                        )!.template;
                                setSelectedConfRP({name: data, conf: conf, values: {
                                        action: "",
                                        description: "",
                                        fields: [],
                                        table:"",
                                        tool_name:"",
                                    }});
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={"select a " + actionSelected}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {(componentsList
                                            .find(component=>component.id === actionSelected) || {items:[]}).items.map(
                                            (t: TemplateType) => {
                                                return <SelectItem key={t.name}
                                                    value={t.name}>{t.label}
                                                </SelectItem>;
                                            }
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    {selectedConfRP &&
                        <form  onSubmit={handleSubmit(onSubmit)} className="space-y-8  ">
                                         {Object.keys(selectedConfRP.conf)
                                                .map((key: string) => {
                                                    const element = selectedConfRP.conf[key];
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
                                                            <div className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                                                                <Label htmlFor={key}>{element.label}</Label>
                                                                <Textarea id={key}  className={"text-zinc-500 mb-2"} {...register(key)}/>
                                                            </div>
                                                        );
                                                    }
                                                    if (element.type === "array") {
                                                        let fieldsList = (selectedConfRP!.values as ToolConfig).fields as Array<{uuid:string, value:string}>;
                                                        return (
                                                            <div className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                                                                <div className={"flex flex-row gap-4"}>
                                                                <Label htmlFor={key}>{element.label}</Label>
                                                                    <Button className={"w-6 h-6 flex-end relative self-right hover:bg-zinc-700"} variant={"ghost"}
                                                                         onClick={() => {
                                                                                if ((selectedConfRP!.values as ToolConfig).fields) {
                                                                                    fieldsList.push({
                                                                                        uuid: "value_" + fieldsList.length,
                                                                                        value: ""
                                                                                    });
                                                                                } else {
                                                                                    fieldsList = [{
                                                                                        uuid: "value_0",
                                                                                        value: ""
                                                                                    }];
                                                                                }
                                                                                setSelectedConfRP!({...selectedConfRP});
                                                                            }}
                                                                            type="button" >
                                                                            <PlusIcon className={"stroke-zinc-300"}/>
                                                                    </Button>
                                                                </div>

                                                                {
                                                                    fieldsList &&
                                                                    fieldsList.map((field) => {
                                                                        return (<div className={"flex flex-row gap-2 pb-1"}>
                                                                            <Input type="text" id={field.uuid} defaultValue={field.value} {...register!(field.uuid)} />
                                                                            <Button type="button" className={"flex-end w-6 h-6 m-1 relative self-right hover:bg-zinc-700"} variant={"ghost"}
                                                                                    onClick={() => {
                                                                                        fieldsList = fieldsList.filter(val => {
                                                                                            return val.uuid !== field.uuid;
                                                                                        });
                                                                                        (selectedConfRP!.values as ToolConfig).fields = fieldsList;
                                                                                        setSelectedConfRP!({...selectedConfRP});
                                                                                        unregister!(field.uuid);
                                                                                    }
                                                                                    }>
                                                                                <TrashIcon className={"stroke-zinc-300"}/>
                                                                            </Button>
                                                                        </div>);
                                                                    })
                                                                }
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
                                                                            {(element.items as string[]).map(
                                                                                (item: string) => {
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
                            <Button type="submit" variant={"default"} className={"float-right mx-5"}>save</Button>
                        </form>
                    }
                </SheetContent>
            </Sheet>
        </>
    );
}

