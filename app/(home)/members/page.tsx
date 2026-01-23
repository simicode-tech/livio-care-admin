"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import useMutate from "@/hooks/useMutate";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Search, Plus, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import AddMemmbers from "@/components/members/addMemmbers";
import AddRole from "@/components/members/addRole";
import SendInvite from "@/components/members/sendInvite";
import useCustomQuery from "@/hooks/useCustomQuery";
import { MemberDetails } from "@/components/members/memberDetails";
import RoleList from "@/components/members/roleList";
import RoleDetails from "@/components/members/roleDetails";
import EditRole from "@/components/members/editRole";
import InvitesList from "@/components/members/invitesList";

 

interface RolePermission {
  id: string;
  name: string;
  description: string;
}

interface MemberUser{
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  role_name: string;
  is_active: boolean;
  role_permissions: RolePermission[];
  last_login: string;
  created_at: string;
  updated_at: string;
}
interface Member{
  count: number;
  next: number | null;
  previous: number | null;
  results: MemberUser[];
}
interface RoleUser {
  id:string;
  name: string;
  description: string;
  priviledges: RolePermission[];
  no_of_members: number;
}
interface Role{
  count: number;
  next: number | null;
  previous: number | null;
  results: RoleUser[];
}

interface Invite {
    "id": string,
    "email": string,
    "first_name": string,
    "last_name": string,
    "full_name": string,
    "role": string,
    "role_name": string,
    "invited_by": number,
    "invited_by_name": string,
    "status": string,
    "expires_at": string,
    "accepted_at": string,
    "created_at": string,
    "last_login": string
}
interface InviteUser {
    count: number;
  next: number | null;
  previous: number | null;
  results: Invite[];

}

type MemberDetailsType ={
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  role_name: string;
  is_active: boolean;
  role_permissions: RolePermission[];
last_login:string
}

