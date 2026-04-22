import { useBookings, useCreateBooking, useDeleteBooking, useClients, usePackages } from "../hooks/use-queries";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { Spinner } from "../components/ui/spinner";
import { Plus, Trash2, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../components/ui/badge";

export default function Bookings() {
  const { data: bookings, isLoading } = useBookings();
  const { data: clients } = useClients();
  const { data: packages } = usePackages();
  const createBooking = useCreateBooking();
  const deleteBooking = useDeleteBooking();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [packageId, setPackageId] = useState("");

  const handleCreate = () => {
    if (!clientId || !packageId) {
      toast({ title: "Please select both client and package", variant: "destructive" });
      return;
    }

    createBooking.mutate(
      { clientId: parseInt(clientId), packageId: parseInt(packageId) },
      {
        onSuccess: () => {
          toast({ title: "Booking recorded" });
          setIsAddOpen(false);
          setClientId("");
          setPackageId("");
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteBooking.mutate(id, {
        onSuccess: () => toast({ title: "Booking deleted" }),
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="h-8 w-8 text-primary" /></div>;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">Track package purchases and session balances.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Record Purchase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Package Purchase</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Package</Label>
                <Select value={packageId} onValueChange={setPackageId}>
                  <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                  <SelectContent>
                    {packages?.map((pkg: any) => (
                      <SelectItem key={pkg.id} value={pkg.id.toString()}>
                        {pkg.name} - £{pkg.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createBooking.isPending}>
                {createBooking.isPending ? "Saving..." : "Record Purchase"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {bookings?.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">No bookings recorded</h3>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings?.map((booking: any) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{booking.client?.firstName} {booking.client?.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{format(new Date(booking.purchasedAt), "MMM do, yyyy")}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive -mr-2 -mt-2" onClick={() => handleDelete(booking.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">{booking.package?.name}</span>
                    <Badge variant="outline" className="ml-2">£{booking.package?.price}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Remaining Sessions:</span>
                    <span className={`font-bold ${booking.sessionsRemaining === 0 ? 'text-destructive' : 'text-primary'}`}>
                      {booking.sessionsRemaining} / {booking.package?.sessions}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
