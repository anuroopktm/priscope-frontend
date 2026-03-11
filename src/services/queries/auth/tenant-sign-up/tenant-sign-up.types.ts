export interface TenantSignUpPayload {
  name: string;
  email: string;
  company_name: string;
  password: string;
  confirm_password: string;
  code: string;
  otp_type: string;
}