export default function MembersPage() {
  const [page, setPage] = useState(2);
  const [invitepage, setInvitePage] = useState(2);
  // const totalPages = 10;
  const [mounted, setMounted] = useState(false);
  // const [add, setAdd] = useState(false);
  const [addRole, setAddRole] = useState(false);
  const [editRole, setEditRole] = useState(false);
  const [sendInvite, setSendInvite] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberUser | null>(null);
  const [roleViewOpen, setRoleViewOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleUser | null>(null);
    const {
    data: memberData,
    isPending,
  } = useCustomQuery<Member>(
    {
      url: "super-admin/members/",
    },
    { queryKey: ["members"], enabled: activeTab === "members" }
  );
  const { data:memberDetailsData } = useCustomQuery<MemberDetailsType>(
    { url: selectedMemberId && `super-admin/members/${selectedMemberId}/` || ""},
    { queryKey: ["member-details", selectedMemberId], enabled: !!selectedMemberId }
  );
  const {
  data: roleData,

} = useCustomQuery<Role>(
  {
    url: "super-admin/roles/",
  },
  { queryKey: ["roles"], enabled: activeTab === "roles" }
  
);

  const {
  data: inviteData,
  // isPending: loadingInvite,
} = useCustomQuery<InviteUser>(
  {
    url: "super-admin/invitations/",
  },
  { queryKey: ["invite-list"], enabled: activeTab === "invites" }
);

  useEffect(() => {
    setMounted(true);
  }, []);

  const queryClient = useQueryClient();
  const { mutateAsync: deleteRole, isPending: deletingRole } = useMutate({
    type: "delete",
    url: "super-admin/roles/:id/delete/",
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleUser | null>(null);

  const columns: ColumnDef<MemberUser>[] = [
    {
      id: "select",
      header: () => null,
      cell: () => <Checkbox />,
    },
    {
      accessorKey: "name",
      header: () => <span className="text-[#666666] font-medium">Name</span>,
      cell: ({ row }) => (
        <span className="text-[#1A1A1A] font-medium">{row.original.full_name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: () => <span className="text-[#666666] font-medium">Email</span>,
      cell: ({ row }) => <span className="text-[#666666]">{row.original.email}</span>,
    },
    {
      id: "role",
      header: () => <span className="text-[#666666] font-medium">Roles</span>,
      cell: ({ row }) => (
        <span className="inline-flex px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#1A1A1A] text-sm font-medium">
          {row.original.role_name}
        </span>
      ),
    },
    {
      id: "status",
      header: () => <span className="text-[#666666] font-medium">Status</span>,
      cell: ({ row }) => (
        <span className="inline-flex px-4 py-1.5 rounded-full bg-[#E8F8ED] text-[#21A249] text-xs font-medium">
          {row.original.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="text-[#666666] font-medium" style={{ display: "block", textAlign: "right" }}>Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => openView(row.original)}>
                <Eye className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditMember(row.original)}>
                <Pencil className="w-4 h-4 mr-2" /> Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() =>(row.original)}>
                <Trash2 className="w-4 h-4 mr-2" /> Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const openRoleView = (role: RoleUser) => {
    setSelectedRole(role);
    setRoleViewOpen(true);
  };

  const openEditRole = (role: RoleUser) => {
    setSelectedRole(role as RoleUser);
    setEditRole(true);
  };

  const confirmRemoveRole = (role: RoleUser) => {
    setRoleToDelete(role);
    setConfirmDeleteOpen(true);
  };
  const openViewInvite = () => {};
  const openSendInvite = () => {};
  const confirmRemoveInvite = () => {};
  const removeRole = async (role: RoleUser) => {
    try {
      await deleteRole(undefined, { id: role.id });
      toast.success("Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setConfirmDeleteOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      toast.error((error as Error)?.message ?? "Failed to delete role");
    }
  };
  const openView = (member: MemberUser) => {
    setSelectedMemberId(member.id);
    setViewOpen(true);
  };

  const openEditMember = (member: MemberUser) => {
    setEditingMember(member);
    setEditMemberOpen(true);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Tabs + Add Member Button */}
      <div className="flex justify-end">
         {activeTab !== "members" && (
          <Button
            className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 h-11"
            onClick={() => (activeTab === "roles" ? setAddRole(true) : setSendInvite(true))}
          >
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === "roles" ? "Add Role" : "Send invite"}
          </Button>
        )}
      </div>
      <div className="flex border-b border-[#E5E7EB] w-full overflow-x-auto">
        <div className="flex items-center gap-4 md:gap-8 min-w-max px-1">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-3 px-1 text-base font-medium transition-colors relative ${
              activeTab === "members"
                ? "text-primary border-b-2 border-primary"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`pb-3 px-1 text-base font-medium transition-colors relative ${
              activeTab === "roles"
                ? "text-primary border-b-2 border-primary"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab("invites")}
            className={`pb-3 px-1 text-base font-medium transition-colors relative ${
              activeTab === "invites"
                ? "text-primary border-b-2 border-primary"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            Invites
          </button>
        </div>

       
      </div>

      {/* Table Card */}
      <Card className="rounded-xl overflow-hidden border border-[#E5E7EB]">
        {/* Header */}
        <div className="px-6 py-4 ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">
              {activeTab === "members" ? "All Members" : activeTab === "roles" ? "All Roles" : ""}
            </h2>

            {/* Toolbar */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                <Input
                  placeholder="Search"
                  className="pl-9 h-10 bg-white border-[#E5E7EB] placeholder:text-[#666666] rounded-lg w-full"
                />
              </div>
              <Button
                variant="outline"
                className="rounded-lg h-10 border-[#E5E7EB] shrink-0"
              >
                <Filter className="w-4 h-4 mr-2" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </div>

       
        {/* Desktop Table View */}
      {activeTab === "members" && 
      ( mounted && (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={Array.isArray(memberData?.results) ? memberData.results : []}
              isLoading={isPending}
              pageCount={Math.ceil((Array.isArray(memberData?.results) ? memberData.results.length : 0) / 10) || 1}
              onPaginationChange={(pageIndex, pageSize) => {
                console.log({ pageIndex, pageSize });
              }}
            />
          </div>
        ))
      }

      {activeTab === "roles" && (
       <RoleList
        rolesData={roleData?.results ?? []}
        openRoleView={openRoleView}
        openRoleEdit={openEditRole}
        openRoleDelete={confirmRemoveRole}
        totalPages={Math.ceil(roleData?.count ?? 0 / (10)) || 1}
        page={page}
        setPage={setPage}
      />
      )}

      {activeTab === "invites" && (
        <InvitesList invites={inviteData?.results ?? []} totalPages={Math.ceil(inviteData?.count ?? 0 / (10)) || 1} page={invitepage} setPage={setInvitePage} openView={openViewInvite} openSend={openSendInvite} openDelete={confirmRemoveInvite} />
      )}

      {roleViewOpen && selectedRole && (
        <RoleDetails
        roleViewOpen={roleViewOpen}
        setRoleViewOpen={setRoleViewOpen}
        selectedRole={selectedRole}
        />

      )}
      {
        editRole && selectedRole && (
          <EditRole
            edit={editRole}
            setEdit={setEditRole}
            roleId={selectedRole.id}
          />
        )
      }
      
        {viewOpen && memberDetailsData && (
          <MemberDetails
            selectedMember={memberDetailsData as MemberUser}
            viewOpen={viewOpen}
            setViewOpen={setViewOpen}
          />
        )}
        {activeTab === "members" && editMemberOpen && editingMember && (
          <AddMemmbers
            add={editMemberOpen}
            setAdd={setEditMemberOpen}
            isEdit
            initial={{
              firstName: editingMember.first_name.split(" ")[0] ?? "",
              lastName: editingMember.first_name.split(" ").slice(1).join(" ") ?? "",
              email: editingMember.email,
              role: editingMember.role,
            }}
          />
        )}
        {activeTab === "roles" && addRole && (
          <AddRole add={addRole} setAdd={setAddRole}  />
        )}
        {activeTab === "invites" && sendInvite && (
          <SendInvite add={sendInvite} setAdd={setSendInvite} />
        )}

        {confirmDeleteOpen && roleToDelete && (
          <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle>Delete Role</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[#666666]">Are you sure you want to delete the role &quot;{roleToDelete.name}&quot;? This action cannot be undone.</p>
              <div className="flex items-center justify-end gap-2 pt-4">
                <Button variant="outline" className="border-[#E5E7EB]" onClick={() => { setConfirmDeleteOpen(false); setRoleToDelete(null); }}>Cancel</Button>
                <Button className="bg-red-600 text-white" onClick={() => removeRole(roleToDelete)} disabled={deletingRole}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
      </Card>
    </div>
  );
}