import { useSessions, useCreateSession, useUpdateSession, useDeleteSession, useClients } from "../hooks/use-queries";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { Spinner } from "../components/ui/spinner";
import { Calendar, Check, Clock, MapPin, MonitorPlay, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../components/ui/badge";

const sessionSchema = z.object({
  clientId: z.string().min(1, "Select a client"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.coerce.number().min(15).max(180),
  type: z.enum(["GYM", "ONLINE", "OUTDOOR"]),
  notes: z.string().optional(),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

export default function Sessions() {
  const { data: sessions, isLoading } = useSessions();
  const { data: clients } = useClients();
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { type: "GYM", duration: 60 },
  });

  const onSubmit = (data: SessionFormValues) => {
    // Combine date and time
    const dateTime = new Date(`${data.date}T${data.time}`).toISOString();
    
    createSession.mutate(
      {
        clientId: parseInt(data.clientId),
        date: dateTime,
        duration: data.duration,
        type: data.type,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          toast({ title: "Session scheduled" });
          setIsAddOpen(false);
          reset();
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  const toggleCompleted = (session: any) => {
    updateSession.mutate(
      { id: session.id, data: { completed: !session.completed } },
      {
        onSuccess: () => toast({ title: session.completed ? "Marked as incomplete" : "Marked as completed" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSession.mutate(id, {
        onSuccess: () => toast({ title: "Session deleted" }),
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="h-8 w-8 text-primary" /></div>;

  const sortedSessions = [...(sessions || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground mt-1">Schedule and track your personal training sessions.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Session</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <Select onValueChange={(val) => setValue("clientId", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.filter((c: any) => c.status !== "INACTIVE").map((client: any) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" id="date" {...register("date")} />
                  {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input type="time" id="time" {...register("time")} />
                  {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input type="number" id="duration" {...register("duration")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={watch("type")} onValueChange={(val) => setValue("type", val as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GYM">Gym</SelectItem>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="OUTDOOR">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input id="notes" placeholder="e.g. Focus on legs" {...register("notes")} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createSession.isPending}>
                  {createSession.isPending ? "Scheduling..." : "Schedule"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">No sessions scheduled</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedSessions.map((session: any) => {
            const date = new Date(session.date);
            const isPast = date < new Date() && !session.completed;

            return (
              <Card key={session.id} className={session.completed ? "bg-muted/50 border-muted" : isPast ? "border-destructive/50" : ""}>
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`hidden sm:flex h-12 w-12 rounded-full items-center justify-center ${session.completed ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                      {session.type === "ONLINE" ? <MonitorPlay className="h-6 w-6" /> : 
                       session.type === "OUTDOOR" ? <MapPin className="h-6 w-6" /> : 
                       <Clock className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg ${session.completed ? 'text-muted-foreground line-through' : ''}`}>
                        {session.client?.firstName} {session.client?.lastName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(date, "EEEE, MMM do")} at {format(date, "h:mm a")}
                        </span>
                        <span>{session.duration} mins</span>
                        <Badge variant="outline" className="text-xs">{session.type}</Badge>
                      </div>
                      {session.notes && <p className="text-sm mt-2 italic text-muted-foreground">"{session.notes}"</p>}
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto items-center gap-2 mt-4 sm:mt-0">
                    <Button 
                      variant={session.completed ? "outline" : "default"} 
                      className="flex-1 sm:flex-none"
                      onClick={() => toggleCompleted(session)}
                    >
                      {session.completed ? (
                        <>Undo</>
                      ) : (
                        <><Check className="mr-2 h-4 w-4" /> Complete</>
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(session.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
