import { useParams, useNavigate } from "react-router-dom";
import { useClient, useUpdateClient, useDeleteClient } from "../hooks/use-queries";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { ArrowLeft, Trash2, Calendar, BookOpen, User, Phone, Save } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading } = useClient(id!);
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    status: "",
    goals: "",
    medicalNotes: "",
  });

  useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone || "",
        status: client.status,
        goals: client.goals || "",
        medicalNotes: client.medicalNotes || "",
      });
    }
  }, [client]);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner className="h-8 w-8 text-primary" /></div>;
  }

  if (!client) {
    return <div className="p-8 text-center">Client not found</div>;
  }

  const handleUpdate = () => {
    updateClient.mutate(
      { id: client.id, data: formData },
      {
        onSuccess: () => toast({ title: "Client updated successfully" }),
        onError: (err: any) => toast({ title: "Error updating client", description: err.message, variant: "destructive" }),
      }
    );
  };

  const handleDelete = () => {
    deleteClient.mutate(client.id, {
      onSuccess: () => {
        toast({ title: "Client deleted" });
        navigate("/clients");
      },
      onError: (err: any) => toast({ title: "Error deleting client", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.firstName} {client.lastName}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Badge variant={client.status === "ACTIVE" ? "default" : client.status === "PROSPECT" ? "secondary" : "outline"}>
              {client.status}
            </Badge>
            • Joined {format(new Date(client.joinedAt), "MMM yyyy")}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleUpdate} disabled={updateClient.isPending}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the client
                  profile and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Sessions ({client.sessions?.length || 0})</TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Bookings ({client.bookings?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PROSPECT">Prospect</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health & Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goals">Fitness Goals</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="What does the client want to achieve?" 
                    className="min-h-[100px]"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Medical Notes</Label>
                  <Textarea 
                    id="medicalNotes" 
                    placeholder="Any injuries, allergies, or conditions?" 
                    className="min-h-[100px]"
                    value={formData.medicalNotes}
                    onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>All upcoming and completed sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              {(!client.sessions || client.sessions.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">No sessions recorded yet.</div>
              ) : (
                <div className="space-y-4">
                  {client.sessions.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{format(new Date(session.date), "EEEE, MMMM do yyyy")} at {format(new Date(session.date), "h:mm a")}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {session.type} • {session.duration} minutes
                        </div>
                      </div>
                      <Badge variant={session.completed ? "default" : "secondary"}>
                        {session.completed ? "Completed" : "Upcoming"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Package Bookings</CardTitle>
              <CardDescription>Purchased packages and remaining sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              {(!client.bookings || client.bookings.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">No bookings found.</div>
              ) : (
                <div className="space-y-4">
                  {client.bookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{booking.package?.name || "Unknown Package"}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Purchased on {format(new Date(booking.purchasedAt), "MMM do yyyy")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl">{booking.sessionsRemaining}</div>
                        <div className="text-xs text-muted-foreground">Sessions left</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
