import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useContext} from "react";
import DynamicFormContext from "@/components/agentCanvas/utils/form/DynamicFormContext.ts";

export const TextareaForm = (
    params: {
        mapKey: string;
        label: string;
        description: string;
    }
)=>{
    const {register, selectedConf} = useContext(DynamicFormContext);
    return (
        <div
            className="grid w-90 max-w-sm items-center gap-1.5 px-4">
            <Label htmlFor={params.mapKey}>{params.label}</Label>
            <Label>{params.description}</Label>
            <Textarea className={"text-zinc-500 mb-2"} id={params.mapKey} rows={5}
                      defaultValue={(selectedConf!.values as unknown as {[key:string]:string})[params.mapKey]}
                      {...register!(params.mapKey)}/>
        </div>
    );
};