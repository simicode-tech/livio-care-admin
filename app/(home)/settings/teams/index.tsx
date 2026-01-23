"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, UserPlus, Shield, Trash2 } from "lucide-react";
import useCustomQuery from "@/hooks/useCustomQuery";
import useMutate from "@/hooks/useMutate";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponseError } from "@/interfaces/axios";

interface TeamMember {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_name: string;
  profile_picture: string;
  status: string;
  invited_at: string;
  accepted_at: string | null;
}

interface Role {
  id: string;
  name: string;
  description: string;
  agency: string;
  agency_name: string;
  priviledges: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

interface Privilege {
  id: string;
  name: string;
  description: string;
}

interface InviteMemberPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  role: string;
  enable_geolocation: boolean;
}

export default function TeamsSettingsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrivilegesModalOpen, setIsPrivilegesModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [formData, setFormData] = useState<InviteMemberPayload>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    role: "",
    enable_geolocation: true,
  });

  // Fetch team members using useCustomQuery
  const { data: teamMembersResponse, isPending: loadingMembers } = useCustomQuery<TeamMember[]>(
    { url: "teams/team-members/" },
    {
      queryKey: ["team-members"],
    }
  );

  // Fetch roles using useCustomQuery
  const { data: rolesResponse, isPending: loadingRoles } = useCustomQuery<Role[]>(
    { url: "teams/roles/" },
    {
      queryKey: ["team-roles"],
    }
  );

  // Fetch privileges using useCustomQuery
  const { data: privilegesResponse, isPending: loadingPrivileges } = useCustomQuery<Privilege[]>(
    { url: "teams/priviledges/" },
    {
      queryKey: ["team-privileges"],
      enabled: isPrivilegesModalOpen,
    }
  );

  // Invite member mutation using useMutate
  const { mutateAsync: inviteMember, isPending: inviting } = useMutate<
    { message: string },
    InviteMemberPayload
  >({
    url: "teams/invite-member/",
    type: "post",
  });

  // Re-invite member mutation
  const { mutateAsync: reInviteMember } = useMutate<
    { message: string },
    { email: string }
  >({
    url: "teams/resend-invitation/",
    type: "post",
  });

  // Delete member mutation
  const { mutateAsync: deleteMember } = useMutate<
    { message: string },
    null
  >({
    url: `teams/delete-member/${selectedMember?.id}/`,
    type: "delete",
  });

  const teamMembers = useMemo(() => teamMembersResponse || [], [teamMembersResponse]);
  const roles: Role[] = rolesResponse || [];
  const privileges = privilegesResponse || [];

  // Filter team members based on search and role filter
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch = 
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || member.role_name.toLowerCase() === roleFilter.toLowerCase();
      
      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchTerm, roleFilter]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roleNames = teamMembers.map((member: TeamMember) => member.role_name);
    return [...new Set(roleNames)];
  }, [teamMembers]);

  const handleInputChange = (field: keyof InviteMemberPayload, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await inviteMember(formData);
      
      // Invalidate and refetch the team members
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      
      // Reset form and close dialog
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        role: "",
        enable_geolocation: true,
      });
      setIsDialogOpen(false);
      
      toast.success(response?.data.message ?? "Team member invited successfully!");
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data.message ?? "Failed to invite team member");
    }
  };

  const handleReInvite = async (member: TeamMember) => {
    try {
      const response = await reInviteMember({ email: member.email });
      toast.success(response?.data.message ?? "Invitation resent successfully!");
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data.message ?? "Failed to resend invitation");
    }
  };

  const handleAssignPrivileges = (member: TeamMember) => {
    setSelectedMember(member);
    setIsPrivilegesModalOpen(true);
    // Get current member privileges if available
    const memberRole = roles.find(role => role.name === member.role_name);
    if (memberRole) {
      setSelectedPrivileges(memberRole.priviledges.map(p => p.id));
    }
  };

  const handleDeleteMember = async (member: TeamMember) => {
    if (window.confirm(`Are you sure you want to delete ${member.first_name} ${member.last_name}?`)) {
      try {
        setSelectedMember(member);
        const response = await deleteMember(null);
        queryClient.invalidateQueries({ queryKey: ["team-members"] });
        toast.success(response?.data.message ?? "Team member deleted successfully!");
      } catch (error) {
        const err = error as ApiResponseError;
        toast.error(err?.response?.data.message ?? "Failed to delete team member");
      }
    }
  };

  const handlePrivilegeToggle = (privilegeId: string) => {
    setSelectedPrivileges(prev => 
      prev.includes(privilegeId) 
        ? prev.filter(id => id !== privilegeId)
        : [...prev, privilegeId]
    );
  };

  const formatPrivilegeName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Team Members</h2>
        <p className="text-sm text-gray-500">Manage your team members and their roles.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search team members" 
            className="pl-10 bg-[#F9FAFB]" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role.toLowerCase()}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingRoles ? (
                      <SelectItem value="" disabled>Loading roles...</SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_geolocation"
                  checked={formData.enable_geolocation}
                  onCheckedChange={(checked) => handleInputChange("enable_geolocation", checked)}
                />
                <Label htmlFor="enable_geolocation">Enable Geolocation</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={inviting} isLoading={inviting}>
                  Invite
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loadingMembers ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMembers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No team members found.</p>
            </Card>
          ) : (
            filteredMembers.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatar.png" alt={`${member.first_name} ${member.last_name}`} />
                  </Avatar>
                  <div className="flex-1 w-full">
                    <h3 className="font-medium">{member.first_name} {member.last_name}</h3>
                    <p className="text-sm text-gray-500 break-all">{member.email}</p>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium">{member.role_name}</p>
                      <p className="text-sm text-gray-500 capitalize">{member.status}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleReInvite(member)} >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Re-invite
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignPrivileges(member)}>
                          <Shield className="w-4 h-4 mr-2" />
                          Assign Privileges
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteMember(member)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Privileges Assignment Modal */}
      <Dialog open={isPrivilegesModalOpen} onOpenChange={setIsPrivilegesModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Assign Privileges - {selectedMember?.first_name} {selectedMember?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          {loadingPrivileges ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Select the privileges you want to assign to this team member:
              </p>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {privileges.map((privilege) => (
                  <div key={privilege.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={privilege.id}
                      checked={selectedPrivileges.includes(privilege.id)}
                      onCheckedChange={() => handlePrivilegeToggle(privilege.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={privilege.id} className="font-medium cursor-pointer">
                        {formatPrivilegeName(privilege.name)}
                      </Label>
                      <p className="text-sm text-gray-500">{privilege.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPrivilegesModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button">
                  Save Privileges
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button className="">Save Changes</Button>
      </div>
    </div>
  );
}