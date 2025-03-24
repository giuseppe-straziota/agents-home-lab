import {useEffect, useState} from "react";
import {useSelector,useDispatch} from "react-redux";
import {RootState, SettingsModel, ToolsModel} from "typesafe-actions";
import {Database, Hammer} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Tool} from "@/store/types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";


import { useForm, SubmitHandler } from "react-hook-form"
import {createToolAsync} from "@/data/actions.ts";
interface ConfType {
   fn_name:string;
   conf: { [key: string]: { [key: string]: string } }
}

export default function RightPanel() {
    const dispatch = useDispatch();
    const [configuration, setConfiguration] = useState<SettingsModel>([]);
    const settings = useSelector<RootState, SettingsModel>((state: RootState) => state.settings.configuration);
    const tools = useSelector<RootState, ToolsModel>((state: RootState) => state.settings.tools);
    const [openSheet, setOpenSheet] = useState<boolean>(false);
    const [actionSelected, setActionSelected] = useState<string | undefined>(undefined);
    const [selectedConf, setSelectedConf] = useState<ConfType>();
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected)


    useEffect(() => {
        setConfiguration(settings);
    }, [settings]);

    useEffect(() => {
        if (!openSheet) {
            setActionSelected(undefined)
            setSelectedConf(undefined)

        }
    }, [openSheet]);

    const { register, handleSubmit, setValue } = useForm()
    const onSubmit: SubmitHandler<any> = (data) => {
        dispatch(createToolAsync.request({
            agent_uuid: selectedAgent,
            fn_name: selectedConf.fn_name,
            config: { tool_name: data.tool_name , table: data.table,
                field: data.field, action: data.action}
        }))
        console.log(selectedAgent, data)
        setOpenSheet(false);

    }

    return (
        <div className={"w-20 align-center flex flex-col flex-none  bg-lime-50 gap-3 p-3"}>
            {[{
                title: "LLM",
                icon: Database,
            }, {
                title: "Tools",
                icon: Hammer,
            }, {
                title: "Store",
                icon: Database,
            }].map((item) => (
                <Button
                    onClick={() => {
                        setOpenSheet(!openSheet);
                        setActionSelected(item.title)
                    }}
                    variant={'outline'} key={item.title} title={item.title} className={'w-15 p-5'}>
                    <item.icon/>
                </Button>

            ))}
            {
                (configuration || []).map((conf: { value: string, name: string }) =>
                    <div className="bg-gray-400" key={conf.name}>{conf.name}:{conf.value}</div>)
            }
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{actionSelected}</SheetTitle>
                        <SheetDescription>
                            Create your new tool
                        </SheetDescription>
                    </SheetHeader>
                    {(actionSelected === 'Tools') &&
                        <div className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                            <Label>{'select a ' + actionSelected}</Label>
                            <Select onValueChange={(data) => {
                                console.log(data)
                                const conf: { [key: string]: { [key: string]: string } } = tools.find(
                                    (t) => {
                                        return t.name === data
                                    }
                                )!.template;
                                setSelectedConf({fn_name: data, conf: conf})
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={'select a ' + actionSelected}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {tools.map(
                                            (t: Tool) => {
                                                return <SelectItem
                                                    value={t.name}>{t.label}
                                                </SelectItem>
                                            }
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    {selectedConf &&
                        <form  onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                         {Object.keys(selectedConf.conf)
                                                .map((key: string) => {
                                                    const element = selectedConf.conf[key];
                                                    if (element.type === 'input') {
                                                        return (
                                                            <div
                                                                className="grid w-90 max-w-sm items-center gap-1.5 px-4">
                                                                <Label htmlFor={key}>{element.label}</Label>
                                                                <Input type="text" id={key} {...register(key)}/>
                                                            </div>
                                                        )
                                                    }
                                                    if (element.type === 'select') {
                                                        return (
                                                            <div
                                                                className="grid w-90 max-w-sm items-center gap-1.5 p-4">
                                                                <Label>{'select a ' + element.label}</Label>
                                                                <Select
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
                                                                            {element.items.map(
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
                            <Button type="submit" className={'float-right mx-5'}>save</Button>
                        </form>
                    }
                </SheetContent>
            </Sheet>
        </div>
    )
}

