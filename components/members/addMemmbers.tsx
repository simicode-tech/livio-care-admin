import React, { useState } from 'react'
import { CustomSideDialog } from '../ui/custom-side-dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

const AddMemmbers = ({ add, setAdd, initial, isEdit = false}: { add: boolean; setAdd: (value: boolean) => void; initial?: Partial<{ firstName: string; lastName: string; email: string; contact: string; city: string; state: string; organization: string; role: string }>; isEdit?: boolean }) => {
    const [form, setForm] = useState({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    email: initial?.email ?? "",
    contact: initial?.contact ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    organization: initial?.organization ?? "",
    role: initial?.role ?? "",
  });
  const handleFormChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const handleSave = () => {
    // TODO: Hook up API or mutation for creating a member
    setAdd(false);
  };
  return (
    <CustomSideDialog
      title={isEdit ? "Update Member" : "Add Member"}
      open={add}
      onOpenChange={() => setAdd(false)}
      className='w-[500px]'
    >
    <div className="bg-[#F4F4F4] rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">First Name</Label>
                <Input
                  placeholder="Enter first name"
                  value={form.firstName}
                  onChange={(e) => handleFormChange("firstName", e.target.value)}
                  className="h-10 bg-white border-[#E5E7EB] rounded-lg placeholder:text-gray-[#979797]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">Last Name</Label>
                <Input
                  placeholder="Enter last name"
                  value={form.lastName}
                  onChange={(e) => handleFormChange("lastName", e.target.value)}
                  className="h-10 bg-white border-[#E5E7EB] rounded-lg placeholder:text-gray-[#979797]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">Email Address</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="h-10 bg-white border-[#E5E7EB] rounded-lg placeholder:text-gray-[#979797]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">Contact Number</Label>
                <Input
                  placeholder="Enter contact number"
                  value={form.contact}
                  onChange={(e) => handleFormChange("contact", e.target.value)}
                  className="h-10 bg-white border-[#E5E7EB] rounded-lg placeholder:text-gray-[#979797]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">City</Label>
                <Select
                  value={form.city}
                  onValueChange={(v) => handleFormChange("city", v)}
                  
                >
                  <SelectTrigger className="h-10 bg-white border-[#E5E7EB] rounded-lg text-gray-[#979797]">
                    <SelectValue placeholder="Select city" className='text-gray-[#979797]' />
                  </SelectTrigger>
                  <SelectContent className='text-gray-[#979797]'>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">State</Label>
                <Select
                  value={form.state}
                  onValueChange={(v) => handleFormChange("state", v)}
                >
                  <SelectTrigger className="h-10 bg-white border-[#E5E7EB] rounded-lg">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">Organization</Label>
                <Select
                  value={form.organization}
                  onValueChange={(v) => handleFormChange("organization", v)}
                >
                  <SelectTrigger className="h-10 bg-white border-[#E5E7EB] rounded-lg">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Caring Hearts">Caring Hearts</SelectItem>
                    <SelectItem value="Livio Care">Livio Care</SelectItem>
                    <SelectItem value="Sunrise Health">Sunrise Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => handleFormChange("role", v)}
                >
                  <SelectTrigger className="h-10 bg-white border-[#E5E7EB] rounded-lg">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className='text-gray-[#979797]'>
                    <SelectItem value="Admin" className='text-gray-[#979797]'>Admin</SelectItem>
                    <SelectItem value="Manager" className='text-gray-[#979797]'>Manager</SelectItem>
                    <SelectItem value="Caregiver" className='text-gray-[#979797]'>Caregiver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6">
            <Button
              variant='outline'
              className="border-primary text-primary hover:bg-transparent"
              onClick={() => setAdd(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary text-white"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>

    </CustomSideDialog>
  )
}

export default AddMemmbers