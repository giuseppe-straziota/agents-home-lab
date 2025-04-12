import {Button} from "@/components/ui/button.tsx";
import {FieldValues, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {AgentsModel, RootState, TemplateTypeModel} from "typesafe-actions";
import {Node} from "@xyflow/react";
import {deleteToolAsync, upsertToolAsync} from "@/data/actions.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ConfType, LlmConfig, Template, ToolConfig} from "@/store/types";
import {ComponentManager} from "@/components/agentCanvas/utils/form/componentManager.tsx";
import DynamicFormContext from "./DynamicFormContext.ts";


export function DynamicFormTool({value, setOpenSheet}:
                                {
                                    value: Node | undefined,
                                    setOpenSheet: Dispatch<SetStateAction<boolean>>
                                }
) {
    const dispatch = useDispatch();
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list);
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);
    const tools = useSelector<RootState, TemplateTypeModel>((state: RootState) => state.settings.tools);
    const [selectedConf, setSelectedConf] = useState<{
        conf: Template,
        name: string,
        values: ToolConfig | LlmConfig
    } | undefined>();
    const {register, handleSubmit, setValue, unregister} = useForm();
    const componentSelected: { [key: string]: TemplateTypeModel } = {
        "tools": tools,
    };
    const [currentTool, setCurrentTool] = useState<ConfType>();

    useEffect(() => {
        const tool: ConfType | undefined = listOfAgents.find(agent => agent.uuid === selectedAgent)!.tools
            .find((tool: ConfType) => tool.tool_uuid === value!.id);
        setCurrentTool(tool);

        if (tool && tool.tool_config) {
            const conf = componentSelected[value!.data.type as unknown as string].find(tool => {
                return tool.name === value!.data.name;
            })!.template;
            if (tool && value!.data.type === "tools") {
                //here the string array is transformed into am array of uuid/value
                if (tool.tool_config.fields && tool.tool_config.fields.length > 0 && typeof tool.tool_config.fields[0] === "string") {
                    tool.tool_config.fields = tool.tool_config.fields
                        .map((field: string | { value: string; uuid: string; }) => {
                            return {value: field, uuid: "value_" + field};
                        }) as Array<{ value: string; uuid: string; }>;
                }
                if (tool.tool_config.parameters && typeof tool.tool_config.parameters === "object") {
                    tool.tool_config.parameters = JSON.stringify(tool.tool_config.parameters);
                }
                setSelectedConf({
                    conf: conf,
                    name: value!.data.name as unknown as string,
                    values: tool.tool_config
                });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = (data: FieldValues) => {
        console.log(data, currentTool);
        dispatch(upsertToolAsync.request(
            {
                tool_uuid: currentTool!.tool_uuid,
                agent_uuid: selectedAgent,
                fn_name: selectedConf!.name,
                config: {
                    tool_name: data.tool_name,
                    table: data.table || currentTool!.tool_config!.table,
                    parameters: data.parameters ? JSON.parse(data.parameters) : undefined,
                    fields: Object.keys(data)
                        .filter((key: string) => key.startsWith("value_"))
                        .reduce((acc: string[], key) => {
                            acc.push(data[key]);
                            return acc;
                        }, []),
                    description: data.description
                }
            }
        ));
        setOpenSheet(false);
    };

    const deleteTool = (): void => {
        console.log("deleting", value, currentTool);
        dispatch(deleteToolAsync.request({
            tool_uuid: value!.id,
            agent_uuid: currentTool!.agent_uuid,
            tool_name: currentTool!.tool_name!
        }));
        setOpenSheet(false);
    };

    return (selectedConf && (
            <DynamicFormContext.Provider value={{
                selectedConf,
                setSelectedConf,
                register,
                setValue,
                unregister
            }}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {Object.keys(selectedConf.conf)
                        .map((key: string) => {
                            return (

                                <ComponentManager
                                    key={key}
                                    element={selectedConf.conf}
                                    mapKey={key}/>
                            );
                        })
                    }
                    <div className={"flex flex-row gap-2 justify-end mr-2"}>
                        <Button type="button" onClick={deleteTool} className={"mx-1"}>delete</Button>
                        <Button type="submit" className={"mx-1"}>update</Button>
                        <Button type="button" onClick={() => {
                            setOpenSheet(false);
                        }} className={"mx-1"}>close</Button>
                    </div>
                </form>
            </DynamicFormContext.Provider>
        )

    );
}