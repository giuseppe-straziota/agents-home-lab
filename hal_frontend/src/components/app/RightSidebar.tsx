import { Database} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Store",
        url: "#",
        icon: Database,
    },
]

export function RightSidebar() {
    return (
        <Sidebar side={'right'} >
            <SidebarHeader>
                <div>Properties</div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>LLM</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem  key={'Agents'} title={"Agents"} >
                                {[{
                                    title: "OpenAi",
                                    url: "#",
                                    icon: Database,
                                }].map((item) => (
                                    <SidebarMenuSub key={item.title}>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuButton asChild >
                                                <div>
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
                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                                <SidebarMenuItem  key={'Tools'} title={"Agents"} >
                                        {items.map((item) => (
                                        <SidebarMenuSub key={item.title}>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuButton asChild >
                                                        <div>
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
                <SidebarGroup>
                    <SidebarGroupLabel>Memory</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem  key={'Memory'} title={"Agents"} >
                                {[{
                                    title: "mem",
                                    url: "#",
                                    icon: Database,
                                }].map((item) => (
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
        </Sidebar>
    )
}
