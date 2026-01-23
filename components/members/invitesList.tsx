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
import Image from 'next/image';



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

const InvitesList = ({invites,openView,openSend,openDelete}:{invites:Invite[],openView:(role:Invite)=>void,openSend:(role:Invite)=>void,openDelete:(role:Invite)=>void,totalPages:number,page:number,setPage:(page:number)=>void}) => {
    console.log(invites);
    
 
  return (
   <div className="px-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <TableHead className="text-[#666666] font-medium">Name</TableHead>
                <TableHead className="text-[#666666] font-medium">Email</TableHead>
                <TableHead className="text-[#666666] font-medium">Role</TableHead>
                <TableHead className="text-[#666666] font-medium">Status</TableHead>
                <TableHead className="text-[#666666] font-medium">Invited by</TableHead>
                <TableHead className="text-[#666666] font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites?.length > 0 ? invites.map((inv) => (
                <TableRow key={inv.id} className="border-b border-[#E5E7EB] hover:bg-[#FAFAFA]">
                  <TableCell className="text-[#1A1A1A] font-medium">{inv.full_name}</TableCell>
                  <TableCell className="text-[#666666]">{inv.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#1A1A1A] text-sm font-medium">
                      {inv.role_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex px-3 py-1 rounded-full bg-[#FFF6E5] text-[#9C6B2D] text-xs font-medium">
                      {inv.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#1A1A1A]">{inv.invited_by_name}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openView(inv)}>
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openSend(inv)}>
                          <Pencil className="w-4 h-4 mr-2" /> Resend Invite
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDelete(inv)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <div className="h-[280px] flex flex-col items-center justify-center">
                      <Image src="/EmptyNotification.svg" alt="No data" height={200} width={200} />
                      <p className="mt-3 font-medium">No invites yet!</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
  )
}

export default InvitesList