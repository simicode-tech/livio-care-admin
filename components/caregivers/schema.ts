import { z } from "zod";

export const caregiverFormSchema = z.object({
  // Personal Information
  profile_picture: z.string().optional(),
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Contact number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(1, "Address is required"),

  // Emergency Contact
  emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact_relationship: z.string().min(1, "Relationship is required"),
  emergency_contact_email: z.string().email("Invalid email address"),
  emergency_contact_phone: z.string().min(1, "Contact number is required"),
  emergency_contact_address: z.string().min(1, "Address is required"),

  // Service and Availability
  service_type: z.string().min(1, "Service type is required"),
  morning_availability: z.boolean(),
  afternoon_availability: z.boolean(),
  night_availability: z.boolean(),

  // Working Days
  monday_available: z.boolean(),
  tuesday_available: z.boolean(),
  wednesday_available: z.boolean(),
  thursday_available: z.boolean(),
  friday_available: z.boolean(),
  saturday_available: z.boolean(),
  sunday_available: z.boolean(),

  // Employment Details
  employment_type: z.string().min(1, "Employment type is required"),
  location: z.string().min(1, "Location is required"),
  hourly_rate: z.number().min(0, "Hourly rate must be positive"),
  payment_method: z.string().min(1, "Payment method is required"),
  payment_frequency: z.string().min(1, "Payment frequency is required"),
  tax_id: z.string().min(1, "Tax ID is required"),

  // Compliance and Verification
  background_check_status: z.string(),
  dbs_certificate: z.string().optional(),
  certifications: z.array(z.object({
    certificate_name: z.string(),
    file: z.string()
  })),
});

export type CaregiverFormData = z.infer<typeof caregiverFormSchema>;