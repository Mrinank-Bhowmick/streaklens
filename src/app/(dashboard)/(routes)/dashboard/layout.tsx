import React from "react";
import SidebarNav from "@/components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-7">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
