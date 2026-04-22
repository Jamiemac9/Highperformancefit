import { usePackages, useCreatePackage, useUpdatePackage, useDeletePackage } from "../hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Spinner } from "../components/ui/spinner";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import { Textarea } from "../components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "../hooks/use-toast";

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sessions: z.coerce.number().min(1, "Must have at least 1 session"),
  price: z.string().min(1, "Price is required"),
  description: z.string().optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

export default function Packages() {
  const { data: packages, isLoading } = usePackages();
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
  });

  const openAdd = () => {
    setEditingId(null);
    reset({ name: "", sessions: 10, price: "", description: "" });
    setIsAddOpen(true);
  };

  const openEdit = (pkg: any) => {
    setEditingId(pkg.id);
    reset({
      name: pkg.name,
      sessions: pkg.sessions,
      price: pkg.price,
      description: pkg.description || "",
    });
    setIsAddOpen(true);
  };

  const onSubmit = (data: PackageFormValues) => {
    if (editingId) {
      updatePackage.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            toast({ title: "Package updated" });
            setIsAddOpen(false);
          },
          onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
        }
      );
    } else {
      createPackage.mutate(data, {
        onSuccess: () => {
          toast({ title: "Package created" });
          setIsAddOpen(false);
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this package?")) {
      deletePackage.mutate(id, {
        onSuccess: () => toast({ title: "Package deleted" }),
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="h-8 w-8 text-primary" /></div>;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground mt-1">Manage the services you offer to clients.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" /> New Package
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Package" : "Create New Package"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input id="name" placeholder="e.g. 10 Session Block" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessions">Number of Sessions</Label>
                  <Input type="number" id="sessions" {...register("sessions")} />
                  {errors.sessions && <p className="text-xs text-destructive">{errors.sessions.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (£)</Label>
                  <Input id="price" placeholder="450.00" {...register("price")} />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" placeholder="What's included in this package?" {...register("description")} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createPackage.isPending || updatePackage.isPending}>
                  {createPackage.isPending || updatePackage.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {packages?.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">No packages available</h3>
          <p className="text-sm text-muted-foreground mt-2">Create your first package to start selling.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages?.map((pkg: any) => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{pkg.name}</span>
                  <span className="text-2xl font-bold text-primary">£{pkg.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm font-medium mb-4">{pkg.sessions} Sessions included</p>
                {pkg.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{pkg.description}</p>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end gap-2 bg-muted/20">
                <Button variant="ghost" size="sm" onClick={() => openEdit(pkg)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(pkg.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
