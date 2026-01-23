"use client";

import { CustomDialog } from "@/components/ui/custom-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface IncidentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IncidentsDialog({ open, onOpenChange }: IncidentsDialogProps) {
  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} title="Incident Reports">
      <div className="px-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-normal text-gray-500">Date</TableHead>
              <TableHead className="font-normal text-gray-500">Incident Type</TableHead>
              <TableHead className="font-normal text-gray-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i} className="border-b border-gray-100">
                <TableCell className="py-4">Feb 25</TableCell>
                <TableCell className="py-4">
                  {i === 0 ? "Medication Error" : i === 1 ? "Fall Incident" : "Client Aggression"}
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant="outline" 
                    className={i === 1 ? "bg-yellow-50 text-yellow-700 border-0" : "bg-green-50 text-green-700 border-0"}
                  >
                    {i === 1 ? "Pending" : "Resolved"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CustomDialog>
  );
}