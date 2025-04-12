import {Button} from "@/components/ui/button.tsx";
import {FieldValues, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {AgentsModel, RootState, TemplateTypeModel} from "typesafe-actions";
import {Node} from "@xyflow/react";
import {deleteLlmAsync, upsertLlmAsync} from "@/data/actions.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ConfType, LlmConfig, Template, ToolConfig} from "@/store/types";
import {ComponentManager} from "@/components/agentCanvas/utils/form/componentManager.tsx";
import DynamicFormContext from "./DynamicFormContext.ts";


export function DynamicFormLlm({value, setOpenSheet}:
                             {value: Node | undefined,
                                    setOpenSheet: Dispatch<SetStateAction<boolean>>
                                   }
                            ) {
    const dispatch = useDispatch();
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list);
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);
     const llms = useSelector<RootState, TemplateTypeModel>((state: RootState) => state.settings.llm);
    const [selectedConf, setSelectedConf] = useState<{
        conf: Template;
        name: string;
        values: LlmConfig | ToolConfig;
    } | undefined>();
    const {register, handleSubmit, setValue,unregister} = useForm();
    const componentSelected: { [key: string]: TemplateTypeModel } = {
        "llms": llms
    };
    const [currentLlm, setCurrentLlm] = useState<ConfType>();

    useEffect(() => {


        const llm = listOfAgents.find(agent => agent.uuid === selectedAgent)!.llms
            .find((llm) => llm.llm_uuid  as unknown as string === value!.id);
        setCurrentLlm( llm);

        if (llm && llm.llm_config) {
            const conf = componentSelected[value!.data.type  as unknown as string ].find(tool => {
                return tool.name === value!.data.name;
            })!.template;

            setSelectedConf({
                conf: conf,
                name: value!.data.name as unknown as string,
                values:  llm.llm_config
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit  = (data: FieldValues) => {
        console.log(data);
          dispatch(upsertLlmAsync.request({
                    agent_uuid: selectedAgent,
                    config: {prompt: data.prompt, description: data.description, model: data.model},
                    llm_uuid: currentLlm!.llm_uuid,
                    llm_name: selectedConf!.name ,
            }));
        setOpenSheet(false);
    };

    const deleteTool = (): void => {
        console.log("deleting", value, currentLlm);
         dispatch(deleteLlmAsync.request({llm_uuid: value!.id, agent_uuid: selectedAgent, llm_name: selectedConf!.name}));
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
                                mapKey={key}   />
                    );
                })
            }
            <div className={"flex flex-row gap-2 justify-end mr-2"}>
                <Button type="button" onClick={deleteTool} className={"mx-1"}>delete</Button>
                <Button type="submit" className={"mx-1"}>update</Button>
                <Button type="button"  onClick={()=>{ setOpenSheet(false);}} className={"mx-1"}>close</Button>
            </div>
            </form>
        </DynamicFormContext.Provider>)
    );
}