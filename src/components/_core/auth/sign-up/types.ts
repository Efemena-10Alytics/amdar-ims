export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  selectedCountryName: string;
  referralCode: string;
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
  countryCode: "",
  selectedCountryName: "",
  referralCode: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
  showConfirmPassword: false,
};
