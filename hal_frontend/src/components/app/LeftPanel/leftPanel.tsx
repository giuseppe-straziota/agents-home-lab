import {Agent} from "@/store/types";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AgentsModel, RootState, SettingsModel} from "typesafe-actions";
import {BotIcon, PlusIcon, SettingsIcon, WrenchIcon} from "lucide-react";
import {Label} from "@radix-ui/react-dropdown-menu";
import {Button} from "@/components/ui/button.tsx";
import {deleteAgentAsync, selectedAgentAct, upsertAgentAsync} from "@/components/agentCanvas/data/agents_actions.ts";
import { useForm, SubmitHandler } from "react-hook-form"

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


export default function LeftPanel() {
    const dispatch = useDispatch();

    const [agents, setAgents] = useState<AgentsModel>([]);
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list)
    const selectedAgentUuid: string = useSelector<RootState, string>((state: RootState) => state.agents.selected)
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogSetting, setOpenDialogSetting] = useState<boolean>(false);
    const [isNewAgent, setIsNewAgent] = useState<boolean>(false);
    const [currentAgent, setCurrentAgent] = useState<Agent | undefined>(undefined);
    const settings = useSelector<RootState, SettingsModel>((state: RootState) => state.settings.configuration);
    const [configuration, setConfiguration] = useState<SettingsModel>([]);
    useEffect(() => {
        setAgents(listOfAgents)
        console.log(selectedAgentUuid)
        if (selectedAgentUuid ==="" && listOfAgents.length>0){
            dispatch(selectedAgentAct(listOfAgents[0].uuid))
            setCurrentAgent(listOfAgents[0])
        }
    }, [listOfAgents]);

    useEffect(() => {
        if (!openDialog){
            setIsNewAgent(false)
        }
    }, [openDialog]);


    useEffect(() => {
        setConfiguration(settings);
    }, [settings]);

    type FormAgent = {
        name:string,
        uuid:string|undefined,
        active:boolean
    };

    const { register, handleSubmit, setValue , reset} = useForm<FormAgent>( )

    const upsertAgent: SubmitHandler<FormAgent> = (data) => {
        dispatch(upsertAgentAsync.request({
            agent_uuid: isNewAgent?undefined:currentAgent!.uuid,
            name: data.name,
            active: data.active
        }))
        console.log(selectedAgentUuid, data)
        setOpenDialog(false)
    }

    const deleteAgent = (event)=>{
        console.log(event, currentAgent?.uuid)
        dispatch(deleteAgentAsync.request({agent_uuid: currentAgent!.uuid!}))
        setOpenDialog(false)
    }

    const getForm = useMemo(()=>{
        return (
            <div>
                <div  className={'py-2'}>
                    <Label>Name</Label>
                    <Input defaultValue={isNewAgent?"":currentAgent?.name} id={'name'} {...register('name')}  />
                </div>
                <div key={'active'}  className={'py-2'}>
                    <Label>At work</Label>
                    <Switch defaultChecked={isNewAgent?false:currentAgent?.active}
                            onCheckedChange={(state)=>{
                                setValue('active', state)
                            }}
                            {... register('active')}
                    />
                </div>
                <div key={'uuid'} className={cn(isNewAgent?"hidden":"block",'py-2')}>
                    <Label>Uuid</Label>
                    <Input readOnly={true} value={isNewAgent?undefined:currentAgent?.uuid}
                           {...register('uuid')}
                          id={'uuid'} />
                </div>
              </div>
        )

    }, [currentAgent,isNewAgent])


    return (
        <>
        <div className={"w-50 flex-none bg-lime-50 p-5"}>
             <BotIcon size={100} className={'m-5'}/>
            <div className={" flex flex-row gap-3 "}>
                <Label  >Agents</Label>
                <Button className={'w-6 h-6 relative'}
                    onClick={()=>{
                        setIsNewAgent(!isNewAgent);
                        reset();
                        setOpenDialog(true);
                }}>
                    <PlusIcon/>
                </Button>
            </div>
            <Separator  className={'h-2 my-5 bg-black '}/>
            {(agents || [])
                .map((item: Agent) => (
                    <div key={item.uuid} className={'flex flex-row gap-5 py-2 w-full '}>
                        <div
                            onClick={(event) => {
                                dispatch(selectedAgentAct(item.uuid))
                                event.stopPropagation();
                                }
                            }
                            className={cn(selectedAgentUuid === item.uuid ? 'bg-sky-300' : 'bg-white' ,
                                "flex flex-row rounded-lg shadow-lg w-full gap-2  p-2 cursor-pointer hover:bg-sky-200 "
                            )}>
                            <item.icon/>
                            <span className={'grow'}>{item.name}</span>
                            <SettingsIcon size={'20'} className={'flex-none relative my-1 hover:fill-yellow-300/60'}
                                onClick={(event)=>{
                                    setOpenDialog(!openDialog)
                                    setCurrentAgent(listOfAgents.find(agent=>agent.uuid === item.uuid))
                                    dispatch(selectedAgentAct(item.uuid))
                                    reset();
                                    event.stopPropagation();
                                }
                            }/>
                        </div>
                    </div>
            ))}

            <Dialog open={openDialog} onOpenChange={setOpenDialog}  >
                <DialogContent className="sm:max-w-[425px]" >
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your agent.
                        </DialogDescription>
                    </DialogHeader>
                    <form  onSubmit={handleSubmit(upsertAgent)}>
                        {getForm}
                        <DialogFooter className={'p-2 my-3'}>
                            <Button type="button" disabled={isNewAgent} onClick={deleteAgent} >Remove Agent</Button>
                            <Button type="submit" >Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        <div className={'absolute bottom-0 p-6'}
             title={'test'}>
            <WrenchIcon
                className={'hover:fill-blue-400/70'}
                onClick={() => {setOpenDialogSetting(true)}}
            />
            <Dialog open={openDialogSetting} onOpenChange={setOpenDialogSetting}  >
                <DialogContent className="sm:max-w-[425px]" >
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your agent.
                        </DialogDescription>
                    </DialogHeader>
                    <form  onSubmit={handleSubmit(upsertAgent)}>
                        {
                            (configuration || []).map((conf: { value: string, name: string }) =>
                                <div key={conf.name}  className={'py-2'}>
                                    <Label>{conf.name} </Label>
                                    <Switch defaultChecked={conf.value==="true"}
                                            onCheckedChange={(state)=>{

                                            }}

                                    />
                                </div>
                            )
                        }
                        <DialogFooter className={'p-2 my-3'}>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        </>
    )
}

