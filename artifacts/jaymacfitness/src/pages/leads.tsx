import { useLeads, useUpdateLead, useDeleteLead } from "../hooks/use-queries";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
import { Spinner } from "../components/ui/spinner";
import { Trash2, Mail, Phone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";

export default function Leads() {
  const { data: leads, isLoading } = useLeads();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    updateLead.mutate(
      { id, data: { status } },
      {
        onSuccess: () => toast({ title: "Status updated" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLead.mutate(id, {
        onSuccess: () => toast({ title: "Lead deleted" }),
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "CONTACTED": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "CONVERTED": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "LOST": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "";
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="h-8 w-8 text-primary" /></div>;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Enquiries</h1>
          <p className="text-muted-foreground mt-1">Review and manage inbound requests.</p>
        </div>
      </div>

      {leads?.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">No leads yet</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads?.map((lead: any) => (
            <Card key={lead.id} className={lead.status === "CONVERTED" || lead.status === "LOST" ? "opacity-75" : ""}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-xl flex items-center gap-2">
                        {lead.name}
                        <Badge variant="outline" className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Received {format(new Date(lead.createdAt), "MMM do, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm font-medium">
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-primary hover:underline">
                      <Mail className="h-4 w-4" /> {lead.email}
                    </a>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                        <Phone className="h-4 w-4" /> {lead.phone}
                      </a>
                    )}
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md text-sm border">
                    <p className="font-semibold mb-1 text-xs uppercase tracking-wider text-muted-foreground">Message</p>
                    <p className="whitespace-pre-wrap">{lead.message}</p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end items-end gap-2 min-w-[200px] border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <div className="w-full">
                    <Label className="text-xs mb-1 block">Update Status</Label>
                    <Select value={lead.status} onValueChange={(val) => handleStatusChange(lead.id, val)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="CONTACTED">Contacted</SelectItem>
                        <SelectItem value="CONVERTED">Converted</SelectItem>
                        <SelectItem value="LOST">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full mt-auto justify-start md:justify-center" onClick={() => handleDelete(lead.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Lead
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
