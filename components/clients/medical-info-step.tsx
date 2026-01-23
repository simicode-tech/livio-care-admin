"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ClientFormData } from "./schema";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useUploadFile } from "@/hooks/useUploadFile";
import { toast } from "sonner";
import { ApiResponseError } from "@/interfaces/axios";
import { useRef } from "react";

interface MedicalInfoStepProps {
  form: UseFormReturn<ClientFormData>;
}

const commonConditions = [
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Hypertension",
  "Heart Disease",
  "Arthritis",
  "Asthma",
  "Cancer",
  "Dementia",
  "Depression",
  "Anxiety",
  "COPD",
  "Stroke",
];

export function MedicalInfoStep({ form }: MedicalInfoStepProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const { uploadFile, isPending } = useUploadFile();
const fileInputRef = useRef<HTMLInputElement>(null);
  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = useFieldArray({
    control: form.control,
    name: "medication",
  });

  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control: form.control,
    name: "allergy",
  });

  const { fields: visitFields, append: appendVisit, remove: removeVisit } = useFieldArray({
    control: form.control,
    name: "medical_visits",
  });

  const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control: form.control,
    name: "client_documents",
  });

  const handleConditionToggle = (condition: string) => {
    const newConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter(c => c !== condition)
      : [...selectedConditions, condition];
    
    setSelectedConditions(newConditions);
    form.setValue("medical_condition.conditions", newConditions);
  };

  const handleAddMedication = () => {
    appendMedication({
      name: "",
      dosage: "",
      frequency: "",
      start_date: "",
      end_date: "",
      notes: "",
    });
  };

  const handleAddAllergy = () => {
    appendAllergy({
      common_name: "",
      allergen: "",
      severity: "mild",
      notes: "",
    });
  };

  const handleAddVisit = () => {
    appendVisit({
      date: "",
      doctor_name: "",
      reason: "",
      notes: "",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await uploadFile(file);
        if (result?.data?.url) {
          appendDocument({
            name: file.name,
            url: result.data?.url,
          });
          toast.success("Document uploaded successfully");
        }
      } catch (error) {
         const err = error as ApiResponseError;
         toast.error(
           err?.response?.data?.message ?? "Failed to upload document"
         );
      
      }
    }
  };

  return (
    <div className="space-y-8 bg-[#F9FAFB] p-6 rounded-lg">
      {/* Medical Conditions */}
      <div className="space-y-6">
        <h3 className="text-base font-medium">Medical Conditions</h3>
        <div className="grid grid-cols-3 gap-4">
          {commonConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={condition}
                checked={selectedConditions.includes(condition)}
                onChange={() => handleConditionToggle(condition)}
                className="rounded border-gray-300"
              />
              <label htmlFor={condition} className="text-sm">
                {condition}
              </label>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="medical_condition.summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical Conditions Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter summary of medical conditions"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Medications */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Medications</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMedication}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Medication
          </Button>
        </div>

        <div className="space-y-4">
          {medicationFields.map((field, index) => (
            <div
              key={field.id}
              className="relative bg-white p-4 rounded-lg border"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeMedication(index)}
                className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`medication.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter medication name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medication.${index}.dosage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter dosage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name={`medication.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., twice daily" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medication.${index}.start_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medication.${index}.end_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name={`medication.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter special instructions"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Allergies</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAllergy}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Allergy
          </Button>
        </div>

        <div className="space-y-4">
          {allergyFields.map((field, index) => (
            <div
              key={field.id}
              className="relative bg-white p-4 rounded-lg border"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAllergy(index)}
                className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`allergy.${index}.common_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Common Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter common name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`allergy.${index}.allergen`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergen</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter allergen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name={`allergy.${index}.severity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`allergy.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Visits */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Medical Visits</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddVisit}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Visit
          </Button>
        </div>

        <div className="space-y-4">
          {visitFields.map((field, index) => (
            <div
              key={field.id}
              className="relative bg-white p-4 rounded-lg border"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeVisit(index)}
                className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`medical_visits.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medical_visits.${index}.doctor_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter doctor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name={`medical_visits.${index}.reason`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Visit</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter reason" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medical_visits.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Documents */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Client Documents</h3>
          {/* <label htmlFor="doc-input" className="flex items-center gap-2 cursor-pointer">
            <input
            id="doc-input"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isPending}
               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              // multiple
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Upload Document
            </Button>
          </label> */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isPending}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              className="flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              {isPending ? (
                <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Upload Document
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {documentFields.map((field, index) => (
            <div
              key={field.id}
              className="relative bg-white p-4 rounded-lg border flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium">
                  {form.watch(`client_documents.${index}.name`)}
                </div>
                <a
                  href={form.watch(`client_documents.${index}.url`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Document
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDocument(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}