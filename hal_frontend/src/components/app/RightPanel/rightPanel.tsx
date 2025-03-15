import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import { RootState, SettingsModel} from "typesafe-actions";
import {Database, Hammer} from "lucide-react";


export default function RightPanel() {

    const [configuration, setConfiguration] = useState<SettingsModel>([]);
    const settings = useSelector<RootState, SettingsModel>((state: RootState) => state.settings.list);

    useEffect(() => {
        setConfiguration(settings);
    }, [settings]);

    return (
        <div className={"w-50  flex-none  bg-gray-200 "}>
            {
                (configuration || []).map((conf: { value: string, name: string }) =>
                    <div className="bg-gray-400" key={conf.name}>{conf.name}:{conf.value}</div>)
            }

            {[{
                title: "OpenAi",
                url: "#",
                icon: Database,
            }, {
                title: "Tools",
                url: "#",
                icon: Hammer,
            }, {
                title: "Store",
                url: "#",
                icon: Database,
            }].map((item) => (
                <div key={item.title} className={'flex flex-row gap-5 p-5'}>
                        <item.icon/>
                        <span>{item.title}</span>
                </div>
            ))}
        </div>
    )
}

