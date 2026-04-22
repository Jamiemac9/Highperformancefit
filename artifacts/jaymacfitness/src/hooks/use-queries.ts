import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete } from "../lib/api";

// Clients
export const useClients = () => useQuery({ queryKey: ["clients"], queryFn: () => apiGet("/api/clients") });
export const useClient = (id: string | number) => useQuery({ queryKey: ["clients", id], queryFn: () => apiGet(`/api/clients/${id}`), enabled: !!id });
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiPost("/api/clients", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};
export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => apiPatch(`/api/clients/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", variables.id] });
    },
  });
};
export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiDelete(`/api/clients/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

// Sessions
export const useSessions = () => useQuery({ queryKey: ["sessions"], queryFn: () => apiGet("/api/sessions") });
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiPost("/api/sessions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => apiPatch(`/api/sessions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiDelete(`/api/sessions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// Packages
export const usePackages = () => useQuery({ queryKey: ["packages"], queryFn: () => apiGet("/api/packages") });
export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiPost("/api/packages", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });
};
export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => apiPatch(`/api/packages/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });
};
export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiDelete(`/api/packages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });
};

// Bookings
export const useBookings = () => useQuery({ queryKey: ["bookings"], queryFn: () => apiGet("/api/bookings") });
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiPost("/api/bookings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiDelete(`/api/bookings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// Leads
export const useLeads = () => useQuery({ queryKey: ["leads"], queryFn: () => apiGet("/api/leads") });
export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiPost("/api/leads", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
};
export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => apiPatch(`/api/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiDelete(`/api/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// Dashboard
export const useDashboardSummary = () => useQuery({ queryKey: ["dashboard"], queryFn: () => apiGet("/api/dashboard/summary") });
