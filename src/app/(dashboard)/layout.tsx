import React from "react";
import SidebarNav from "@/components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full relative">
        <div>
          <SidebarNav />
        </div>
        <div className="md:ml-64 md:mt-14 mt-14">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
