import React from "react";
import SidebarNav from "@/components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full relative">
        <div>
          <SidebarNav />
        </div>
        <div className="ml-64 mt-12">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
