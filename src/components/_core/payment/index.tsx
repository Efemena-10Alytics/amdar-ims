import { cn } from "@/lib/utils";
import React from "react";
import SideNav from "./side-nav";
import { Calendar, Check } from "lucide-react";
import Checkout from "./checkout";

const PAYMENT_PLANS = [
  {
    id: "full",
    label: "Full Payment",
    description: "Make one time payment now and get full access to your course",
    total: "USD 390",
    breakdown: null,
  },
  {
    id: "2-installments",
    label: "2 Installments",
    description: "Pay GBP 195 now and 2nd installment in the next month",
    total: "USD 390",
    breakdown: [
      { label: "1st payment", date: "Jan 21, 2026", amount: "USD 195" },
      { label: "2nd payment", date: "Feb 21, 2026", amount: "USD 195" },
    ],
  },
  {
    id: "3-installments",
    label: "3 installments",
    description: "Pay GBP 130 monthly for 3 months",
    total: "USD 390",
    breakdown: null,
  },
];

const COHORTS = [
  {
    id: "feb",
    label: "February Cohort",
    date: "February 7, 2026",
    months: "4 months",
  },
  {
    id: "mar",
    label: "March Cohort",
    date: "March 7, 2026",
    months: "4 months",
  },
];
const PaymentMain = () => {
  return (
    <div>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <SideNav />

        {/* Right content */}
        <Checkout />
      </div>
    </div>
  );
};

export default PaymentMain;
