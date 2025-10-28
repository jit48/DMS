"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Users,
  FileText,
  Package,
  Search,
  Settings,
  Home,
  Palette,
  DollarSign,
  Truck,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Customer Details", href: "/customers", icon: Users },
  { name: "Enquiry Details", href: "/enquiries", icon: Search },
  { name: "Order Details", href: "/orders", icon: FileText },
  { name: "Shipping Details", href: "/shipping", icon: Truck },
  { name: "Model Details", href: "/models", icon: Car },
  { name: "Color Details", href: "/colors", icon: Palette },
  { name: "Price Details", href: "/prices", icon: DollarSign },
];

export function Sidebar({ className }) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            DMS System
          </h2>
          <Separator className="my-4" />
        </div>
        <div className="px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
