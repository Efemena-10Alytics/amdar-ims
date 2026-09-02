import Link from "next/link";
import type { Receipt } from "@/features/payment/types";

function formatMoney(amount: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sora text-xs text-[#94A3B8]">{label}</span>
      <span className="font-sora text-sm font-semibold text-[#092A31]">{value}</span>
    </div>
  );
}

function Pill({
  children,
  color = "#6D28D9",
  bg = "#EDE4FB",
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sora text-xs font-medium"
      style={{ color, background: bg }}
    >
      <span className="size-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}

export function ReceiptView({ receipt }: { receipt: Receipt }) {
  const { user, program, financial, invoice } = receipt;

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-clash-display text-xl text-[#092A31]">User Details</h1>
          <p className="font-sora text-sm text-[#94A3B8]">
            Complete information your payment plan
          </p>
        </div>
        <Link
          href="/dashboard/billing"
          className="font-sora text-sm font-medium text-[#156374] hover:underline"
        >
          Back to billing
        </Link>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-sora text-base font-bold text-[#092A31]">
            User Information
          </h2>
          <Pill>{user.statusBadge}</Pill>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="First Name" value={user.firstName} />
          <Field label="Last Name" value={user.lastName} />
          <Field label="Email Address" value={user.email} />
          <Field label="Phone Number" value={user.phone} />
        </div>
        <div className="mt-4">
          <Pill color="#15803D" bg="#DCFCE7">
            {user.tag}
          </Pill>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Gender" value={user.gender} />
          <Field label="Country Of Residence" value={user.countryOfResidence} />
        </div>
      </section>

      <hr className="my-6 border-[#EEF2F6]" />

      <section>
        <h2 className="mb-4 font-sora text-base font-bold text-[#092A31]">
          Program Information
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Cohort" value={program.cohort} />
          <Field label="Program" value={program.program} />
          <Field label="Previous cohort/program" value={program.previousCohortProgram} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Payment Plan" value={program.paymentPlan} />
          <Field
            label="Status"
            value={
              <Pill color="#2563EB" bg="#DBEAFE">
                {program.status}
              </Pill>
            }
          />
          <Field label="Program Activated" value={program.programActivated} />
          <Field label="Created At" value={program.createdAt} />
        </div>
      </section>

      <hr className="my-6 border-[#EEF2F6]" />

      <section>
        <h2 className="mb-4 font-sora text-base font-bold text-[#092A31]">
          Financial Summary
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field
            label="Total Amount"
            value={
              <span className="text-[#16A34A]">
                {formatMoney(financial.totalAmount, financial.currency)}
              </span>
            }
          />
          <Field
            label="Total Paid"
            value={formatMoney(financial.totalPaid, financial.currency)}
          />
          <Field
            label="Outstanding"
            value={
              <span className="text-[#DC2626]">
                {formatMoney(financial.outstanding, financial.currency)}
              </span>
            }
          />
          <Field label="Currency" value={financial.currency} />
        </div>

        <div className="mt-5">
          <span className="mb-1.5 block font-sora text-xs text-[#94A3B8]">
            Total Amount
          </span>
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-[#E5E7EB]">
              <div
                className="h-2 rounded-full bg-[#16A34A]"
                style={{ width: `${Math.min(financial.percentPaid, 100)}%` }}
              />
            </div>
            <span className="font-sora text-sm font-semibold text-[#092A31]">
              {financial.percentPaid.toFixed(1)}%
            </span>
          </div>
        </div>
      </section>

      <hr className="my-6 border-[#EEF2F6]" />

      <section>
        <h2 className="mb-4 font-sora text-base font-bold text-[#092A31]">Invoices</h2>
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#F1F5F9] p-4 sm:grid-cols-5">
          <Field label={invoice.installmentLabel} value={formatMoney(invoice.amount, financial.currency)} />
          <Field label="Due Date" value={invoice.dueDate} />
          <Field label="Stripe Payment Intent ID" value={invoice.stripePaymentIntentId} />
          <Field
            label="Status"
            value={
              <Pill color="#15803D" bg="#DCFCE7">
                {invoice.status}
              </Pill>
            }
          />
          <Field label="Paid At" value={invoice.paidAt ?? "—"} />
        </div>
      </section>
    </div>
  );
}
