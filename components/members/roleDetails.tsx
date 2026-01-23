import React from 'react'
import { Button } from '../ui/button'
import { CheckCircle2 } from 'lucide-react'
import { CustomSideDialog } from '../ui/custom-side-dialog'

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


const RoleDetails = ({roleViewOpen, setRoleViewOpen, selectedRole}: {roleViewOpen: boolean, setRoleViewOpen: (open: boolean) => void, selectedRole: Role}) => {
  return (
    <div>
          <CustomSideDialog title="Role" open={roleViewOpen} onOpenChange={setRoleViewOpen} className="w-[500px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E6F0FE] text-primary flex items-center justify-center font-semibold">
                {selectedRole.name[0]}
              </div>
              <div>
                <div className="text-lg font-semibold text-[#1A1A1A]">{selectedRole.name}</div>
                <div className="text-sm text-[#666666]">{selectedRole.description}</div>
              </div>
            </div>
            <div>
              
            </div>
            <div className="text-sm">
              <span className="text-[#666666]">Total members</span>
              <div className="font-medium text-[#1A1A1A]">{selectedRole.no_of_members}</div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-2">Permissions</div>
            <div className="space-y-2 grid grid-cols-2 gap-2">
              {selectedRole?.priviledges.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#21A249]" />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" className="rounded-lg border-primary text-primary" onClick={() => setRoleViewOpen(false)}>Close</Button>
            <Button className="bg-primary text-white rounded-lg">Edit</Button>
          </div>
        </CustomSideDialog>
    </div>
  )
}

export default RoleDetails