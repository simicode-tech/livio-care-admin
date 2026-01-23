"use client";

import { Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  caregiverFormSchema,
  type CaregiverFormData,
} from "../caregivers/schema";
import { PersonalInfoStep } from "../caregivers/personal-info-step";
import { EmploymentDetailsStep } from "../caregivers/employment-details-step";
import { VerificationStep } from "../caregivers/verification-step";
import { CustomDialog } from "./custom-dialog";
import { AssignmentSchedulingStep } from "../caregivers/assignment-scheduling-step";
import { Stepper } from "./stepper";
import { DialogFooter } from "./dialog-footer";
import useMutate from "@/hooks/useMutate";
import { toast } from "sonner";
import { ApiResponseError } from "@/interfaces/axios";
import { useQueryClient } from "@tanstack/react-query";
import { CaregiverSuccessModal } from "./caregiver-success-modal";

interface AddCaregiverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caregiverData?: CaregiverDetails | null; // Optional caregiver data for editing
  isEdit?: boolean; // Flag to determine if it's edit mode
}

const steps = [
  { id: 1, name: "Personal\nInformation" },
  { id: 2, name: "Employment\nDetails" },
  { id: 3, name: "Assignment and\nScheduling" },
  { id: 4, name: "Compliance and\nVerification" },
];

// Validation functions for each step
const validateStep1 = (data: CaregiverFormData) => {
  return (
    data.full_name &&
    data.gender &&
    data.dob &&
    data.email &&
    data.phone &&
    data.address &&
    data.emergency_contact_name &&
    data.emergency_contact_relationship &&
    data.emergency_contact_email &&
    data.emergency_contact_phone &&
    data.emergency_contact_address
  );
};

const validateStep2 = (data: CaregiverFormData) => {
  return (
    data.service_type &&
    data.employment_type &&
    data.location &&
    data.hourly_rate &&
    data.payment_frequency &&
    data.payment_method &&
    data.tax_id
  );
};

const validateStep3 = (data: CaregiverFormData) => {
  return (
    (data.morning_availability || data.afternoon_availability || data.night_availability) &&
    (data.monday_available || data.tuesday_available || data.wednesday_available || 
     data.thursday_available || data.friday_available || data.saturday_available || data.sunday_available)
  );
};

const validateStep4 = (data: CaregiverFormData) => {
  return (
    data.background_check_status &&
    data.certifications &&
    data.certifications.length > 0 &&
    data.dbs_certificate
  );
};

interface Response {
  status: true;
  message: string;
  data: {
    caregiver_name: string;
    email: string;
    invitation_code: string;
  };
}

