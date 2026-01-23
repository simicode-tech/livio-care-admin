"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { CustomSideDialog } from "../ui/custom-side-dialog";

interface CreateSubscriptionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSubscription({ open, onOpenChange }: CreateSubscriptionProps) {
  const [features, setFeatures] = useState<string[]>([""]);

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  return (
    <CustomSideDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Plan"
       className='w-[500px] h-full'
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Plan Name</Label>
          <Input placeholder="Basic Plan" />
        </div>
        
        <div className="space-y-2">
          <Label>Description</Label>
          <Input placeholder="Enter plan description" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price</Label>
            <Input placeholder="0.00" type="number" />
          </div>
          <div className="space-y-2">
            <Label>Billing Interval</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Features</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#590054] hover:text-[#590054]/90 hover:bg-purple-50 p-0 h-auto font-normal"
              onClick={addFeature}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Feature
            </Button>
          </div>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Enter feature"
                />
                {features.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFeature(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-[#590054] hover:bg-[#590054]/90 text-white">
            Save Plan
          </Button>
        </div>
      </div>
    </CustomSideDialog>
  );
}