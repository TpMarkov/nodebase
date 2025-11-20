"use client"
import React from 'react'
import {CreditCardIcon, FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, StarIcon} from "lucide-react";
import {
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel, SidebarHeader, SidebarInput,
  SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";

const menuItems = [
  {
    title: "Executions",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows"
      }
    ]
  },
  {
    title: "Executions",
    items: [
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions"
      }
    ]
  },
  {
    title: "Credentials",
    items: [
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials"
      }
    ]
  }
]

export const AppSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
      <Sidebar collapsible={"icon"}>
        <SidebarHeader>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={"gap-x-4"}>
              <Link href={"/"} prefetch className="flex items-center gap-2">
                <Image src="/logos/logo.svg" alt="logo-svg" width={30} height={30}/>
                <span className="font-semibold text-sm">NodeBase</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {menuItems.flatMap(group => group.items).map(item => (
                  <SidebarGroupContent key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                          tooltip={item.title}
                          isActive={item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)}
                          asChild
                          className="gap-x-4 h-10 px-4"
                      >
                        <Link href={item.url} prefetch>
                          <item.icon className="size-4"/>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarGroupContent>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                  tooltip={"Upgrade to pro"}
                  className={"gap-x-4 h-10 px-4"}
                  onClick={() => {
                  }}
              >
                <StarIcon className={"size-4"}/>
                <span>Upgrade to Pро</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                  tooltip={"Billing Portal"}
                  className={"gap-x-4 h-10 px-4"}
                  onClick={() => {
                  }}
              >
                <CreditCardIcon className={"size-4"}/>
                <span>Billing</span>
              </SidebarMenuButton>
              <SidebarMenuButton
                  tooltip={"Sign out"}
                  className={"gap-x-4 h-10 px-4"}
                  onClick={() =>
                      authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => router.push("/login")
                        }
                      })
                  }
              >
                <LogOutIcon className={"size-4"}/>
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  )
}
