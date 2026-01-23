import React from 'react'
import { CustomSideDialog } from '../ui/custom-side-dialog'
import { CheckCircle2, Mail} from 'lucide-react'
import { Button } from '../ui/button'

interface RolePermission {
  id: string;
  name: string;
  description: string;
}
type MemberDetailsType ={
    "id":string,
    "email": string,
    "first_name": string,
    "last_name": string,
    "full_name": string,
    "role": string,
    "role_name": string,
    "role_permissions": RolePermission[],
    "is_active": boolean,
    "last_login": string,
    "created_at": string,
    "updated_at": string
}
export const MemberDetails = ({selectedMember, viewOpen, setViewOpen}: {selectedMember:MemberDetailsType, viewOpen: boolean, setViewOpen: (open: boolean) => void}) => {
  return (
    <div>
         <CustomSideDialog
            title="Member"
            open={viewOpen}
            onOpenChange={setViewOpen}
            className="w-[500px]"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-[#E5E7EB] flex items-center justify-center bg-[#FCF6FF] text-primary font-semibold">
                {selectedMember.full_name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-[#1A1A1A]">{selectedMember.full_name}</div>
                <div className="text-sm text-[#666666]">{selectedMember.role_name}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg border border-[#E5E7EB] text-xs">{selectedMember.role_name}</span>
                  <span className="px-3 py-1 rounded-full bg-[#E8F8ED] text-[#21A249] text-xs">{selectedMember.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E7EB]">
              <div className="divide-y">
                <div className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-2 text-[#666666]"><Mail className="w-4 h-4" /> Email</div>
                  <span className="text-sm font-medium">{selectedMember.email}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4">
                  <div className="text-[#666666]">Last Login</div>
                  <span className="text-sm font-medium">{selectedMember.last_login}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[#666666] mb-2">Permissions</div>
              <div className="space-y-2">
                {selectedMember.role_permissions.map((p: RolePermission, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#21A249]" />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                className="rounded-lg border-primary text-primary"
                onClick={() => setViewOpen(false)}
              >
                Close
              </Button>
              <Button className="bg-primary text-white rounded-lg">Edit</Button>
            </div>
          </CustomSideDialog>
    </div>
  )
}
