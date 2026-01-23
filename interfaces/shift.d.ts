interface ShiftType {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    created_at: string;
}

interface ShiftTypesResponse {
    status: boolean;
    message: string;
    data: ShiftType[];
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    page_number: number;
}

// New interfaces for calendar shifts
interface CaregiverWithShift {
    id: string;
    full_name: string;
    status: string;
    profile_picture: string;
}

interface CalendarShiftData {
    id: string;
    date: string;
    caregivers_with_shifts: CaregiverWithShift[];
    no_of_morning_shifts: number;
    no_of_afternoon_shifts: number;
    no_of_evening_shifts: number;
    no_of_todos: number;
    no_of_appointments: number;
}

interface CalendarShiftsResponse {
    status: boolean;
    message: string;
    data: CalendarShiftData[];
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    page_number: number;
}

interface ShiftListItem {
    id: string;
    caregiver_name: string;
    status: "PENDING" | "ACTIVE" | "INACTIVE" | "AWAITING";
    shift_type: "domiciliary" | "supported_living";
    total_hours_worked: number;
    shift_scheduled_duration: number;
    location: string;
    shift_check_in_time: string | null;
    date: string;
}

interface ShiftListResponse {
    status: boolean;
    message: string;
    data: ShiftListItem[];
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    page_number: number;
}


interface Todo {
    id: string;
    name: string;
    note: string | null;
    status: "pending" | "completed" | "in_progress";
    created_at: string;
    updated_at: string;
}

interface Appointment {
    id: string;
    client: string;
    client_name: string;
    start_time: string;
    end_time: string;
    appointment_time: string;
    appointment_type: string;
    reason: string;
    location_address: string;
    location_latitude: number;
    location_longitude: number;
    status: "scheduled" | "completed" | "cancelled";
    notes: string;
    todos: Todo[];
    created_at: string;
    updated_at: string;
}

interface ActivityLog {
    id: string;
    user: number;
    user_name: string;
    action: string;
    description: string;
    timestamp: string;
}

interface TimelineEvent {
    id: string;
    time: string;
    event: string;
    description: string;
}

interface ShiftDetails {
    id: string;
    shift_title: string;
    service_type: string;
    shift_type: "domiciliary" | "supported_living";
    shift_time: string;
    caregiver_name: string;
    client_name: string;
    location: string;
    total_hours_worked: number;
    total_hours_scheduled: number;
    status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    activity_logs: ActivityLog[];
    timeline_events: TimelineEvent[];
    no_of_clients: number;
    no_of_appointments: number;
    appointments: Appointment[];
    todos: Todo[];
    date: string;
    scheduled_start_time: string;
    scheduled_end_time: string;
    paid_break_duration_minutes: number;
    enable_geolocation_tracking: boolean;
    location_latitude: number;
    location_longitude: number;
    additional_notes: string;
    created_at: string;
    updated_at: string;
}

interface ShiftDetailsResponse {
    status: boolean;
    message: string;
    data: ShiftDetails;
}