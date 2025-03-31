import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {AgentsModel, LlmModel, RootState, ToolsModel} from "typesafe-actions";
import {NodeMouseHandler} from "@xyflow/react";
import {deleteLlmAsync, deleteToolAsync, upsertLlmAsync, upsertToolAsync} from "@/data/actions.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea.tsx";


interface ConfType {
    name:string;
    conf: { [key: string]: { [key: string]: string } };
    values: object;
}

export function DynamicForm({node: {value, setOpenSheet}}:
                            {
                                node: {
                                    value: NodeMouseHandler | undefined,
                                    setOpenSheet: Dispatch<SetStateAction<boolean>>
                                }
                            }) {
    const dispatch = useDispatch();
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list);
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);
    const tools = useSelector<RootState, ToolsModel>((state: RootState) => state.settings.tools);
    const llms = useSelector<RootState, LlmModel>((state: RootState) => state.settings.llm);
    const [selectedConf, setSelectedConf] = useState<ConfType>();
    const {register, handleSubmit, setValue} = useForm();
    const componentSelected : {[key: string]: ToolsModel|LlmModel} = {
        "tools": tools,
        "llms": llms
    };



    const tool = listOfAgents.find(agent => agent.uuid === selectedAgent)!.tools.find((tool) => tool.tool_uuid === value!.id);
    const llm = listOfAgents.find(agent => agent.uuid === selectedAgent)!.llms.find((llm) => llm.llm_uuid === value!.id);

    useEffect(() => {
        const conf: { [key: string]: { [key: string]: string } } = componentSelected[value.data.type].find(tool => {
            return tool.name === value!.data.name;
        })!.template;
        setSelectedConf({
            conf: conf,
            name: value.data.type,
            values: value.data.type ==="tools"?tool.tool_config:llm.llm_config
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit: SubmitHandler<any> = (data) => {
        console.log(data, tool);
        switch (value!.data.type) {
            case "tools":
                (dispatch(upsertToolAsync.request({
                    tool_uuid: tool.tool_uuid,
                    agent_uuid: selectedAgent,
                    fn_name: selectedConf!.name,
                    config: {
                        tool_name: data.tool_name,
                        table: data.table,
                        field: data.field,
                        action: data.action
                    }
                })));
                break;
            case "llm":
                dispatch(upsertLlmAsync.request({
                    agent_uuid: selectedAgent,
                    config: {prompt: data.prompt, description: data.description},
                    llm_uuid: data.llm_uuid,
                    llm_name: selectedConf!.name,
                }));
                break;
        }

        setOpenSheet(false);
    };

    const deleteTool = (event):void => {
        console.log("deleting", value);
        dispatch(
            value!.data!.type === "tools"?deleteToolAsync.request({tool_uuid: value!.id}):
        dispatch(deleteLlmAsync.request({llm_uuid: value!.id})));

        setOpenSheet(false);
    };


    return (selectedConf &&
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {Object.keys(selectedConf.conf)
                .map((key: string) => {
                    const element = selectedConf.conf[key];
                    if (element.type === "input") {
                        return (
                            <div
                                className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                                <Label htmlFor={key}>{element.label}</Label>
                                <Input  className={"text-zinc-500 mb-2"} type="text" id={key} defaultValue={selectedConf.values[key]} {...register(key)}/>
                            </div>
                        );
                    }
                    if (element.type === "textarea") {
                        return (
                            <div
                                className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                                <Label htmlFor={key}>{element.label}</Label>
                                <Textarea  className={"text-zinc-500 mb-2"}  id={key} defaultValue={selectedConf.values[key]} {...register(key)}/>
                            </div>
                        );
                    }
                    if (element.type === "select") {
                        return (
                            <div
                                className="grid w-90 max-w-sm items-center gap-1.5 p-4">
                                <Label>{"select a " + element.label}</Label>
                                <Select defaultValue={selectedConf.values[key]}
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
            <Button type="button" onClick={deleteTool} className={"float-right mx-5"}>delete</Button>
            <Button type="submit" className={"float-right mx-5"}>update</Button>
        </form>
    );
}