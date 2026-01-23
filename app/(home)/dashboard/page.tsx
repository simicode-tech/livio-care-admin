"use client";

import { IoIosNotificationsOutline } from "react-icons/io";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
} from "recharts";
import Image from "next/image";
import { format } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useCustomQuery from "@/hooks/useCustomQuery";

// const COLORS = ["#4C1D95", "#C084FC"];

interface analyticsType{
    "total_agencies": number,
    "agencies_change": number,
    "total_active_agencies": number,
    "active_agencies_change": number,
    "total_caregivers": number,
    "total_active_caregivers": number,
    "total_revenue":number,
    "revenue_change_percentage": number
}
// interface AnalyticsResponse {
//   status: boolean;
//   message: string;
//   data: analyticsType;
// }

// ---------------- DEMO DATA ----------------
const dashboardDemoData = {
  data: {
    analytics: {
      total_active_caregivers: 128,
      total_clients: 54,
      total_upcoming_shifts: 32,
      pending_approvals: 7,
    },
    pie_chart: {
      shift_completion_rate: {
        completed: 85,
        missed: 15,
      },
      compliance_status: {
        completed: 70,
        overdue: 30,
      },
    },
    attendance_trends: {
      days_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      on_time: [20, 25, 18, 22, 19, 14, 10],
      late: [3, 2, 4, 3, 5, 1, 0],
      missed: [1, 0, 2, 1, 1, 2, 0],
    },
    recent_activity: [
      {
        action: "Shift Assigned",
        performed_by: {
          id: 1,
          full_name: "John Doe",
          email: "john@example.com",
          phone_number: "+1234567890",
          profile_picture: null,
        },
        description: "Assigned shift to caregiver Sarah Johnson",
        timestamp: "2025-11-11T08:45:00Z",
      },
      {
        action: "Compliance Completed",
        performed_by: {
          id: 2,
          full_name: "Emily Smith",
          email: "emily@example.com",
          phone_number: "+1234567891",
          profile_picture: null,
        },
        description: "Completed background check for caregiver ID #45",
        timestamp: "2025-11-11T09:00:00Z",
      },
      {
        action: "Shift Missed",
        performed_by: {
          id: 3,
          full_name: "Michael Johnson",
          email: "michael@example.com",
          phone_number: "+1234567892",
          profile_picture: null,
        },
        description: "Caregiver missed assigned shift on 10th Nov",
        timestamp: "2025-11-10T18:30:00Z",
      },
      {
        action: "Client Registered",
        performed_by: {
          id: 4,
          full_name: "Grace Lee",
          email: "grace@example.com",
          phone_number: "+1234567893",
          profile_picture: null,
        },
        description: "New client added to the system",
        timestamp: "2025-11-09T12:15:00Z",
      },
      {
        action: "Shift Approved",
        performed_by: {
          id: 5,
          full_name: "David Brown",
          email: "david@example.com",
          phone_number: "+1234567894",
          profile_picture: null,
        },
        description: "Approved caregiver swap request",
        timestamp: "2025-11-08T15:00:00Z",
      },
    ],
  },
};
function RevenueChart({
  series,
}: {
  series: Array<{ month: string; revenue: number }>
}) {
  const months =
    ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => ({ month: m, revenue: 0 }))
  const data = Array.isArray(series) && series.length ? series : months

  const config = {
    revenue: { label: "Revenue ($)", color: "#6F2DA8" },
  }

  return (
    <div className=" p-4">
      <div className="mb-2 text-sm font-medium">Revenue Overview</div>
      <ChartContainer config={config} className="h-[360px] w-full">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 8 }} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export default function DashboardPage() {
  // Simulated query states
  const isLoading = false;
  const error = null;
  const dashboardData = dashboardDemoData;
 const { data:analyticsData} = useCustomQuery<analyticsType>({
    url: '/super-admin/dashboard/analytics/',
  }, {
    queryKey: ['analytics'],
  });
 const { data:chartData} = useCustomQuery({
    url: '/super-admin/dashboard/revenue-chart/',
  }, {
    queryKey: ['revenue-chart'],
  });
//  const { data:planData, isLoading:planIsLoading, error:planError } = useCustomQuery({
//     url: '/super-admin/dashboard/plan-distribution/',
//   }, {
//     queryKey: ['plan-distribution'],
//   }); 
  // const { data:activityData} = useCustomQuery({
  //   url: '/super-admin/dashboard/recent-activities/',
  // }, {
  //   queryKey: ['recent-activities'],
  // });
  
  // ---------- Data Transformations ----------

  const getAttendanceData = () => {
    const { days_of_week, on_time, late, missed } =
      dashboardData.data.attendance_trends;

    return days_of_week.map((day, index) => ({
      name: day.charAt(0).toUpperCase() + day.slice(1),
      onTime: on_time[index] || 0,
      late: late[index] || 0,
      missed: missed[index] || 0,
    }));
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading dashboard data.
      </div>
    );
  }
  const apiChart = chartData as {months: string[], revenue: number[]}
  const apiSeries: Array<{ month: string; revenue: number }> =
    Array.isArray(apiChart?.months) && Array.isArray(apiChart?.revenue)
      ? apiChart.months.map((m: string, i: number) => ({
          month: m,
          revenue: Number(apiChart.revenue[i] ?? 0),
        }))
      : [];
      
  const analytics = analyticsData;
  const recentActivity = dashboardData.data.recent_activity;
  const attendanceData = getAttendanceData();

  // ---------- RENDER ----------
  return (
    <div className="p-4 md:p-6 space-y-6">
     
      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="px-4 py-6 bg-[#FCF6FF] shadow border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <div className="rounded-full p-1 bg-[#FFDFDF]">
              <IoIosNotificationsOutline color="#F63636" />
            </div>
            Total Revenue
          </div>
          <p className="text-2xl font-semibold">
            {analytics?.total_revenue ?? 0}
          </p>
          <p className="text-green-500 text-xs">+12.5% from last month</p>
        </Card>

        <Card className="px-4 py-6 bg-[#FFF6F6] shadow border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <div className="rounded-full p-1 bg-[#FFDFDF]">
              <IoIosNotificationsOutline color="#F63636" />
            </div>
            Active Organizations
          </div>
          <p className="text-2xl font-semibold">
            {analytics?.total_active_agencies ?? 0}
          </p>
        </Card>

        <Card className="px-4 py-6 bg-[#F6F9FF] shadow border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <div className="rounded-full p-1 bg-[#FFDFDF]">
              <IoIosNotificationsOutline color="#F63636" />
            </div>
            Total Organizations
          </div>
          <p className="text-2xl font-semibold">
            {analytics?.total_agencies ?? 0}
          </p>
          <p className="text-green-500 text-xs">+5 from last month</p>
        </Card>

        <Card className="px-4 py-6 bg-[#EEFFF5] shadow border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <div className="rounded-full p-1 bg-[#FFDFDF]">
              <IoIosNotificationsOutline color="#F63636" />
            </div>
            Total Active Caregivers
          </div>
          <p className="text-2xl font-semibold">
            {analytics?.total_active_caregivers ?? 0}
          </p>
          <p className="text-green-500 text-xs">+16 this week</p>
        </Card>
      </div>

      {/* Charts & Activities */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        {/* Shift Completion Rate */}
        
        <Card className="md:col-span-2">
          <RevenueChart series={apiSeries} />
        </Card>

          {/* Plan Distribution */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="font-semibold">Plan Distribution</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <span className="text-sm">Professional</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EAB308]" />
                <span className="text-sm">Enterprise</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="text-sm">Basic</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} barGap={8}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <Bar dataKey="onTime" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#EAB308" radius={[4, 4, 0, 0]} />
                <Bar dataKey="missed" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <Image
                    src={
                      activity.performed_by.profile_picture ||
                      `https://avatar.iran.liara.run/username?username=${activity.performed_by.full_name}`
                    }
                    alt={activity.performed_by.full_name}
                    width={32}
                    height={32}
                    className="rounded-full h-8 w-8"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {activity.action}
                    </p>
                    <p className="text-sm text-[#666]">
                      {activity.description}
                    </p>
                    <p className="text-xs text-[#999] mt-1">
                      by {activity.performed_by.full_name}
                    </p>
                  </div>
                  <span className="text-xs text-[#666]">
                    {format(new Date(activity.timestamp), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No recent activity
              </div>
            )}
          </div>
        </Card>

      
      </div>
    </div>
  );
}
