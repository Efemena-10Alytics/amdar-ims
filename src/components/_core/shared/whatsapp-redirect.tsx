"use client";

import { useEffect, useState } from "react";

interface WhatsAppRedirectProps {
  url: string;
  delayInSeconds?: number;
}

export default function WhatsAppRedirect({
  url,
  delayInSeconds = 3,
}: WhatsAppRedirectProps) {
  const [countdown, setCountdown] = useState(delayInSeconds);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = url;
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, url]);

  return (
    <p className="mt-4 text-[13px] font-medium text-[#FFE082] animate-pulse">
      Redirecting to WhatsApp in {countdown} seconds...
    </p>
  );
}
