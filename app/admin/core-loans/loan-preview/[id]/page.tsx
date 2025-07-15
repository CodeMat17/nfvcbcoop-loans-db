"use client";

import { LoanApplicationPDF } from "@/components/coreLoans/LoanApplicationPDF";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { notFound, useParams } from "next/navigation";

export default function LoanPreviewPage() {
  const params = useParams();
  const loanId = params?.id as Id<"coreLoans">;

  const loan = useQuery(api.coreLoans.getCoreLoanById, {
    loanId,
  });

  if (!loan) {
    return (
      <div className='max-w-4xl mx-auto p-4'>
        <Skeleton className='h-8 w-1/3 mb-6' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <Skeleton className='h-4 w-1/4 mb-2' />
              <Skeleton className='h-6 w-full' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loan === undefined) {
    return (
      <p className='animate-pulse py-32 italic text-center'>Please wait...</p>
    );
  }

  if (loan === null) {
    notFound(); // this will navigate to 404 page
    return null;
  }

  return (
    <div className='space-y-4 text-sm max-w-4xl mx-auto'>
      <h1 className='text-xl font-semibold'>Loan Application</h1>
      <div>
        <h2 className='text-lg font-semibold'>Personal Information</h2>
        <p>
          Name:{" "}
          <span className='font-medium text-lg tracking-widest'>
            {loan.name}
          </span>
        </p>
        <div className='flex gap-12'>
          <div>
            <p>IPPIS Number: {loan.ippis}</p>
            <p>Location: {loan.location}</p>
            <p>Mobile Number: {loan.mobileNumber}</p>
          </div>
          <div>
            <p>Account Number: {loan.accountNumber}</p>
            <p>Bank: {loan.bank}</p>
            <p>Existing Loan: {loan.existingLoan}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className='text-lg font-semibold'>Loan Details</h2>
        <p>Date applied: {dayjs(loan.loanDate).format("MMM DD, YYYY")}</p>
        <p>Amount Requested: ₦{loan.amountRequested.toLocaleString()}</p>
        <p>Account Number: {loan.accountNumber}</p>
        <p>Bank: {loan.bank}</p>
      </div>
      <div>
        <h2 className='text-lg font-semibold'>Guarantors</h2>
        <div className='flex gap-12'>
          <div>
            <p className='font-medium italic text-gray-400'>Guarantor 1</p>
            <p>{loan.guarantor1Name}</p>
            <p>{loan.guarantor1Phone}</p>
          </div>
          <div>
            <p className='font-medium italic text-gray-400'>Guarantor 2</p>
            <p>{loan.guarantor2Name}</p>
            <p>{loan.guarantor2Phone}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className='text-lg font-semibold'>Attestation</h2>
        <p>{loan.attestation}</p>
      </div>
      {/* <div>
        <h2 className='text-lg font-semibold'>OFFICIAL USE ONLY</h2>
        <div className='flex gap-1'>
          <p>Applicant&apos;s contribution: _______________</p>
          <p>as at __________</p>
        </div>
        <div className='mt-3'>
          <h3 className='font-medium tracking-wider text-base text-center'>
            New Loan
          </h3>
          <div className='flex gap-6'>
            <div className='w-[80%]'>
              <p className='font-medium '>Details</p>
              <p>Loan amount approved</p>
              <p>Interest charged: 8%( ) 10%( ) 22%( ) amount approved</p>
              <p>Balance</p>
              <p>Less old loan balance if any</p>
              <p>Grand Total Paid</p>
            </div>
            <div className='w-[20%]'>
              <p className='font-medium '>Amount</p>
              <p>₦</p>
              <p>₦</p>
              <p>₦</p>
              <p>₦</p>
              <p>₦</p>
            </div>
          </div>
        </div>
        <div className='mt-3'>
          <h3 className='font-medium tracking-wider text-base text-center'>
            Old Loan
          </h3>
          <div className='flex gap-6'>
            <div className='w-[80%]'>
              <p className='font-medium '>Details</p>
              <p>Last loan amount</p>
              <p>Duration/Start month</p>
              <p>Monthly deduction/Duration paid</p>
              <p>Total amount paid from loan</p>
              <p>Balance loan amount </p>
            </div>
            <div className='w-[20%]'>
              <p className='font-medium '>Amount</p>
              <p>₦</p>
              <p>___________</p>
              <p>₦</p>
              <p>₦</p>
              <p>₦</p>
            </div>
          </div>
        </div>

        <div className='mt-3'>
          <h3 className='font-medium tracking-wider text-base text-center'>
            Loan Deductions
          </h3>
          <div className='flex gap-6'>
            <div className='w-[80%]'>
              <p className='font-medium '>Details</p>
              <p>Add or Less Old balance if any</p>
              <p>New loan deduction amount</p>
              <p>Duration</p>
              <p>Monthly deduction</p>
              <p>Start date </p>
              <p>End date </p>
              <p>Remark: </p>
            </div>
            <div className='w-[20%]'>
              <p className='font-medium '>Amount</p>
              <p>₦</p>
              <p>₦</p>
              <p>_____________</p>
              <p>₦</p>
              <p>_____________</p>
              <p>_____________</p>
            </div>
          </div>
        </div>
      </div> */}
      <div className='mt-8 flex justify-center'>
        <PDFDownloadLink
          document={<LoanApplicationPDF loanData={loan} />}
          fileName={`loan-application-${loan.name}.pdf`}>
          {({ loading }) => (
            <Button disabled={loading}>
              {loading ? "Generating PDF..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
