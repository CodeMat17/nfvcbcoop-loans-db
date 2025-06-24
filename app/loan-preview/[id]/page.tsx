// app/loan-preview/[id]/page.tsx

import { LoanPreviewClient } from "@/components/coreLoans/LoanPreviewClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const loanId = params.id as Id<"coreLoans">;

  const loan = await fetchQuery(api.coreLoans.getCoreLoanById, {
    loanId,
  });

  if (!loan) return notFound();
  if (loan === undefined) return <p className="animate-pulse py-20 italic">Please wait...</p>;
  if (loan === null) return notFound();

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8'>
      <ErrorBoundary>
           <LoanPreviewClient loan={loan} />
      </ErrorBoundary>
   
    </div>
  );
}
