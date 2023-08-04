export interface User {
  avatar_url: string;
  center: null;
  code: null;
  department_id: null;
  email: string;
  full_name: string;
  id: 2;
  role: string;
  status: string;
  is_checkin_today: boolean;
}


export interface UserDetail {
  full_name: string;
  center: string;
  id: string;
  checkin: string;
  checkout: string;
  location: string;
}