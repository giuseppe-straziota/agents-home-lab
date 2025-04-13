import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useContext} from "react";
import DynamicFormContext from "@/components/agentCanvas/utils/form/DynamicFormContext.ts";

export const SelectForm = (
    params: {
        mapKey: string;
        label: string;
        items: Array<string>;
    }
)=>{
    const {setValue,selectedConf} = useContext(DynamicFormContext);
    return (
            <div
                className="grid w-90 max-w-sm items-center gap-1.5 p-4">
                <Label>{"select a " + params.label}</Label>
                <Select defaultValue={(selectedConf!.values as unknown as {[key:string]:string})[params.mapKey]}
                        onValueChange={(data) => {
                            setValue!(params.mapKey, data);
                        }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={"select a " + params.label}/>
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup>
                            {(params.items).map(
                                (item) => {
                                    return <SelectItem key={item}
                                                       value={item}>{item}
                                    </SelectItem>;
                                }
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
    );
};