export function AddCaregiverModal({
  open,
  onOpenChange,
  caregiverData,
  isEdit = false,
}: AddCaregiverModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inviteData, setInviteData] = useState<{
    caregiver_name: string;
    email: string;
    invitation_code: string;
  } | null>(null);
  
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutate<Response, CaregiverFormData>({
    url: isEdit ? `caregivers/${caregiverData?.caregiver_id}/` : "teams/add-caregiver/",
    type: isEdit ? "patch" : "post",
  });

  const form = useForm<CaregiverFormData>({
    resolver: zodResolver(caregiverFormSchema),
    defaultValues: {
      profile_picture: "",
      full_name: "",
      gender: "",
      dob: "",
      email: "",
      phone: "",
      address: "",
      emergency_contact_name: "",
      emergency_contact_relationship: "",
      emergency_contact_email: "",
      emergency_contact_phone: "",
      emergency_contact_address: "",
      service_type: "",
      employment_type: "",
      location: "",
      hourly_rate: 0,
      payment_frequency: "",
      payment_method: "",
      tax_id: "",
      morning_availability: false,
      afternoon_availability: false,
      night_availability: false,
      monday_available: false,
      tuesday_available: false,
      wednesday_available: false,
      thursday_available: false,
      friday_available: false,
      saturday_available: false,
      sunday_available: false,
      background_check_status: "pending",
      certifications: [],
      dbs_certificate: "",
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (isEdit && caregiverData && open) {
      form.reset({
        profile_picture: caregiverData?.profile_picture || "",
        full_name: caregiverData?.caregiver_name || "",
        gender: caregiverData?.gender ?? "", // Not available in CaregiverDetails, keep empty
        dob: caregiverData?.dob ?? "", // Not available in CaregiverDetails, keep empty
        email: caregiverData?.email || "",
        phone: caregiverData?.phone || "",
        address: caregiverData?.address ?? "", // Not available in CaregiverDetails, keep empty
        emergency_contact_name: caregiverData?.emergency_contact_name || "",
        emergency_contact_relationship: caregiverData?.emergency_contact_relationship || "",
        emergency_contact_email: caregiverData?.emergency_contact_email || "",
        emergency_contact_phone: caregiverData?.emergency_contact_phone || "",
        emergency_contact_address: caregiverData?.emergency_contact_address || "",
        service_type: caregiverData?.service_type || "",
        employment_type:caregiverData?.employment_type ??  "", // Not available in CaregiverDetails, keep empty
        location: caregiverData?.work_location || "",
        hourly_rate: parseFloat(caregiverData?.hourly_rate) || 0,
        payment_frequency: caregiverData?.payment_frequency || "",
        payment_method: caregiverData?.payment_method || "",
        tax_id: caregiverData?.tax_id || "",
        morning_availability: caregiverData?.morning_availability || false,
        afternoon_availability: caregiverData?.afternoon_availability || false,
        night_availability: caregiverData?.night_availability || false,
        monday_available: caregiverData?.monday_available || false,
        tuesday_available: caregiverData?.tuesday_available || false,
        wednesday_available: caregiverData?.wednesday_available || false,
        thursday_available: caregiverData?.thursday_available || false,
        friday_available: caregiverData?.friday_available || false,
        saturday_available: caregiverData?.saturday_available || false,
        sunday_available: caregiverData?.sunday_available || false,
        background_check_status: caregiverData?.background_check_status || "pending",
        certifications: caregiverData?.certificates || [],
        dbs_certificate: caregiverData?.dbs_certificate ?? "", // Not directly available, keep empty
      });
    } else if (!isEdit && open) {
      // Reset form for new caregiver
      form.reset({
        profile_picture: "",
        full_name: "",
        gender: "",
        dob: "",
        email: "",
        phone: "",
        address: "",
        emergency_contact_name: "",
        emergency_contact_relationship: "",
        emergency_contact_email: "",
        emergency_contact_phone: "",
        emergency_contact_address: "",
        service_type: "",
        employment_type: "",
        location: "",
        hourly_rate: 0,
        payment_frequency: "",
        payment_method: "",
        tax_id: "",
        morning_availability: false,
        afternoon_availability: false,
        night_availability: false,
        monday_available: false,
        tuesday_available: false,
        wednesday_available: false,
        thursday_available: false,
        friday_available: false,
        saturday_available: false,
        sunday_available: false,
        background_check_status: "pending",
        certifications: [],
        dbs_certificate: "",
      });
    }
  }, [isEdit, caregiverData, open, form]);

  // Watch form values to enable/disable buttons
  const formValues = form.watch();

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return validateStep1(formValues);
      case 2:
        return validateStep2(formValues);
      case 3:
        return validateStep3(formValues);
      case 4:
        return validateStep4(formValues);
      default:
        return false;
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  async function onSubmit(data: CaregiverFormData) {
    try {
      const response = await mutateAsync(data);
      
      if (isEdit) {
        // For edit mode, just show success toast and close modal
        toast.success("Caregiver updated successfully");
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["caregiver-details"] });
        queryClient.invalidateQueries({ queryKey: ["caregivers"] });
      } else {
        // For add mode, show success modal with invite data
        onOpenChange(false);
        setInviteData(response.data.data);
        setShowSuccessModal(true);
        queryClient.invalidateQueries({ queryKey: ["caregivers"] });
      }
      
      setCurrentStep(1);
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data?.message ?? `Failed to ${isEdit ? 'update' : 'create'} caregiver`);
    }
  }
  
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setInviteData(null);
  };

  return (
    <>
      <CustomDialog 
        open={open} 
        onOpenChange={onOpenChange} 
        title={isEdit ? "Edit Caregiver" : "New Caregiver"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Stepper steps={steps} currentStep={currentStep} />

            <div className="space-y-4 pb-24">
              {currentStep === 1 && <PersonalInfoStep form={form} profilePicture={caregiverData?.profile_picture ?? null} />}
              {currentStep === 2 && <EmploymentDetailsStep form={form} />}
              {currentStep === 3 && <AssignmentSchedulingStep form={form} />}
              {currentStep === 4 && <VerificationStep form={form} />}
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
              isNextDisabled={!isCurrentStepValid()}
            />
          </form>
        </Form>
      </CustomDialog>

      {/* Success Modal - only show for add mode */}
      {!isEdit && inviteData && (
        <CaregiverSuccessModal
          open={showSuccessModal}
          onOpenChange={handleSuccessModalClose}
          caregiverData={inviteData}
        />
      )}
    </>
  );
}
