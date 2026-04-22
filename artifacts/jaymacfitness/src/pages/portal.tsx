import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
import { Spinner } from "../components/ui/spinner";
import { Calendar, MonitorPlay, MapPin, Clock, ArrowRight } from "lucide-react";
import { Badge } from "../components/ui/badge";

export default function Portal() {
  const { user } = useAuth();
  
  // As a client, these endpoints only return my data based on the backend implementation
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["my-sessions"],
    queryFn: () => apiGet("/api/sessions")
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => apiGet("/api/bookings")
  });

  if (sessionsLoading || bookingsLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Spinner className="h-8 w-8 text-primary" /></div>;
  }

  const upcomingSessions = sessions?.filter((s: any) => !s.completed && new Date(s.date) >= new Date()) || [];
  const pastSessions = sessions?.filter((s: any) => s.completed || new Date(s.date) < new Date()) || [];

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Portal</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here is your training summary.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled training times</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No upcoming sessions scheduled.</p>
                <p className="text-sm">Contact Jay to book your next session.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session: any) => (
                  <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors bg-card">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {session.type === "ONLINE" ? <MonitorPlay className="h-6 w-6" /> : 
                         session.type === "OUTDOOR" ? <MapPin className="h-6 w-6" /> : 
                         <Clock className="h-6 w-6" />}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{format(new Date(session.date), "EEEE, MMM do")}</div>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                          <span className="font-medium text-foreground">{format(new Date(session.date), "h:mm a")}</span>
                          <span>•</span>
                          <span>{session.duration} mins</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Badge variant="secondary" className="text-sm px-3 py-1">{session.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Packages</CardTitle>
            <CardDescription>Your remaining sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {(!bookings || bookings.length === 0) ? (
              <div className="text-center py-8 text-muted-foreground">No active packages.</div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="p-4 border rounded-lg bg-card">
                    <div className="font-medium text-lg mb-1">{booking.package?.name}</div>
                    <div className="flex justify-between items-end mt-4">
                      <span className="text-sm text-muted-foreground">Sessions Left</span>
                      <span className="text-3xl font-black text-primary">{booking.sessionsRemaining}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {pastSessions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No past sessions.</div>
          ) : (
            <div className="space-y-3">
              {pastSessions.slice(0, 5).map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div>
                    <span className="font-medium">{format(new Date(session.date), "MMM do, yyyy")}</span>
                    <span className="text-muted-foreground text-sm ml-2">({session.type})</span>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
