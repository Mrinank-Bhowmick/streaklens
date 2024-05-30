import React from "react";
import SidebarNav from "@/components/sidebar";
import { ClerkProvider } from "@clerk/nextjs";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="h-full relative">
        <div>
          <SidebarNav />
        </div>
        <div className="md:ml-64 md:mt-14 mt-14 text-white">{children}</div>
      </div>
    </ClerkProvider>
  );
};

export default DashboardLayout;
