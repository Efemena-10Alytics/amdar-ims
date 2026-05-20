"use client";

import { useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

// ─── SVG Components ───────────────────────────────────────────────────────────

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2711 3.58812C11.2923 3.5088 11.329 3.43444 11.3789 3.36929C11.4289 3.30413 11.4912 3.24946 11.5623 3.2084C11.6334 3.16733 11.7119 3.14068 11.7933 3.12996C11.8747 3.11925 11.9574 3.12467 12.0367 3.14594C13.1954 3.44824 14.2525 4.05394 15.0992 4.90065C15.9459 5.74736 16.5516 6.80448 16.8539 7.96312C16.8752 8.04243 16.8806 8.12515 16.8699 8.20655C16.8592 8.28796 16.8325 8.36645 16.7915 8.43755C16.7504 8.50866 16.6957 8.57097 16.6306 8.62093C16.5654 8.6709 16.491 8.70753 16.4117 8.72875C16.3589 8.74262 16.3046 8.7497 16.25 8.74984C16.1124 8.74988 15.9786 8.7045 15.8694 8.62073C15.7602 8.53696 15.6817 8.4195 15.6461 8.28656C15.3997 7.34057 14.9054 6.47743 14.2142 5.78613C13.5231 5.09482 12.66 4.60037 11.7141 4.35375C11.6347 4.33262 11.5602 4.29604 11.495 4.24611C11.4298 4.19618 11.375 4.13388 11.3339 4.06277C11.2927 3.99166 11.266 3.91314 11.2552 3.8317C11.2445 3.75025 11.2499 3.66748 11.2711 3.58812ZM11.0891 6.85375C12.1664 7.14125 12.8586 7.83422 13.1461 8.91156C13.1817 9.0445 13.2602 9.16196 13.3694 9.24573C13.4786 9.3295 13.6124 9.37488 13.75 9.37484C13.8046 9.3747 13.8589 9.36762 13.9117 9.35375C13.991 9.33253 14.0654 9.2959 14.1306 9.24593C14.1957 9.19597 14.2504 9.13366 14.2915 9.06255C14.3325 8.99145 14.3592 8.91296 14.3699 8.83155C14.3806 8.75015 14.3752 8.66743 14.3539 8.58812C13.9539 7.09125 12.9086 6.04594 11.4117 5.64594C11.2516 5.60315 11.081 5.62574 10.9374 5.70874C10.7939 5.79174 10.6893 5.92835 10.6465 6.08851C10.6037 6.24868 10.6263 6.41928 10.7093 6.56279C10.7923 6.7063 10.9289 6.81096 11.0891 6.85375ZM16.7477 13.0045L13.0672 11.3553L13.057 11.3506C12.866 11.2689 12.6575 11.2361 12.4506 11.2552C12.2437 11.2743 12.0448 11.3447 11.8719 11.46C11.8515 11.4734 11.832 11.4881 11.8133 11.5037L9.91173 13.1248C8.70704 12.5397 7.46329 11.3053 6.87813 10.1162L8.50157 8.18578C8.51719 8.16625 8.53204 8.14672 8.5461 8.12562C8.65894 7.9532 8.72739 7.75556 8.74539 7.55029C8.76338 7.34502 8.73034 7.13848 8.64923 6.94906V6.93969L6.99532 3.25297C6.88809 3.00552 6.7037 2.79939 6.46968 2.66534C6.23567 2.5313 5.96458 2.47653 5.69688 2.50922C4.63826 2.64852 3.66655 3.16841 2.96324 3.97179C2.25992 4.77517 1.87309 5.8071 1.87501 6.87484C1.87501 13.078 6.92188 18.1248 13.125 18.1248C14.1927 18.1268 15.2247 17.7399 16.0281 17.0366C16.8314 16.3333 17.3513 15.3616 17.4906 14.303C17.5234 14.0354 17.4687 13.7643 17.3348 13.5303C17.2009 13.2963 16.995 13.1119 16.7477 13.0045Z" fill="#156374" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.9203 11.3467L13.7172 12.2435C13.632 12.6691 13.4018 13.052 13.0659 13.3268C12.7299 13.6017 12.309 13.7514 11.875 13.7506C10.3837 13.7489 8.95389 13.1558 7.89935 12.1012C6.84482 11.0467 6.25165 9.61691 6.25 8.12557C6.24988 7.69207 6.39997 7.27192 6.67474 6.93662C6.9495 6.60132 7.33196 6.37159 7.75703 6.28651L8.65391 8.08339L7.89062 9.21932C7.83359 9.30488 7.79854 9.40319 7.78859 9.50554C7.77864 9.60788 7.7941 9.7111 7.83359 9.80604C8.28077 10.8688 9.12626 11.7143 10.1891 12.1615C10.2843 12.2028 10.3883 12.2196 10.4917 12.2106C10.5951 12.2016 10.6946 12.167 10.7812 12.1099L11.9203 11.3467ZM18.125 10.0006C18.1253 11.4033 17.7624 12.7823 17.0717 14.0032C16.381 15.2241 15.3859 16.2454 14.1834 16.9676C12.9808 17.6899 11.6118 18.0885 10.2095 18.1246C8.80719 18.1608 7.41942 17.8333 6.18125 17.174L3.52109 18.0607C3.30085 18.1342 3.0645 18.1448 2.83854 18.0915C2.61257 18.0382 2.40593 17.923 2.24176 17.7588C2.07759 17.5946 1.96239 17.388 1.90906 17.162C1.85573 16.9361 1.86639 16.6997 1.93984 16.4795L2.82656 13.8193C2.24699 12.7297 1.92328 11.5223 1.88 10.2888C1.83672 9.05538 2.075 7.82828 2.57677 6.70068C3.07854 5.57307 3.8306 4.57459 4.77587 3.78104C5.72114 2.98748 6.83478 2.4197 8.03224 2.12079C9.22971 1.82188 10.4795 1.7997 11.6868 2.05594C12.8942 2.31218 14.0272 2.84009 15.0001 3.59961C15.9729 4.35914 16.7599 5.3303 17.3014 6.4394C17.8428 7.54849 18.1245 8.76637 18.125 10.0006ZM15 11.8756C15.0001 11.7595 14.9678 11.6456 14.9068 11.5468C14.8458 11.448 14.7585 11.3682 14.6547 11.3162L12.1547 10.0662C12.0563 10.0172 11.9467 9.99495 11.8369 10.0018C11.7272 10.0087 11.6212 10.0444 11.5297 10.1053L10.382 10.8709C9.8552 10.5813 9.42165 10.1477 9.13203 9.62089L9.89766 8.47323C9.95857 8.38169 9.99425 8.27571 10.0011 8.16597C10.008 8.05624 9.98576 7.94664 9.93672 7.84823L8.68672 5.34823C8.63491 5.2436 8.55482 5.15557 8.45554 5.09412C8.35626 5.03268 8.24176 5.00027 8.125 5.00057C7.2962 5.00057 6.50134 5.32981 5.91529 5.91587C5.32924 6.50192 5 7.29677 5 8.12557C5.00207 9.9483 5.72706 11.6958 7.01592 12.9846C8.30479 14.2735 10.0523 14.9985 11.875 15.0006C12.2854 15.0006 12.6917 14.9197 13.0709 14.7627C13.45 14.6057 13.7945 14.3755 14.0847 14.0853C14.3749 13.7951 14.6051 13.4506 14.7621 13.0715C14.9192 12.6923 15 12.286 15 11.8756Z" fill="#156374" />
  </svg>
);

const TwitterXSocialIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip_x)">
      <rect width="30" height="30" rx="8" fill="#FFE082" />
      <path d="M22.2092 -0.101562H7.83659C3.55773 -0.101562 0.046875 3.37272 0.046875 7.68815V22.7556C0.046875 27.0344 3.52116 30.5453 7.83659 30.5453H22.2457C26.5246 30.5453 30.0354 27.071 30.0354 22.7556V7.65158C29.9989 3.37272 26.5246 -0.101562 22.2092 -0.101562ZM24.8057 25.3522H19.1737C19.1372 25.3522 19.1006 25.3522 19.1006 25.3156L13.8343 17.6722H13.7977C11.6766 20.1224 9.59202 22.5362 7.54402 24.9133C7.4343 25.0596 7.28802 25.1693 7.1783 25.279C7.14173 25.3156 7.10516 25.3156 7.06859 25.3156H5.53259C5.49602 25.3156 5.45945 25.3156 5.49602 25.279L12.9932 16.575C13.0297 16.5384 13.0297 16.5019 12.9932 16.4653L5.53259 5.60358V5.56701H11.2012C11.2377 5.56701 11.2377 5.56701 11.2743 5.60358L16.248 12.8082L22.4652 5.60358C22.5017 5.56701 22.5383 5.56701 22.5749 5.56701H24.1109C24.184 5.56701 24.184 5.60358 24.1474 5.64015L17.0526 13.8687C17.016 13.9053 17.016 13.9419 17.0526 13.9784L24.8423 25.3156C24.8423 25.3156 24.8423 25.3522 24.8057 25.3522Z" fill="#156374" />
    </g>
    <defs>
      <clipPath id="clip_x">
        <rect width="30" height="30" rx="8" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const LinkedInSocialIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#156374" />
    <g clipPath="url(#clip_li)">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.6407 23.6309V13.332H8.21797V23.6309H11.6407ZM9.92972 11.9264C11.1229 11.9264 11.8662 11.1349 11.8662 10.1466C11.8437 9.13634 11.1229 8.36719 9.95209 8.36719C8.78106 8.36722 8.01562 9.13638 8.01562 10.1466C8.01562 11.1349 8.7585 11.9264 9.90719 11.9264H9.92972ZM13.5351 23.6309C13.5351 23.6309 13.58 14.2983 13.5351 13.332H16.9584V14.8256H16.9357C17.3858 14.1228 18.1968 13.0902 20.0432 13.0902C22.2959 13.0902 23.9843 14.5622 23.9843 17.7256V23.6309H20.5616V18.1213C20.5616 16.7369 20.0663 15.7922 18.8273 15.7922C17.8819 15.7922 17.3184 16.4291 17.071 17.0447C16.9805 17.2638 16.9584 17.5716 16.9584 17.8794V23.6309H13.5351Z" fill="#FFE082" />
    </g>
    <defs>
      <clipPath id="clip_li">
        <rect width="16" height="16" fill="white" transform="translate(8 8)" />
      </clipPath>
    </defs>
  </svg>
);

const PhoneSocialIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#156374" />
    <path d="M17.0169 10.8705C17.0339 10.807 17.0632 10.7476 17.1031 10.6954C17.1431 10.6433 17.193 10.5996 17.2498 10.5667C17.3067 10.5339 17.3695 10.5125 17.4346 10.504C17.4998 10.4954 17.5659 10.4997 17.6294 10.5167C18.5563 10.7586 19.402 11.2432 20.0794 11.9205C20.7567 12.5979 21.2413 13.4436 21.4831 14.3705C21.5001 14.4339 21.5045 14.5001 21.4959 14.5652C21.4873 14.6304 21.466 14.6932 21.4332 14.75C21.4003 14.8069 21.3566 14.8568 21.3044 14.8967C21.2523 14.9367 21.1928 14.966 21.1294 14.983C21.0871 14.9941 21.0437 14.9998 21 14.9999C20.8899 14.9999 20.7829 14.9636 20.6955 14.8966C20.6082 14.8296 20.5454 14.7356 20.5169 14.6292C20.3197 13.8725 19.9243 13.1819 19.3714 12.6289C18.8184 12.0759 18.128 11.6803 17.3713 11.483C17.3077 11.4661 17.2482 11.4368 17.196 11.3969C17.1438 11.3569 17.1 11.3071 17.0671 11.2502C17.0342 11.1933 17.0128 11.1305 17.0042 11.0654C16.9956 11.0002 16.9999 10.934 17.0169 10.8705ZM16.8713 13.483C17.7331 13.713 18.2869 14.2674 18.5169 15.1292C18.5454 15.2356 18.6082 15.3296 18.6955 15.3966C18.7829 15.4636 18.8899 15.4999 19 15.4999C19.0437 15.4998 19.0871 15.4941 19.1294 15.483C19.1928 15.466 19.2523 15.4367 19.3044 15.3967C19.3566 15.3568 19.4003 15.3069 19.4332 15.25C19.466 15.1932 19.4873 15.1304 19.4959 15.0652C19.5045 15.0001 19.5001 14.9339 19.4831 14.8705C19.1631 13.673 18.3269 12.8367 17.1294 12.5167C17.0012 12.4825 16.8648 12.5006 16.75 12.567C16.6352 12.6334 16.5514 12.7427 16.5172 12.8708C16.483 12.9989 16.501 13.1354 16.5674 13.2502C16.6338 13.365 16.7431 13.4488 16.8713 13.483ZM21.3981 18.4036L18.4538 17.0842L18.4456 17.0805C18.2928 17.0151 18.126 16.9889 17.9605 17.0042C17.7949 17.0194 17.6358 17.0758 17.4975 17.168C17.4812 17.1788 17.4656 17.1904 17.4506 17.203L15.9294 18.4999C14.9656 18.0317 13.9706 17.0442 13.5025 16.093L14.8013 14.5486C14.8138 14.533 14.8256 14.5174 14.8369 14.5005C14.9271 14.3626 14.9819 14.2044 14.9963 14.0402C15.0107 13.876 14.9843 13.7108 14.9194 13.5592V13.5517L13.5963 10.6024C13.5105 10.4044 13.363 10.2395 13.1757 10.1323C12.9885 10.025 12.7717 9.98122 12.5575 10.0074C11.7106 10.1188 10.9332 10.5347 10.3706 11.1774C9.80794 11.8201 9.49847 12.6457 9.50001 13.4999C9.50001 18.4624 13.5375 22.4999 18.5 22.4999C19.3542 22.5014 20.1797 22.1919 20.8224 21.6293C21.4651 21.0666 21.8811 20.2893 21.9925 19.4424C22.0187 19.2283 21.975 19.0115 21.8679 18.8243C21.7607 18.6371 21.596 18.4895 21.3981 18.4036Z" fill="#FFE082" />
  </svg>
);

const EmailSocialIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#156374" />
    <path d="M22.2775 13.5841L16.2775 9.58407C16.1953 9.52926 16.0988 9.5 16 9.5C15.9012 9.5 15.8047 9.52926 15.7225 9.58407L9.7225 13.5841C9.65401 13.6298 9.59786 13.6917 9.55904 13.7643C9.52023 13.8369 9.49995 13.918 9.5 14.0003V20.5003C9.5 20.7655 9.60536 21.0199 9.79289 21.2074C9.98043 21.395 10.2348 21.5003 10.5 21.5003H21.5C21.7652 21.5003 22.0196 21.395 22.2071 21.2074C22.3946 21.0199 22.5 20.7655 22.5 20.5003V14.0003C22.5001 13.918 22.4798 13.8369 22.441 13.7643C22.4021 13.6917 22.346 13.6298 22.2775 13.5841ZM10.5 20.5003V14.9709L14.6188 17.9085C14.7036 17.969 14.8052 18.0016 14.9094 18.0016H17.0906C17.1948 18.0016 17.2964 17.969 17.3813 17.9085L21.5 14.9709V20.5003H10.5Z" fill="#FFE082" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const callContacts = [
  "Emem - +447446131822",
  "Rita - +447414611824",
  "Miracle - +447414613215",
  "WhatsApp - +447853038434",
];

const whatsappContacts = [
  "Emem - +447446131822",
  "Rita - +447414611824",
  "Miracle - +447414613215",
  "WhatsApp - +447853038434",
];

