import {InputForm} from "@/components/agentCanvas/utils/form/inputForm.tsx";
import {TextareaForm} from "@/components/agentCanvas/utils/form/textareaForm.tsx";
import {SelectForm} from "@/components/agentCanvas/utils/form/selectForm.tsx";
import {ArrayForm} from "@/components/agentCanvas/utils/form/arrayForm.tsx";
import {Template} from "@/store/types";

export const ComponentManager=(
    props:{
        element: Template,
        mapKey:string,
    }
)=>{
    const type = props.element[props.mapKey].type  as unknown as string;
    const label = props.element[props.mapKey].label  as unknown as string;
    const description = props.element[props.mapKey].description  as unknown as string;
    switch (type) {
        case "input": return (
            <InputForm mapKey={props.mapKey} label={label}    />
            );
        case "textarea": return (
            <TextareaForm  label={label}
                           mapKey={props.mapKey}
                           description={description}
            />
        );
        case "select": return (
            <SelectForm label={label}
                        mapKey={props.mapKey}
                        items={props.element[props.mapKey].items as unknown as string[]}/>
        );
        case "array": return (
            <ArrayForm
                mapKey={props.mapKey}
                fields={props.element[props.mapKey].fields as unknown as string[]}
                label={label} />
        );
        default: return <></>;
    }
};