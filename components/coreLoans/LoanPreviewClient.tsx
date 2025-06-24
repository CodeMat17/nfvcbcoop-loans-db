// components/LoanPreviewClient.tsx
"use client";

import PreviewCoreLoan from "@/components/coreLoans/PreviewCoreLoan";
import { Id } from "@/convex/_generated/dataModel";

type LoanProps = {
    _id: Id<"coreLoans">;
    name: string;
    ippis: string;
    mobileNumber: string;
    location: string;
    amountRequested: number;
    bank: string;
    accountNumber: string;
    existingLoan: "yes" | "no";
    guarantor1Name: string;
    guarantor1Phone: string;
    guarantor2Name: string;
    guarantor2Phone: string;
    attestation: string;
    loanDate: string;
    status?: "pending" | "done";
};


export function LoanPreviewClient({ loan }: { loan: LoanProps }) {
  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8'>
      <PreviewCoreLoan loan={loan} />
    </div>
  );
}