// ─── Input Field ──────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  focused: string | null;
  onFocus: (name: string) => void;
  onBlur: () => void;
  disabled?: boolean;
}

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  disabled,
}: InputFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[#071A27] font-sora text-sm">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => onFocus(name)}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full h-12 bg-[#F8FAFC] rounded-lg px-4 font-sora text-sm text-[#0C3640] placeholder:text-[#64748B] outline-none border transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${focused === name ? "border-[#156374]" : "border-[#E2E8F0]"
        }`}
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ContactContent = () => {
  const [focused, setFocused] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post("/contact", { name, email, message });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="bg-white text-center pt-15 pb-12">
        <h1 className="text-[#092A31] font-clash-display text-[40px] font-bold tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-[#5C6777] font-sora text-base">
          Have questions or feedback? We're here to help.
        </p>
      </section>

      {/* ── Card ── */}
      <section className="bg-white px-5 lg:px-12 pb-20">
        <div className="bg-[#E8EFF1] rounded-[24px] p-5 lg:p-10 flex flex-col lg:flex-row gap-10 max-w-300 mx-auto">

          {/* ── Left Panel ── */}
          <div className="lg:w-[50%] shrink-0 w-85 flex flex-col gap-6">
            <h2 className="text-[#092A31] font-clash-display text-xl font-semibold">
              Get in touch with us
            </h2>

            {/* Calls */}
            <div className="flex flex-col gap-1.25">
              <div className="flex items-center gap-1.5 mb-1">
                <PhoneIcon />
                <span className="text-[#156374] font-sora text-sm font-medium">Calls</span>
              </div>
              {callContacts.map((item) => (
                <p key={`call-${item}`} className="text-[#0C3640] font-clash-display text-sm m-0">
                  {item}
                </p>
              ))}
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.25">
              <div className="flex items-center gap-1.5 mb-1">
                <WhatsAppIcon />
                <span className="text-[#156374] font-sora text-sm font-medium">WhatsApp</span>
              </div>
              {whatsappContacts.map((item) => (
                <p key={`wa-${item}`} className="text-[#0C3640] font-clash-display text-sm m-0">
                  {item}
                </p>
              ))}
            </div>

            {/* Email */}
            <p className="text-[#092A31] font-clash-display text-sm font-medium m-0">
              info@amdari.io
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <a href="https://x.com/amdari_io?s=21" target="_blank" rel="noreferrer">
                <TwitterXSocialIcon />
              </a>
              <a href="https://www.linkedin.com/company/amdari/" target="_blank" rel="noreferrer">
                <LinkedInSocialIcon />
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <PhoneSocialIcon />
              </a>
              <a href="mailto:info@amdari.io">
                <EmailSocialIcon />
              </a>
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="lg:w-[50%] lg:flex lg:justify-end lg:pr-12">
            <div className="lg:max-w-lg flex flex-col gap-5">
              <h3 className="text-[#0C3640] font-clash-display text-base font-semibold m-0 lg:mt-7">
                Send us a message and we'll respond within 24hour
              </h3>

              <InputField
                label="Full name"
                name="name"
                placeholder="Your full name"
                value={name}
                onChange={setName}
                focused={focused}
                onFocus={setFocused}
                onBlur={() => setFocused(null)}
                disabled={loading}
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={setEmail}
                focused={focused}
                onFocus={setFocused}
                onBlur={() => setFocused(null)}
                disabled={loading}
              />

              {/* Message Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#071A27] font-sora text-sm">Message</label>
                <textarea
                  placeholder="Leave us a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  disabled={loading}
                  className={`w-full h-38 bg-[#F8FAFC] rounded-lg px-4 py-3 font-sora text-sm text-[#0C3640] placeholder:text-[#64748B] outline-none border resize-none transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${focused === "message" ? "border-[#156374]" : "border-[#E2E8F0]"
                    }`}
                />
              </div>

              {/* Feedback messages */}
              {error && (
                <p className="text-red-500 font-sora text-sm">{error}</p>
              )}
              {success && (
                <p className="text-[#156374] font-sora text-sm">
                  Message sent successfully! We'll get back to you within 24 hours.
                </p>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[#156374] border border-[#448290] rounded-2xl text-[#FFE082] font-sora text-base font-normal hover:bg-[#0e4f5e] transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send your message"}
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactContent;