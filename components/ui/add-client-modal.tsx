"use client";

import { Form } from "@/components/ui/form";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFormSchema, type ClientFormData } from "../clients/schema";
import { PersonalInfoStep } from "../clients/personal-info-step";
import { ContactFamilyStep } from "../clients/contact-family-step";
import { AssignedCaregiverStep } from "../clients/assigned-social-worker-step";
import { MedicalInfoStep } from "../clients/medical-info-step";
import { CustomDialog } from "./custom-dialog";
import { Stepper } from "./stepper";
import { DialogFooter } from "./dialog-footer";
import useMutate from "@/hooks/useMutate";
import { toast } from "sonner";
import { ApiResponseError } from "@/interfaces/axios";
import { useQueryClient } from "@tanstack/react-query";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientData?: ClientDetails | null; // Optional client data for editing
  isEdit?: boolean; // Flag to determine if it's edit mode
}

const steps = [
  { id: 1, name: "Personal\nInformation" },
  { id: 2, name: "Contact and\nFamily" },
  { id: 3, name: "Social\nWorker" },
  { id: 4, name: "Medical\nInformation" },
];

// Helper function to get changed fields
function getChangedFields(original: ClientFormData, current: ClientFormData): Partial<ClientFormData> {
  const changes: Partial<ClientFormData> = {};
  
  // Compare primitive fields
  // Object.keys(current).forEach(key => {
  //   const typedKey = key as keyof ClientFormData;
  //   if (typeof current[typedKey] !== 'object' || current[typedKey] === null) {
  //     if (original[typedKey] !== current[typedKey]) {
        
  //       (changes as any)[typedKey] = current[typedKey];
  //     }
  //   }
  // });
  (Object.keys(current) as Array<keyof ClientFormData>).forEach((key) => {
    if (typeof current[key] !== "object" || current[key] === null) {
      if (original[key] !== current[key]) {
        // Type-safe assignment without any
        (changes as Record<string, unknown>)[key] = current[key];
      }
    }
  });

  
  // Compare emergency contact
  if (JSON.stringify(original.emergency_contact) !== JSON.stringify(current.emergency_contact)) {
    changes.emergency_contact = current.emergency_contact;
  }
  
  // Compare family members
  if (JSON.stringify(original.family_members) !== JSON.stringify(current.family_members)) {
    changes.family_members = current.family_members;
  }
  
  // Compare medical condition
  if (JSON.stringify(original.medical_condition) !== JSON.stringify(current.medical_condition)) {
    changes.medical_condition = current.medical_condition;
  }
  
  // Compare allergies
  if (JSON.stringify(original.allergy) !== JSON.stringify(current.allergy)) {
    changes.allergy = current.allergy;
  }
  
  // Compare medications
  if (JSON.stringify(original.medication) !== JSON.stringify(current.medication)) {
    changes.medication = current.medication;
  }
  
  // Compare medical visits
  if (JSON.stringify(original.medical_visits) !== JSON.stringify(current.medical_visits)) {
    changes.medical_visits = current.medical_visits;
  }
  
  // Compare client documents
  if (JSON.stringify(original.client_documents) !== JSON.stringify(current.client_documents)) {
    changes.client_documents = current.client_documents;
  }
  
  return changes;
}

