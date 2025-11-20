import React from 'react'
import {SidebarInset} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarProvider} from "@/components/ui/sidebar";

const Layout = ({children}: { children: React.ReactNode }) => {
  return (
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
  )
}
export default Layout
