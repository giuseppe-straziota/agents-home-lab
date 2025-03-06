import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {LeftSidebar} from "@/components/app/LeftSidebar.tsx";
import {RightSidebar} from "@/components/app/RightSidebar.tsx";

export default function Layout({ children }: { children: React.ReactNode}) {
    return (
        <>
            <SidebarProvider style={{
            }}>
                <LeftSidebar />
                        {/*<SidebarTrigger />*/}

                        {children}
            </SidebarProvider>
            <SidebarProvider>
                <LeftSidebar />
                <RightSidebar />
            </SidebarProvider>
        </>
    )
}

