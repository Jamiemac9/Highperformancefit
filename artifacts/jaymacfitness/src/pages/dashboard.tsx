import { useDashboardSummary } from "../hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, Calendar, TrendingUp, Inbox } from "lucide-react";
import { Spinner } from "../components/ui/spinner";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, nextSessions, recentLeads, statusBreakdown } = data;

  const chartData = [
    { name: "Active", value: statusBreakdown.ACTIVE || 0, fill: "hsl(var(--primary))" },
    { name: "Inactive", value: statusBreakdown.INACTIVE || 0, fill: "hsl(var(--muted-foreground))" },
    { name: "Prospect", value: statusBreakdown.PROSPECT || 0, fill: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Here is what is happening with your business today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">{stats.activeClients} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">{stats.completedSessions} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
            <p className="text-xs text-muted-foreground">{stats.prospects} total prospects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Next Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {nextSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No upcoming sessions.</div>
            ) : (
              <div className="space-y-4">
                {nextSessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex flex-col gap-1">
                      <Link to={`/clients/${session.clientId}`} className="font-medium hover:underline">
                        {session.client?.firstName} {session.client?.lastName}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(session.date), "PPP p")} • {session.duration} mins • {session.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No recent leads.</div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-sm text-muted-foreground">{lead.email}</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded w-fit mt-1">{lead.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Client Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
