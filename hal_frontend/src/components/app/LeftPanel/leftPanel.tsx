import {Agent, Setting} from "@/store/types";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AgentsModel, RootState, SettingsModel} from "typesafe-actions";
import {BotIcon, PlusIcon, SettingsIcon, WrenchIcon} from "lucide-react";
import {Label} from "@radix-ui/react-dropdown-menu";
import {Button} from "@/components/ui/button.tsx";
import {deleteAgentAsync, selectedAgentAct, upsertAgentAsync} from "@/components/agentCanvas/data/agents_actions.ts";
import {useForm, SubmitHandler} from "react-hook-form";

import {Separator} from "@/components/ui/separator.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";
import {Switch} from "@/components/ui/switch.tsx";
import {TooltipTrigger, Tooltip, TooltipContent} from "@/components/ui/tooltip.tsx";
import {updateSettingsAsync} from "@/data/actions.ts";


export default function LeftPanel() {
    const dispatch = useDispatch();

    const [agents, setAgents] = useState<AgentsModel>([]);
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list);
    const selectedAgentUuid: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogSetting, setOpenDialogSetting] = useState<boolean>(false);
    const [isNewAgent, setIsNewAgent] = useState<boolean>(false);
    const [currentAgent, setCurrentAgent] = useState<Agent | undefined>(undefined);
    const settings = useSelector<RootState, SettingsModel>((state: RootState) => state.settings.configuration);
    const [configuration, setConfiguration] = useState<SettingsModel>([]);

    useEffect(() => {
        setAgents(listOfAgents);
        console.log(selectedAgentUuid);
        if (selectedAgentUuid === "" && listOfAgents.length > 0) {
            dispatch(selectedAgentAct(listOfAgents[0].uuid));
            setCurrentAgent(listOfAgents[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listOfAgents]);

    useEffect(() => {
        if (!openDialog) {
            setIsNewAgent(false);
        }
         
    }, [openDialog]);


    useEffect(() => {
        setConfiguration(settings);
    }, [settings]);


    type FormAgent = {
        name: string,
        uuid: string | undefined,
        active: boolean,
        description: string | undefined
    };

    const {register, handleSubmit, setValue, reset} = useForm<FormAgent>();
    
    type FormSetting = {[key: string]: string | number} ;

    const settingFormObj = useForm<FormSetting>();

    const upsertAgent: SubmitHandler<FormAgent> = (data) => {
        dispatch(upsertAgentAsync.request({
            agent_uuid: isNewAgent ? undefined : currentAgent!.uuid,
            name: data.name,
            active:   String(data.active) === "on" || String(data.active) === "true",
            description: data.description
        }));
        console.log(selectedAgentUuid, data);
        setOpenDialog(false);
    };

    const deleteAgent = () => {
        dispatch(deleteAgentAsync.request({agent_uuid: currentAgent!.uuid!}));
        setOpenDialog(false);
    };

    const updateSettings: SubmitHandler<FormSetting> = (data) => {
        console.log("upsert settings", data);
        dispatch(updateSettingsAsync.request(data));
        setOpenDialogSetting(false);
    };

    const getForm = useMemo(() => {
        return (
            <div>
                <div className={"py-2"}>
                    <Label className={"text-zinc-400 mb-2"}>Name</Label>
                    <Input className={"text-zinc-400 mb-2"}
                           defaultValue={isNewAgent ? "" : currentAgent?.name} id={"name"} {...register("name")}  />
                </div>
                <div className={"py-2"}>
                    <Label className={"text-zinc-400 mb-2"}>Description</Label>
                    <Input className={"text-zinc-400 mb-2"}
                           defaultValue={isNewAgent ? "" : currentAgent?.description}
                           id={"name"} {...register("description")}  />
                </div>
                <div key={"active"} className={"py-2"}>
                    <Label className={"text-zinc-400 mb-2"}>At work</Label>
                    <Switch defaultChecked={isNewAgent ? false : currentAgent?.active}
                            onCheckedChange={(state) => {
                                setValue("active", state);
                            }}
                            {...register("active")}
                    />
                </div>
                <div key={"uuid"} className={cn(isNewAgent ? "hidden" : "block", "py-2")}>
                    <Label className={"text-zinc-400 mb-2"}>Uuid</Label>
                    <Input className={"text-zinc-400 mb-2"} readOnly={true}
                           value={isNewAgent ? undefined : currentAgent?.uuid}
                           {...register("uuid")}
                           id={"uuid"}/>
                </div>
            </div>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAgent, isNewAgent]);


    return (
        <>
            <div className={"flex flex-col w-50 h-dvh flex-none bg-zinc-800 "}>
                <BotIcon size={100} className={"flex-none self-center m-5  stroke-emerald-100"}/>
                <div className={"flex-none flex flex-row gap-3 ml-4 mr-3"}>
                    <Label className={"text-left grow text-zinc-300"}>Agents</Label>
                    <Tooltip>
                        <TooltipContent side={"right"} data-arrow={false} sideOffset={13}  className={"rounded bg-zinc-700 border-1 border-zinc-600 "}>
                            <p>Create a new Agent</p>
                        </TooltipContent>
                        <TooltipTrigger asChild>
                            <Button className={"w-6 h-6 relative self-right hover:bg-zinc-700"} variant={"ghost"}
                                    onClick={() => {
                                        setIsNewAgent(!isNewAgent);
                                        reset();
                                        setOpenDialog(true);
                                    }}>
                                <PlusIcon className={"stroke-zinc-300"}/>
                            </Button>
                        </TooltipTrigger>
                    </Tooltip>

                </div>
                <Separator className={"flex-none h-1 my-3 bg-purple-300 "}/>
                <div className={"grow  "}>
                    {(agents || [])
                        .map((item: Agent) => (
                            <div key={item.uuid} className={"flex flex-row gap-5  w-full "}>
                                <div
                                    onClick={(event) => {
                                        dispatch(selectedAgentAct(item.uuid));
                                        event.stopPropagation();
                                        }
                                    }
                                    className={cn(selectedAgentUuid === item.uuid ? "bg-zinc-700" : "bg-zinc-800",
                                        "flex flex-row w-full gap-2  px-3 py-1 cursor-pointer hover:bg-zinc-600 "
                                    )}>
                                    <div className={"bg-teal-50 h-2/3 rounded-full mt-2"}>
                                        <item.icon  className={"align-center"}/>
                                    </div>
                                    <div className={"flex flex-col  w-full h-10 pl-1"}>
                                        <Label
                                            className={"text-left w-25  text-ellipsis text-nowrap overflow-hidden text-base text-zinc-300"}
                                            title={item.name}>{item.name}</Label>
                                        <Label
                                            className={"text-left w-25  text-ellipsis text-nowrap overflow-hidden text-xs text-zinc-500"}
                                            title={item.description}>
                                            {item.description}
                                        </Label>
                                    </div>
                                    <SettingsIcon size={"20"}
                                                  className={"flex-none relative stroke-zinc-500  hover:fill-cyan-300/60 mt-3"}
                                                  onClick={(event) => {
                                                      setOpenDialog(!openDialog);
                                                      setCurrentAgent(listOfAgents.find(agent => agent.uuid === item.uuid));
                                                      dispatch(selectedAgentAct(item.uuid));
                                                      reset();
                                                      event.stopPropagation();
                                                  }
                                                  }/>
                                </div>
                            </div>
                        ))}
                </div>
                <div className={"p-6 flex-none flex flex-row gap-3 cursor-pointer"}
                     onClick={() => {
                         setOpenDialogSetting(true);
                     }}>
                    <WrenchIcon
                        className={"stroke-zinc-500    hover:fill-cyan-400/70"}
                    />
                    <Label className={"text-zinc-500 hover:text-zinc-400"}>Settings</Label>
                </div>
            </div>


            <Dialog open={openDialog} onOpenChange={setOpenDialog} >
                <DialogContent className="sm:max-w-[425px]  bg-zinc-800 text-zinc-400">
                    <DialogHeader>
                        <DialogTitle>{isNewAgent?"Create a new Agent":"Edit Agent profile"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(upsertAgent)}>
                        {getForm}
                        <DialogFooter className={"p-2 my-3"}>
                            <Button type="button" disabled={isNewAgent} onClick={deleteAgent}>Remove Agent</Button>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={openDialogSetting} onOpenChange={setOpenDialogSetting}>
                <DialogContent className="sm:max-w-[425px]  bg-zinc-800 text-zinc-400">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your agent.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={settingFormObj.handleSubmit(updateSettings)}>
                        {
                            (configuration || []).map((conf: Setting) =>
                                <div key={conf.name} className={"py-2 "}>
                                    <Label className={"text-zinc-400 mb-2"}>{conf.description} </Label>
                                    {
                                       conf.type === "number" && <Input type="number" {...settingFormObj.register(conf.name)} defaultValue={Number.parseInt(conf.value)}/>
                                    }
                                </div>
                            )
                        }
                        <DialogFooter className={"p-2 my-3"}>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

