import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState, SettingsModel, ToolsModel} from "typesafe-actions";
import {Database, Hammer} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.tsx";
import { Tool } from "@/store/types";


export default function RightPanel() {

    const [configuration, setConfiguration] = useState<SettingsModel>([]);
    const settings = useSelector<RootState, SettingsModel>((state: RootState) => state.settings.configuration);
    const tools = useSelector<RootState, ToolsModel>((state: RootState) => state.settings.tools);

    useEffect(() => {
        setConfiguration(settings);
    }, [settings]);

    return (
        <div className={"w-20 align-center flex flex-col flex-none  bg-lime-50 gap-3 p-3"}>
            {[{
                title: "OpenAi",
                icon: Database,
            }, {
                title: "Tools",
                icon: Hammer,
            }, {
                title: "Store",
                icon: Database,
            }].map((item) => (

                <Sheet>
                    <SheetTrigger asChild>
                        <Button  variant={'outline'} key={item.title} title={item.title} className={'w-15 p-5'}>
                              <item.icon/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                    <SheetHeader>
                    <SheetTitle>{item.title}</SheetTitle>
                    <SheetDescription>
                        {(item.title === 'Tools') &&
                                tools.map(
                                (t:Tool) => {  return <div> {t.name} {JSON.stringify(t.template)} </div>  }
                                )
                        }
                    </SheetDescription>
                    </SheetHeader>
                    </SheetContent>
                </Sheet>
            ))}
            {
                (configuration || []).map((conf: { value: string, name: string }) =>
                    <div className="bg-gray-400" key={conf.name}>{conf.name}:{conf.value}</div>)
            }
        </div>
    )
}

