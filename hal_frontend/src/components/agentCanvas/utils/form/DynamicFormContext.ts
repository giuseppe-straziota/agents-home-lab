import {createContext, Dispatch, SetStateAction} from "react";
import {LlmConfig, Template, ToolConfig} from "@/store/types";
import {FieldValues, UseFormRegister, UseFormSetValue, UseFormUnregister} from "react-hook-form";

export type DynamicContent = {
    selectedConf: { conf: Template,
        name: string,
        values: ToolConfig | LlmConfig}  ,

    setSelectedConf:Dispatch<SetStateAction<{
        conf: Template,
        name: string,
        values: ToolConfig | LlmConfig}| undefined>> ,
    register?: UseFormRegister<FieldValues> ,
    setValue?:  UseFormSetValue<FieldValues>,
    unregister?: UseFormUnregister<FieldValues> ,
}

// @ts-expect-error no initialization value
const DynamicFormContext = createContext<DynamicContent>();

export default DynamicFormContext;