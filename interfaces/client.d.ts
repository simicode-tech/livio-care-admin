interface Client  {
    id: string;
    client_id: string;
    client_name: string;
    profile_picture: string;
    age: number;
    location: string;
    status: "active" | "inactive";
    caregiver_assigned: string;
};
  
interface ClientDetails {
  id: string;
  client_id: string;
  service_type: string;
  profile_picture: string;
  personal_details: {
    full_name: string;
    gender: string;
    age: number;
    height: number;
    weight: number;
    address: string;
    phone: string;
    email: string;
    marital_status: string;
    dob: string;
  };
  emergency_contact: {
    first_name: string;
    last_name: string;
    relationship: string;
    email: string;
    phone: string;
    address: string;
  };
  family_members_with_access: Array<{
    first_name: string;
    last_name: string;
    relationship: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    has_access: boolean;
  }>;
  incident_reports: { date: string; type: string; reportedBy: string }[];
  activity_log: Array<{
    timestamp: string;
    activity_type: string;
    activity_type_display: string;
    notes: string;
    actor_name: string;
  }>;
  status: string;
  care_plan: string | null;
  social_worker_first_name: string;
  social_worker_last_name: string;
  social_worker_email: string;
  social_worker_phone: string;
  social_worker_schedule: string | null;
  social_worker_visit_frequency: string | null;
  medical_information: {
    medical_conditions: {
      conditions: string[];
      summary: string;
    };
    allergies: Array<{
      common_name: string;
      allergen: string;
      severity: string;
      notes: string;
      created_at: string;
      updated_at: string;
    }>;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      start_date: string;
      status: string;
      end_date: string;
      notes: string;
      created_at: string;
      updated_at: string;
    }>;
  };
}