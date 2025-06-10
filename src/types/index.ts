
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'agent';

export interface LoginActivity {
  id: string;
  userId: string;
  userName: string;
  loginTime: Date;
  date: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
}
