import * as React from "react";
import {
  LifeBuoy,
  Send,
  Package,
  Users,
  BarChart2,
  FileText,
  Globe,
  PieChart,
  Layers,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  // src/config/navConfig.js
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart2,
      items: [], // Overview with KPIs and Charts
    },
    {
      title: "User Management",
      url: "/user-management",
      icon: Users,
      items: [],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      items: [
        { title: "Sales Reports", url: "/reports/sales" },
        { title: "Inventory Reports", url: "/reports/inventory" },
        { title: "Download Reports", url: "/reports/downloads" },
      ],
    },
    {
      title: "Performance & Insights",
      url: "/performance-insights",
      icon: Layers,
      items: [
        { title: "Performance Tracking", url: "/performance-tracking" },
        { title: "Resource Insights", url: "/resource-insights" },
        { title: "Revenue & Cost Insights", url: "/insights/revenue-cost" },
      ],
    },
    {
      title: "Analysis",
      url: "/analysis",
      icon: PieChart,
      items: [
        { title: "Category Analysis", url: "/analysis/category" },
        { title: "Product Performance", url: "/analysis/product" },
        { title: "Trends", url: "/analysis/trends" },
      ],
    },
    {
      title: "Inventory & Waste Management",
      url: "/inventory-management",
      icon: Package,
      items: [
        { title: "Inventory Turnover", url: "/inventory/turnover" },
        { title: "Waste Tracking", url: "/inventory/waste" },
        { title: "Loss Tracking", url: "/inventory/loss" },
      ],
    },
    {
      title: "Geographic Insights",
      url: "/geo-sales",
      icon: Globe,
      items: [],
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {/* Display logo prominently at the top on small screens */}
                <div className=" flex justify-center ">
                  <img
                    src="/inventify.svg"
                    alt="Logo"
                    className="h-10 w-full animate-bounceSlow"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Inventify</span>
                  <span className="truncate text-xs">Smart Inventroy</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
