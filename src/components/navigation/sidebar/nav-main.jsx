"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function NavMain({ items, pathname }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // List of disabled item titles
  const disabledItems = ["Television", "YouTube", "OTT", "Gaming", "Sports"];

  // Function to handle clicks on disabled items
  const handleDisabledClick = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const isMainActive = pathname.startsWith(item.url);
            const isDisabled = disabledItems.includes(item.title);

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isMainActive}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isMainActive}
                    className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {isDisabled ? (
                      <a
                        href="#"
                        onClick={handleDisabledClick}
                        className="flex items-center"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const isSubActive = pathname.startsWith(subItem.url);
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                  className={
                                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                                  }
                                >
                                  {isDisabled ? (
                                    <a
                                      href="#"
                                      onClick={handleDisabledClick}
                                      className="flex items-center"
                                    >
                                      <span>{subItem.title}</span>
                                    </a>
                                  ) : (
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  )}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>

      {/* Dialog for disabled items */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Not Allowed</DialogTitle>
            <DialogDescription>
              You do not have permission to access this section. Please contact
              the administrator for assistance.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}