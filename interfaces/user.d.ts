interface Agency {
    id: string;
    name: string;
    agency_type: "supported" | string;
}

type Privilege = 
    | "add_caregiver"
    | "edit_caregiver"
    | "view_roles"
    | "edit_visit"
    | "delete_team_member"
    | "delete_caregiver"
    | "edit_own_profile"
    | "assign_privileges"
    | "invite_team_member"
    | "edit_client"
    | "view_agency_settings"
    | "delete_visit"
    | "delete_client"
    | "view_own_profile"
    | "delete_agency"
    | "view_caregivers"
    | "manage_billing"
    | "view_clients"
    | "send_message"
    | "add_client"
    | "create_visit"
    | "assign_admin_role"
    | "view_schedule"
    | "edit_team_member"
    | "view_team_members"
    | "view_privileges"
    | "edit_roles"
    | "view_financial_reports"
    | "edit_agency_settings"
    | "view_resources";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_active?: boolean;
    is_staff?: boolean;
    role_type?: null | string;
    agency?: Agency;
    role?: string;
    priviledges?: Privilege[];
    profile_picture: string | null;
    requires_2fa?: boolean;
}

interface PersonalProfile {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    profile_picture: string | null;
    is_active: boolean;
  }
  
  interface AgencyProfile {
    id: string;
    name: string;
    services_offered: string[] | null;
    postal_code: string;
    no_of_sites: number;
    no_of_active_carers: number;
    no_of_active_clients: number;
  }
