"use client";

import  { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export const DEFAULT_PROMO_CODE = "WELCOME30";

const Coupon = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const promoFromUrl = searchParams.get("promo_code") ?? DEFAULT_PROMO_CODE;
  const [inputValue, setInputValue] = useState(promoFromUrl);

  useEffect(() => {
    setInputValue(promoFromUrl);
  }, [promoFromUrl]);

  const handleApply = () => {
    const trimmed = inputValue.trim();
    const next = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      next.set("promo_code", trimmed);
    } else {
      next.delete("promo_code");
    }
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <aside className="lg:w-80 shrink-0">
      <section>
        <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
          Coupon/promo code
        </h2>
        <div className="mt-4 rounded-xl bg-[#E8EFF1] p-5">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-[#6b7280]">Code</label>
              <input
                type="text"
                placeholder="Enter code"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                className="mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#092A31] placeholder:text-[#9ca3af] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <p className="text-sm text-[#6b7280]">Discount</p>
              <p className="mt-1 font-medium text-[#092A31]">30%</p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/15"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </section>
    </aside>
  );
};

export default Coupon;
