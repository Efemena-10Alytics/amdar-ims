import { Button } from "@/components/ui/button";
import React from "react";

const Coupon = () => {
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
                className="mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#092A31] placeholder:text-[#9ca3af] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <p className="text-sm text-[#6b7280]">Discount</p>
              <p className="mt-1 font-medium text-[#092A31]">30%</p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/15"
          >
            Applied
          </Button>
        </div>
      </section>
    </aside>
  );
};

export default Coupon;
