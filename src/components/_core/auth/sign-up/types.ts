export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedCountryName: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export const defaultSignUpFormData: SignUpFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  selectedCountryName: "Nigeria",
  password: "",
  confirmPassword: "",
  showPassword: false,
  showConfirmPassword: false,
};
