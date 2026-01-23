interface CaregiverDetails {
    user_id: number;
    caregiver_id: string;
    agency: string;
    service_type: string;
    employment_type: string;
    caregiver_name: string;
    email: string;
    phone: string;
    status: string;
    profile_picture: string | null;
    bio: string | null;
    performance_rating: number;
    address: string;
    county: string | null;
    dob: string;
    gender: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
    emergency_contact_email: string;
    emergency_contact_address: string;
    morning_availability: boolean;
    afternoon_availability: boolean;
    night_availability: boolean;
    monday_available: boolean;
    tuesday_available: boolean;
    wednesday_available: boolean;
    thursday_available: boolean;
    friday_available: boolean;
    saturday_available: boolean;
    sunday_available: boolean;
    hourly_rate: string;
    payment_method: string;
    payment_frequency: string;
    tax_id: string;
    work_location: string;
    preferred_shift_type: string;
    background_check_status: string;
    total_no_of_shifts_worked: number;
    dbs_certificate: string;
    total_no_of_worked_hours: number;
    worked_hours_breakdown: Array<{
        date: string;
        hours_worked: number;
    }>;
    total_hours_worked_month: number;
    upcoming_shifts: Array<{
        date: string;
        time: string;
        shift_type: string;
        location: string;
    }>;
    past_shifts: Array<{
        date: string;
        hours_worked: number;
        client_feedback: number;
    }>;
    incident_reports: Array<{
        date: string;
        incident_type: string;
        status: string;
    }>;
    certificates: Array<{
        id: number;
        certificate_name: string;
        file: string;
        created_at: string;
    }>;
}

type Caregiver = {
    id: string;
    caregiver_name: string;
    status: "active" | "inactive" | "on-leave";
    no_of_shifts_assigned: number;
    worked_hours: number;
    performance_rating: number;
    profile_picture: string;
  };