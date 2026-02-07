"use client"

import { TrendingUp, DollarSign, Calendar, Users, CheckCircle, Clock, Settings, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store"

export default function DashboardPage() {
  const { user } = useUserStore()

  const stats = [
    {
      title: "Total Revenue",
      value: "$125,400",
      change: "+12.5%",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600"
    },
    {
      title: "Total Bookings",
      value: "342",
      change: "+8.3%",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Customers",
      value: "156",
      change: "+15.2%",
      icon: Users,
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+2.1%",
      icon: CheckCircle,
      gradient: "from-orange-500 to-red-600",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600"
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid - Beautiful gradient cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2.5 ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">{stat.change}</span>
                  <span className="ml-1 text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription className="mt-1.5">
                  Latest updates from your dashboard
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {[
                { title: "New booking confirmed", time: "2 hours ago", type: "success" },
                { title: "Customer added review", time: "4 hours ago", type: "info" },
                { title: "Payment received", time: "5 hours ago", type: "success" },
                { title: "Appointment rescheduled", time: "6 hours ago", type: "warning" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group animate-in slide-in-from-left-4 duration-500"
                  style={{ animationDelay: `${(i + 4) * 100}ms` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-md group-hover:shadow-lg transition-shadow">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Badge
                    variant={activity.type === "success" ? "default" : "secondary"}
                    className="shadow-sm"
                  >
                    New
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Colorful buttons */}
        <Card className="col-span-3 shadow-md">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription className="mt-1.5">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <Button
              className="w-full h-auto py-4 justify-start text-left bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Calendar className="mr-3 h-5 w-5" />
              <div>
                <div className="font-semibold">New Booking</div>
                <div className="text-xs opacity-90">Create a new appointment</div>
              </div>
            </Button>
            <Button
              className="w-full h-auto py-4 justify-start text-left bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="mr-3 h-5 w-5" />
              <div>
                <div className="font-semibold">Add Customer</div>
                <div className="text-xs opacity-90">Register new customer</div>
              </div>
            </Button>
            <Button
              className="w-full h-auto py-4 justify-start text-left bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
            >
              <DollarSign className="mr-3 h-5 w-5" />
              <div>
                <div className="font-semibold">View Reports</div>
                <div className="text-xs opacity-90">Financial analytics</div>
              </div>
            </Button>
            <Button
              className="w-full h-auto py-4 justify-start text-left bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Settings className="mr-3 h-5 w-5" />
              <div>
                <div className="font-semibold">Settings</div>
                <div className="text-xs opacity-90">Manage preferences</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
