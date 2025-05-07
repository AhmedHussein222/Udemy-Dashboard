export interface Iuser {
  first_name: string;
  last_name: string;
  email: string;
  Password: string;
  gender: string;
  bio: string;
  role: string;
  createAt: Date;
  links?: {
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
  }
}
