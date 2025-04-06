import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useContext} from "react";
import DynamicFormContext from "@/components/agentCanvas/utils/form/DynamicFormContext.ts";

export const InputForm = (
   params: {
       mapKey: string;
        label: string;
    }
)=>{
    const {register, selectedConf} = useContext(DynamicFormContext);
    return (
        <div
            className="grid w-90 max-w-sm items-center gap-1  px-4 ">
            <Label htmlFor={params.mapKey}>{params.label}</Label>
            <Input className={"text-zinc-500 mb-1 pt-1"} type="text" id={params.mapKey}
                   defaultValue={(selectedConf!.values as unknown as {[key:string]:string})[params.mapKey]}
                   {...register!(params.mapKey)}/>
        </div>
    );
};