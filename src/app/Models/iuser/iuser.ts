export interface Iuser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: string;
  bio: string;
  role: string;
  created_at: Date;
  profile_picture: string;
  links?: {
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
  };
}