export function AddClientModal({ 
  open, 
  onOpenChange, 
  clientData, 
  isEdit = false 
}: AddClientModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const originalDataRef = useRef<ClientFormData | null>(null);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutate<
    { message: string }, 
    ClientFormData | Partial<ClientFormData>
  >({
    url: isEdit ? `clients/${clientData?.id}/` : "clients/add/",
    type: isEdit ? "patch" : "post",
  });

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      profile_picture: "",
      title: "",
      first_name: "",
      last_name: "",
      gender: "",
      dob: "",
      marital_status: "",
      status: "",
      email: "",
      phone: "",
      weight: 0,
      height: 0,
      address: "",
      visit_frequency: "",
      service_type: "",
      care_plan: "",
      social_worker_first_name: "",
      social_worker_last_name: "",
      social_worker_email: "",
      social_worker_phone: "",
      social_worker_schedule: "",
      social_worker_visit_frequency: "",
      emergency_contact: {
        first_name: "",
        last_name: "",
        relationship: "",
        email: "",
        phone: "",
        address: "",
      },
      family_members: [],
      medical_condition: {
        conditions: [],
        summary: "",
      },
      allergy: [],
      medication: [],
      medical_visits: [],
      client_documents: [],
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (isEdit && clientData && open) {
      // Split full name into title, first name, and last name
      const fullName = clientData.personal_details?.full_name || "";
      const nameParts = fullName.split(" ");
      let title = "";
      let firstName = "";
      let lastName = "";
      
      if (nameParts.length > 0) {
        // Check if first part is a title (Mr, Mrs, Dr, etc.)
        const possibleTitle = nameParts[0].toLowerCase();
        if (["mr", "mrs", "ms", "dr", "prof"].includes(possibleTitle.replace(".", ""))) {
          title = nameParts[0];
          firstName = nameParts.slice(1, -1).join(" ");
          lastName = nameParts[nameParts.length - 1] || "";
        } else {
          firstName = nameParts.slice(0, -1).join(" ");
          lastName = nameParts[nameParts.length - 1] || "";
        }
      }

      const formData: ClientFormData = {
        profile_picture: clientData?.profile_picture || "",
        title: title,
        first_name: firstName,
        last_name: lastName,
        gender: clientData?.personal_details?.gender || "",
        dob: clientData?.personal_details?.dob || "",
        marital_status: clientData?.personal_details?.marital_status || "",
        status: clientData?.status || "",
        email: clientData?.personal_details?.email || "",
        phone: clientData?.personal_details?.phone || "",
        weight: clientData?.personal_details?.weight || 0,
        height: clientData?.personal_details?.height || 0,
        address: clientData?.personal_details?.address || "",
        visit_frequency: "", // Not available in ClientDetails
        service_type: clientData?.service_type || "",
        care_plan: clientData?.care_plan || "",
        social_worker_first_name: clientData?.social_worker_first_name || "",
        social_worker_last_name: clientData?.social_worker_last_name || "",
        social_worker_email: clientData?.social_worker_email || "",
        social_worker_phone: clientData?.social_worker_phone || "",
        social_worker_schedule: clientData?.social_worker_schedule || "",
        social_worker_visit_frequency: clientData?.social_worker_visit_frequency || "",
        emergency_contact: {
          first_name: clientData?.emergency_contact?.first_name || "",
          last_name: clientData?.emergency_contact?.last_name || "",
          relationship: clientData?.emergency_contact?.relationship || "",
          email: clientData?.emergency_contact?.email || "",
          phone: clientData?.emergency_contact?.phone || "",
          address: clientData?.emergency_contact?.address || "",
        },
        family_members: clientData?.family_members_with_access || [],
        medical_condition: {
          conditions: clientData?.medical_information?.medical_conditions?.conditions || [],
          summary: clientData?.medical_information?.medical_conditions?.summary || "",
        },
        allergy: clientData?.medical_information?.allergies?.map(allergy => ({
          common_name: allergy.common_name,
          allergen: allergy.allergen,
          severity: allergy.severity as "mild" | "moderate" | "severe",
          notes: allergy.notes,
        })) || [],
        medication: clientData?.medical_information?.medications?.map(medication => ({
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          start_date: medication.start_date,
          end_date: medication.end_date,
          notes: medication.notes,
        })) || [],
        medical_visits: [], // Not available in ClientDetails
        client_documents: [], // Not available in ClientDetails
      };
      
      // Store original data for comparison
      originalDataRef.current = { ...formData };
      form.reset(formData);
    } else if (!isEdit && open) {
      // Reset form for new client
      originalDataRef.current = null;
      form.reset({
        profile_picture: "",
        title: "",
        first_name: "",
        last_name: "",
        gender: "",
        dob: "",
        marital_status: "",
        status: "",
        email: "",
        phone: "",
        weight: 0,
        height: 0,
        address: "",
        visit_frequency: "",
        service_type: "",
        care_plan: "",
        social_worker_first_name: "",
        social_worker_last_name: "",
        social_worker_email: "",
        social_worker_phone: "",
        social_worker_schedule: "",
        social_worker_visit_frequency: "",
        emergency_contact: {
          first_name: "",
          last_name: "",
          relationship: "",
          email: "",
          phone: "",
          address: "",
        },
        family_members: [],
        medical_condition: {
          conditions: [],
          summary: "",
        },
        allergy: [],
        medication: [],
        medical_visits: [],
        client_documents: [],
      });
    }
  }, [isEdit, clientData, open, form]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  async function onSubmit(data: ClientFormData) {
    try {
      let payload: ClientFormData | Partial<ClientFormData> = data;
      
      // If editing, only send changed fields
      if (isEdit && originalDataRef.current) {
        const changedFields = getChangedFields(originalDataRef.current, data);
        
        // If no changes, show message and return
        if (Object.keys(changedFields).length === 0) {
          toast.info("No changes detected");
          return;
        }
        
        payload = changedFields;
        console.log("Sending only changed fields:", payload);
      }
      
      const response = await mutateAsync(payload);
      toast.success(response?.data?.message ?? `Client ${isEdit ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ["client-details"] });
      }
      onOpenChange(false);
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data?.message ?? `Failed to ${isEdit ? 'update' : 'create'} client`);
    }
  }

  return (
    <CustomDialog 
      open={open} 
      onOpenChange={onOpenChange} 
      title={isEdit ? "Edit Client" : "New Client"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Stepper steps={steps} currentStep={currentStep} />
          
          <div className="space-y-4 pb-24">
            {currentStep === 1 && <PersonalInfoStep form={form} />}
            {currentStep === 2 && <ContactFamilyStep form={form} />}
            {currentStep === 3 && <AssignedCaregiverStep form={form} />}
            {currentStep === 4 && <MedicalInfoStep form={form} />}
          </div>

          <DialogFooter
            showCancel
            showNext
            currentStep={currentStep}
            totalSteps={steps.length}
            onCancel={() => onOpenChange(false)}
            onNext={() => handleStepChange(currentStep + 1)}
            onPrevious={() => handleStepChange(currentStep - 1)}
            onSubmit={form.handleSubmit(onSubmit)}
            isLoading={isPending}
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
