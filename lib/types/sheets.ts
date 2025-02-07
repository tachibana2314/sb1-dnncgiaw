export interface TimingInfo {
  id: number;
  value: string;
}

export interface JobTypeInfo {
  id: number;
  value: string;
  category: number | null;
}

export interface FormData {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  birthDate: string;
  timing: string;
  jobType: string;
  prefecture: string;
  city: string;
  phone: string;
  email: string;
} 