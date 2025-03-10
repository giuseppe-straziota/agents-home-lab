import {ChevronUp, User2} from "lucide-react"

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import { useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { RootState } from 'MyTypes';
import { AgentsModel } from "AgentModel";
import {Agent} from "@/components/agentCanvas/data/types";

export function LeftSidebar() {

    const [agents, setAgents] = useState<AgentsModel>([]);
    const listOfAgents = useSelector<AgentsModel>( (state: RootState) => state.agents.list)

    useEffect(() => {
            setAgents(listOfAgents as AgentsModel || [])
    }, [listOfAgents]);

    return (
        <Sidebar side={'left'}>
            <SidebarHeader>
                <div>Home Agents Lab</div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Agents</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                                <SidebarMenuItem  key={'Agents'} title={"Agents"} >
                                        {agents.map((item:Agent) => (
                                        <SidebarMenuSub key={item.title}>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuButton asChild >
                                                        <div key={item.title}>
                                                            <item.icon />
                                                            <span>{item.title}</span>
                                                        </div>
                                                </SidebarMenuButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                        ))}
                                    </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <User2 /> Admin
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-[--radix-popper-anchor-width]"
                                >
                                    <DropdownMenuItem>
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
