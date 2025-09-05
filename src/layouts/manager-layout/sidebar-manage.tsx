import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SidebarManage() {
  const { state } = useSidebar(); // "expanded" | "collapsed"

  const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    { title: "Settings", url: "#", icon: Settings },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="pt-[70px] transition-all duration-300 border-r border border-b-2"
      style={{
        width: state === "collapsed" ? "80px" : "260px",
      }}
    >
      <SidebarContent>
        {/* Toggle button */}
        <div
          className={`flex justify-end p-2 ${
            state === "collapsed" ? "justify-center" : "justify-start"
          }`}
        >
          <SidebarTrigger>
            {state === "collapsed" ? <ChevronRight /> : <ChevronLeft />}
          </SidebarTrigger>
        </div>

        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu
              className={`${
                state === "collapsed"
                  ? "flex flex-col items-center justify-center"
                  : ""
              }`}
            >
              <TooltipProvider delayDuration={100}>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          className={`h-14 hover:border-2 hover:border-black cursor-pointer border-2 rounded-xl flex items-center gap-2 transition-all duration-300 text-base mb-2
                          ${
                            state === "collapsed"
                              ? "justify-center p-4"
                              : "justify-start "
                          }`}
                        >
                          <span>
                            <item.icon
                              className={` ${
                                state === "collapsed" ? "w-6 h-6" : "w-5 h-5"
                              } `}
                            />
                            {state === "expanded" && (
                              <span className="text-primary">{item.title}</span>
                            )}
                          </span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {state === "collapsed" && (
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
