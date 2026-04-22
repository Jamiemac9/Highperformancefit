import { useClients, useCreateClient } from "../hooks/use-queries";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";
import { format } from "date-fns";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../components/ui/badge";

const clientSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT"]),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function Clients() {
  const { data: clients, isLoading } = useClients();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const createClient = useCreateClient();
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { status: "ACTIVE" },
  });

  const onSubmit = (data: ClientFormValues) => {
    createClient.mutate(data, {
      onSuccess: () => {
        toast({ title: "Client created successfully" });
        setIsAddOpen(false);
        reset();
      },
      onError: (err: any) => {
        toast({ title: "Error creating client", description: err.message, variant: "destructive" });
      }
    });
  };

  const filteredClients = clients?.filter((client: any) => {
    const matchesSearch = `${client.firstName} ${client.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your clients and prospects.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register("firstName")} />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={watch("status")} onValueChange={(val) => setValue("status", val as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PROSPECT">Prospect</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createClient.isPending}>
                  {createClient.isPending ? "Saving..." : "Save Client"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PROSPECT">Prospect</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner className="h-8 w-8 text-primary" /></div>
      ) : filteredClients?.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">No clients found</h3>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients?.map((client: any) => (
            <Card key={client.id} className="hover:border-primary/50 transition-colors">
              <Link to={`/clients/${client.id}`} className="block h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{client.firstName} {client.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{client.phone || "No phone"}</p>
                    </div>
                    <Badge variant={client.status === "ACTIVE" ? "default" : client.status === "PROSPECT" ? "secondary" : "outline"}>
                      {client.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">{client._count?.sessions || 0}</span> Sessions
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{client._count?.bookings || 0}</span> Packages
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
