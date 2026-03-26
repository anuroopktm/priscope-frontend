export interface VerifyUserRequest {
  code: string;
  email: string;
  otp_type: string;
  tenant_id: string;
}

export interface VerifyUserResponse {
  first_login: boolean;
  message: string;
}

export interface SendOtpRequest {
  email: string;
  otp_type: string;
  tenant_id: string;
}

export interface SendOtpResponse {
  message: string;
  otp_type: string;
  tenant_id: string;
}

export interface UserSignUpRequest {
  encrypted: string;
  nonce: string;
}

export interface UserSignUpPayload {
  code: string;
  confirm_password: string;
  email: string;
  oauth_access_token?: string;
  otp_type: string;
  password: string;
  tenant_id: string;
  type: string;
}

export interface UserSignUpResponse {
  message: string;
}

export interface VerifyInviteRequest {
  token: string;
}

export interface VerifyInviteResponse {
  email: string;
  name: string;
  tenant_id: string;
  user_active: boolean;
}
