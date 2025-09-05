import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarManage } from "./sidebar-manage";
import Header from "./header";
import { Outlet } from "react-router-dom";

const ManageLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <SidebarManage />

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6 bg-muted transition-all duration-300 ">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ManageLayout;
