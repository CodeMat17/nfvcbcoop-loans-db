"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LoanPreviewClient } from "@/components/coreLoans/LoanPreviewClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";



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



export default function LoanPreviewPage() {
  const params = useParams();
  const loanId = params?.id as Id<"coreLoans">;
  const [loan, setLoan] = useState<LoanProps | null | undefined>(undefined);

  useEffect(() => {
    const fetchLoan = async () => {
      if (!loanId) return;
      try {
        const data = await fetchQuery(api.coreLoans.getCoreLoanById, {
          loanId,
        });
        setLoan(data);
      } catch (error) {
        console.error("Failed to fetch loan", error);
        setLoan(null);
      }
    };

    fetchLoan();
  }, [loanId]);

  if (loan === undefined) {
    return <p className='animate-pulse py-20 italic'>Please wait...</p>;
  }

  if (loan === null) {
    notFound(); // this will navigate to 404 page
    return null;
  }

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8'>
      <ErrorBoundary>
        <LoanPreviewClient loan={loan} />
      </ErrorBoundary>
    </div>
  );
}
