import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon, TrashIcon} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useContext} from "react";
import DynamicFormContext from "@/components/agentCanvas/utils/form/DynamicFormContext.ts";
import {ToolConfig} from "@/store/types";

export const ArrayForm = (
    params: {
        mapKey: string;
        label: string;
        fields: Array<string>;
    }
)=>{
    const {setSelectedConf,selectedConf,register, unregister} = useContext(DynamicFormContext);
    let fieldsList = (selectedConf!.values as ToolConfig).fields as Array<{uuid:string, value:string}>;
    return (
        <div className="grid w-90 max-w-sm items-center gap-1.5 px-4  pb-1">
            <div className={"flex flex-row gap-4 pb-1"}>
                <Label htmlFor={params.mapKey}>{params.label}</Label>
                <Button className={"w-6 h-6 relative self-right hover:bg-zinc-700"} variant={"ghost"}
                        onClick={() => {
                            if ((selectedConf!.values as ToolConfig).fields) {
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
                            setSelectedConf!({...selectedConf});
                        }}
                        type="button"  >
                    <PlusIcon/>
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
                                    (selectedConf!.values as ToolConfig).fields = fieldsList;
                                    setSelectedConf!({...selectedConf});
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
};