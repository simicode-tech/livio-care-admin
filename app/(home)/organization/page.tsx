"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Filter, Search, X, MoreVertical, Eye, Pencil, PauseCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomSideDialog } from "@/components/ui/custom-side-dialog";
import useCustomQuery from "@/hooks/useCustomQuery";
import AddOrganization from "@/components/organization/addOrganization";
import UpdateOrganization from "@/components/organization/updateOrganization";

type Analytics = {
  total_active_agencies: number;
  total_agencies: number;
};

type AgencySummary = {
  id: string;
  agency_name: string;
  primary_email: string;
  plan_name: string;
  status: string;
  total_caregivers: number;
  total_clients: number;
  date_joined: string;
};

type AgenciesPaginated = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AgencySummary[];
};

type AgencyDetails = {
  id: string;
  agency_name: string;
  primary_email: string;
  plan_name: string;
  status: string;
  total_caregivers: number;
  total_clients: number;
  agency_type?: string;
};
// KPI card used at the top
function KpiCard({
  label,
  value,
  bg,
  loading,
}: {
  label: string;
  value: React.ReactNode;
  bg: string;
  loading?: boolean;
}) {
  return (
    <Card className="px-4 py-6 w-full md:w-64 rounded-[10px] shadow border-gray-100" style={{ backgroundColor: bg }}>
      <div className="flex items-center gap-2 text-sm font-medium mb-2">
        <span className="rounded-full p-1" style={{ backgroundColor: "#FFDFDF" }}>
          <IoIosNotificationsOutline color="#F63636" />
        </span>
        {label}
      </div>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-semibold">{value}</p>
      )}
    </Card>
  );
}

