import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {AgentsModel, RootState, ToolsModel} from "typesafe-actions";
import {NodeMouseHandler} from "@xyflow/react";
import {deleteToolAsync, upsertToolAsync} from "@/data/actions.ts";
import {Dispatch, SetStateAction} from "react";


export function DynamicForm({node: {value, setOpenSheet}}:
                            {
                                node: {
                                    value: NodeMouseHandler | undefined,
                                    setOpenSheet: Dispatch<SetStateAction<boolean>>
                                }
                            }) {
    const dispatch = useDispatch();
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list)
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected)
    const tools = useSelector<RootState, ToolsModel>((state: RootState) => state.settings.tools);
    const {register, handleSubmit, setValue} = useForm()

    const selectedConf: {[key:string]: {[key:string]:string}} = tools.find(tool => {
        return tool.name === value!.data.fn
    })!.template
    const tool = listOfAgents.find(agent => agent.uuid === selectedAgent)!.tools.find((tool) => tool.tool_uuid === value!.id);

    const onSubmit: SubmitHandler<any> = (data) => {
        dispatch(upsertToolAsync.request({
            tool_uuid: tool.tool_uuid,
            agent_uuid: selectedAgent,
            fn_name: selectedConf.fn_name,
            config: {
                tool_name: data.tool_name ,
                table: data.table,
                field: data.field,
                action: data.action}
        }))
        console.log(data, tool)
        setOpenSheet(false)
    }

    const deleteTool = (event) => {
        console.log('deleting tool', value!.id);
        dispatch(deleteToolAsync.request({tool_uuid: value!.id}));
        setOpenSheet(false)
    }


    return (tool &&
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {Object.keys(selectedConf)
                .map((key: string) => {
                    const element = selectedConf[key];
                    if (element.type === 'input') {
                        return (
                            <div
                                className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                                <Label htmlFor={key}>{element.label}</Label>
                                <Input type="text" id={key} defaultValue={tool.tool_config[key]} {...register(key)}/>
                            </div>
                        )
                    }
                    if (element.type === 'select') {
                        return (
                            <div
                                className="grid w-90 max-w-sm items-center gap-1.5 p-4">
                                <Label>{'select a ' + element.label}</Label>
                                <Select defaultValue={tool.tool_config[key]}
                                        onValueChange={(data) => {
                                            console.log(data)
                                            setValue(key, data)
                                        }}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue
                                            placeholder={'select a ' + element.label}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {(element.items as string[]).map(
                                                (item) => {
                                                    return <SelectItem
                                                        value={item}>{item}
                                                    </SelectItem>
                                                }
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )
                    }
                    return <div key={key}>{key}</div>
                })
            }
            <Button type="button" onClick={deleteTool} className={'float-right mx-5'}>delete</Button>
            <Button type="submit" className={'float-right mx-5'}>update</Button>
        </form>
    )
}