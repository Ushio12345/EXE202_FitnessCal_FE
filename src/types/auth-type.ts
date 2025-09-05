export interface Identity {
  id: string;
  identity_data: {
    avatar_url?: string;
    email?: string;
    email_verified?: boolean;
    full_name?: string;
    iss?: string;
    name?: string;
    phone_verified?: boolean;
    picture?: string;
    provider_id?: string;
    sub?: string;
  };
  provider: string;
  user_id: string;
  created_at: string;
  last_sign_in_at?: string;
  updated_at?: string;
}

export interface UserMetadata {
  avatar_url?: string;
  email?: string;
  email_verified?: boolean;
  full_name?: string;
  iss?: string;
  name?: string;
  phone_verified?: boolean;
  picture?: string;
  provider_id?: string;
  sub?: string;
}

export interface AppMetadata {
  provider: string;
  providers: string[];
}

export interface User {
  id: string;
  aud: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  identities: Identity[];
  is_anonymous: boolean;
}