export default function OrganizationPage() {
  // Pagination
  const [page, setPage] = useState(1);

  const {
    data: analyticsData,
    isPending: loadingAnalytics,
  } = useCustomQuery<Analytics>(
    {
      url: "super-admin/agencies/analytics/",
    },
    { queryKey: ["agencies-analytics"] }
  );
  console.log(analyticsData);
  
  const agenciesAnalytics = ((analyticsData) ?? (analyticsData )) as { total_agencies?: number; total_active_agencies?: number } | undefined;
  const [filters, setFilters] = useState<{ plan_name: string; status: string; start_date: string; end_date: string }>({ plan_name: "", status: "", start_date: "", end_date: "" });
  const {
    data: agenciesData,
    isPending: loadingAgencies,
  } = useCustomQuery<AgenciesPaginated>(
    {
      url: "super-admin/agencies/",
      config: {
        params: {
          plan_name: filters.plan_name || undefined,
          status: filters.status || undefined,
          start_date: filters.start_date || undefined,
          end_date: filters.end_date || undefined,
          page: page || undefined,
        },
      },
    },
    { queryKey: ["agencies", filters.plan_name, filters.status, filters.start_date, filters.end_date, page] }
  );
// console.log(agenciesData);

  // Organizations state
  const [organizations, setOrganizations] = useState<Array<{
    name: string;
    email: string;
    clients: number;
    caregivers: number;
    plan: string;
    status: string;
  }>>(Array.from({ length: 10 }).map(() => ({
    name: "Caring Hearts Agency",
    email: "admin@caringhearts.com",
    clients: 500,
    caregivers: 40,
    plan: "Premium",
    status: "Active",
  })));


  const hasData = (agenciesData?.results?.length ?? 0) > 0;

  const paginated = ((agenciesData) ?? (agenciesData )) as AgenciesPaginated | undefined;
  const pageSize = Array.isArray(paginated?.results) ? paginated!.results.length : 0;
  const totalPages = pageSize > 0 ? Math.ceil((paginated?.count ?? 0) / pageSize) : 1;

  // View & edit state
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState<string>("Premium");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<null | {
    name: string;
    email: string;
    clients: number;
    caregivers: number;
    plan: string;
    status: string;
    agency_type?: string;
    recent?: {
      lastLogin: string;
      accountCreated: string;
      lastPayment: string;
    };
  }>(null);
  console.log(selectedAgencyId);
  

  const { data: agencyDetailsData, isPending: loadingAgencyDetails } = useCustomQuery<AgencyDetails>(
    { url: selectedAgencyId ? `super-admin/agencies/${selectedAgencyId}/` : "super-admin/agencies/" },
    { queryKey: ["agency-details", selectedAgencyId], enabled: !!selectedAgencyId }
  );

  useEffect(() => {
    const d = (agencyDetailsData) ?? undefined;
    if (d) {
      setSelectedOrg({
        name: d.agency_name,
        email: d.primary_email,
        clients: d.total_clients,
        caregivers: d.total_caregivers,
        plan: d.plan_name,
        status: d.status,
        agency_type: d.agency_type,
        recent: {
          lastLogin: "—",
          accountCreated: "—",
          lastPayment: "—",
        },
      });
    }
  }, [agencyDetailsData]);
  
  const openView = (id: string) => {
    setSelectedAgencyId(id);
    setViewOpen(true);
  };

  const openEdit = (id: string) => {
    setSelectedAgencyId(id);
    setEditOpen(true);
  };

  const suspendOrg = (idx: number) => {
    setOrganizations(prev => prev.map((o, i) => i === idx ? { ...o, status: "Suspended" } : o));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:px-12">
      {/* KPIs + Export */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-full md:w-auto">
          <KpiCard label="Total Organizations" value={agenciesAnalytics?.total_agencies ?? 0} bg="#FCF6FF"  loading={loadingAnalytics}/>
          <KpiCard label="Active Organizations" value={agenciesAnalytics?.total_active_agencies ?? 0} bg="#FCF6FF" loading={loadingAnalytics}/>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="border-primary w-full md:w-32 text-primary hover:bg-primary hover:text-white rounded-sm"
          >
            Export
          </Button>
          <Button className="bg-primary text-white rounded-sm w-full md:w-auto" onClick={() => setAddOpen(true)}>
            + Add Organization
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="rounded-xl">
        <div className="border-b border-[#E5E7EB] pb-3">
        <div className="px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between mb-3 gap-4 pt-4">
          <div className="text-lg font-medium ">All Organizations</div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 w-full md:w-auto">
            <div className="flex-1 hidden md:block" />
            <div className="relative w-full md:w-[320px]">
              <Input placeholder="Search" className="h-9 bg-[#F9FAFB] border-[#E5E7EB] placeholder:pl-7 rounded-3xl w-full" />
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            </div>
          </div>
            <Button variant="outline" className="rounded-lg w-full md:w-auto" onClick={() => setFilterOpen(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
        </div>
        </div>

        {/* Table */}
        <div className="px-4 md:px-6 overflow-x-auto">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Primary Email</TableHead>
                <TableHead>Total Clients</TableHead>
                <TableHead>Total Caregivers</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {loadingAgencies ? (
              <>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(8)].map((__, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
            ) :(
              !hasData ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="h-[360px] flex flex-col items-center justify-center">
                      <Image
                        width={120}
                        height={120}
                        alt="Empty"
                        src="/EmptyNotification.svg"
                        className="opacity-90"
                      />
                      <p className="mt-4 font-medium">No data yet!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (agenciesData?.results?.length ?? 0) > 0 && agenciesData?.results?.map((org, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="w-10">
                      <Checkbox />
                    </TableCell>
                    <TableCell className="text-[#1A1A1A]">{org?.agency_name ?? "-"}</TableCell>
                    <TableCell className="text-[#666666]">{org?.primary_email ?? "-"}</TableCell>
                    <TableCell className="text-left">{org?.total_clients ?? "-"}</TableCell>
                    <TableCell className="text-left">{org?.total_caregivers ?? "-"}</TableCell>
                    <TableCell>{org?.plan_name ?? "-"}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full ${org.status === "inactive"?"bg-red-200 text-red-800":"bg-[#E8F8ED] text-[#21A249]"}  text-xs`}>
                        {org.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => openView(org.id)}>
                            <Eye className="w-4 h-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(org.id)}>
                            <Pencil className="w-4 h-4 mr-2" /> Update
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => suspendOrg(idx)}>
                            <PauseCircle className="w-4 h-4 mr-2" /> Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )

            )}
            </TableBody>
          </Table>
        </div>

        {/* Right-side View Panel */}
        {viewOpen && (
            <>
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setViewOpen(false)}
            />
                <div className="fixed right-0 md:right-6 top-[68px] w-full md:w-[400px] bg-white shadow-2xl border border-[#E5E7EB] z-50 overflow-hidden h-[calc(100vh-80px)] md:h-auto md:max-h-[calc(100vh-100px)] rounded-l-xl md:rounded-xl">
                     <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                Organization Details
              </h2>
              <button
                onClick={() => setViewOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#666666]" />
              </button>
            </div>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto p-6">
                    {loadingAgencyDetails || !selectedOrg ? (
                      <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">
                        Loading details...
                      </div>
                    ) : (
                    <>
                    {/* Details Card */}
                    <div className="">
                        <div className="flex justify-between items-center py-4 px-4 border-b">
                        <span className="text-[#666666]">Name</span>
                        <span className="font-medium">{selectedOrg?.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4 border-b">
                        <span className="text-[#666666]">Primary Email</span>
                        <span className="font-medium">{selectedOrg?.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4 border-b">
                        <span className="text-[#666666]">Total Clients</span>
                        <span className="font-medium">{selectedOrg?.clients}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4 border-b">
                        <span className="text-[#666666]">Total Caregivers</span>
                        <span className="font-medium">{selectedOrg?.caregivers}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4 border-b">
                        <span className="text-[#666666]">Status</span>
                        <span className={`px-3 py-1 rounded-full ${selectedOrg?.status === "inactive"?"bg-red-200 text-red-700":"bg-[#E8F8ED] text-[#21A249]"}  text-xs`}>
                            {selectedOrg?.status}
                        </span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4 border-b">
                        <span className="text-[#666666]">Plan</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{selectedOrg?.plan}</span>
                          <Button
                            variant="outline"
                            className="border-primary text-primary h-8 px-3"
                            onClick={() => {
                              setUpgradePlan(selectedOrg?.plan ?? "");
                              setUpgradeOpen(true);
                            }}
                          >
                            Upgrade
                          </Button>
                        </div>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4">
                        <span className="text-[#666666]">Services Type</span>
                        <span className="font-medium">
                            {selectedOrg?.agency_type ?? "..."}
                        </span>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-2xl border border-[#F5D6FF] bg-[#FFF3FF]">
                        <div className="px-4 py-3 border-b">
                        <span className="font-medium">Recent Activity</span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4 border-b">
                        <span className="text-[#666666]">Last login</span>
                        <span className="font-medium">
                            {selectedOrg?.recent?.lastLogin ?? "—"}
                        </span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4 border-b">
                        <span className="text-[#666666]">Account Created</span>
                        <span className="font-medium">
                            {selectedOrg?.recent?.accountCreated ?? "—"}
                        </span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4">
                        <span className="text-[#666666]">Last payment</span>
                        <span className="font-medium">
                            {selectedOrg?.recent?.lastPayment ?? "—"}
                        </span>
                        </div>
                    </div>
                    </>
                    )}
                    </div>
                </div>
        </>
        )}

        {addOpen && <AddOrganization addOpen={addOpen} setAddOpen={setAddOpen} />}
        
        {upgradeOpen && selectedOrg && (
          <CustomSideDialog title="Upgrade Plan" open={upgradeOpen} onOpenChange={setUpgradeOpen} className="w-[500px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-[#666666]">Select Plan</label>
                <Select value={upgradePlan} onValueChange={setUpgradePlan}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button variant="outline" className="border-primary text-primary" onClick={() => setUpgradeOpen(false)}>Cancel</Button>
              <Button
                className="bg-primary text-white"
                onClick={() => {
                  const idx = organizations.findIndex(o => o.email === selectedOrg?.email && o.name === selectedOrg?.name);
                  if (idx !== -1) {
                    setOrganizations(prev => prev.map((o, i) => i === idx ? { ...o, plan: upgradePlan } : o));
                  }
                  setSelectedOrg(prev => prev ? { ...prev, plan: upgradePlan } : prev);
                  setUpgradeOpen(false);
                }}
              >
                Confirm Upgrade
              </Button>
            </div>
          </CustomSideDialog>
        )}

        {editOpen && (
          <UpdateOrganization open={editOpen} setOpen={setEditOpen} organizationId={selectedAgencyId} />
        )}

        {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {filterOpen && (
        <CustomDialog open={filterOpen} onOpenChange={setFilterOpen} title="Filter Agencies">
          <div className="px-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#666666]">Plan</label>
                <Select value={filters.plan_name} onValueChange={(v) => setFilters((p) => ({ ...p, plan_name: v }))}>
                  <SelectTrigger className="h-9 bg-[#F9FAFB] border-[#E5E7EB]">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="na">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-[#666666]">Status</label>
                <Select value={filters.status} onValueChange={(v) => setFilters((p) => ({ ...p, status: v }))}>
                  <SelectTrigger className="h-9 bg-[#F9FAFB] border-[#E5E7EB]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-[#666666]">Start date</label>
                <Input type="date" value={filters.start_date} onChange={(e) => setFilters((p) => ({ ...p, start_date: e.target.value }))} className="h-9 bg-[#F9FAFB] border-[#E5E7EB]" />
              </div>
              <div>
                <label className="text-sm text-[#666666]">End date</label>
                <Input type="date" value={filters.end_date} onChange={(e) => setFilters((p) => ({ ...p, end_date: e.target.value }))} className="h-9 bg-[#F9FAFB] border-[#E5E7EB]" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 p-6">
            <Button variant="outline" className="border-primary text-primary" onClick={() => { setFilters({ plan_name: "", status: "", start_date: "", end_date: "" }); setFilterOpen(false); }}>Clear</Button>
            <Button className="bg-primary text-white" onClick={() => setFilterOpen(false)}>Apply</Button>
          </div>
        </CustomDialog>
      )}
      </Card>
    </div>
  )
}