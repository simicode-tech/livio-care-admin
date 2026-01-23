import React from 'react'
  import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Pagination } from '../ui/pagination';

interface RolePermission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id:string;
  name: string;
  description: string;
  priviledges: RolePermission[];
  no_of_members: number;
}
const RoleList = ({rolesData,openRoleView,openRoleEdit,openRoleDelete,totalPages,page,setPage}:{rolesData:Role[],openRoleView:(role:Role)=>void,openRoleEdit:(role:Role)=>void,openRoleDelete:(role:Role)=>void,totalPages:number,page:number,setPage:(page:number)=>void}) => {
 
  return (
    <div>
          <div className="px-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <TableHead className="text-[#666666] font-medium">Roles</TableHead>
                <TableHead className="text-[#666666] font-medium">Permissions</TableHead>
                <TableHead className="text-[#666666] font-medium">Total Members</TableHead>
                <TableHead className="text-[#666666] font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesData.map((role) => (
                <TableRow key={role.id} className="border-b border-[#E5E7EB] hover:bg-[#FAFAFA]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E6F0FE] text-[#6F2DA8] flex items-center justify-center font-medium">
                        {role.name[0]}
                      </div>
                      <span className="font-medium text-[#1A1A1A]">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#666666]">
                    {role?.description}
                  </TableCell>
                  <TableCell className="text-[#1A1A1A]">{role.no_of_members}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openRoleView(role)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openRoleEdit(role)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openRoleDelete(role)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         <div className="px-6 py-4 border-t border-[#E5E7EB]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
    </div>
  )
}

export default RoleList