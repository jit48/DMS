import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  FileText,
  Search,
  Car,
  Palette,
  DollarSign,
  Truck,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Customers", value: "1,234", icon: Users, change: "+12%" },
    { title: "Active Orders", value: "89", icon: FileText, change: "+5%" },
    { title: "Pending Enquiries", value: "156", icon: Search, change: "+8%" },
    { title: "Available Models", value: "24", icon: Car, change: "0%" },
  ];

  const quickActions = [
    {
      title: "New Customer",
      description: "Add a new customer",
      href: "/customers",
      icon: Users,
    },
    {
      title: "Create Enquiry",
      description: "Process customer enquiry",
      href: "/enquiries",
      icon: Search,
    },
    {
      title: "New Order",
      description: "Create new order",
      href: "/orders",
      icon: FileText,
    },
    {
      title: "Manage Models",
      description: "Update vehicle models",
      href: "/models",
      icon: Car,
    },
  ];

  const recentActivities = [
    {
      action: "New order created",
      customer: "John Doe",
      time: "2 hours ago",
      status: "pending",
    },
    {
      action: "Enquiry converted",
      customer: "Jane Smith",
      time: "4 hours ago",
      status: "completed",
    },
    {
      action: "Customer registered",
      customer: "Mike Johnson",
      time: "6 hours ago",
      status: "completed",
    },
    {
      action: "Order delivered",
      customer: "Sarah Wilson",
      time: "1 day ago",
      status: "completed",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Dealer Management System
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action) => (
                <div key={action.title} className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {action.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={action.href}>Go</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates in your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {activity.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.customer} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
