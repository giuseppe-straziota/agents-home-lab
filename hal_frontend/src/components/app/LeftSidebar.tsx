import {ChevronUp, Home, LucideIcon, User2} from "lucide-react"

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
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import { useEffect, useState} from "react";

 interface Agent  {
    title:string,
        url: string,
        icon:  LucideIcon
}

export function LeftSidebar() {

    const [agents, setAgents] = useState([]);

    useEffect(() => {
        fetch('/api/agent', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setAgents(data.map((agent: { name: string; })=> {
                        return {
                            title: agent.name,
                            url:"#",
                            icon:Home,
                        }
                },));
            });
    }, []);

    return (
        <Sidebar side={'left'} >
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
