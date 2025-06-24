"use client";

import { Id } from "@/convex/_generated/dataModel";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";


type LoanProps = {
  loan: {
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
};

const PreviewCoreLoan = ({ loan }: LoanProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let position = 0;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    } else {
      while (position < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, -position, pageWidth, imgHeight);
        position += pageHeight;
        if (position < imgHeight) pdf.addPage();
      }
    }

    pdf.save(`Loan_${loan.name}.pdf`);
  };

  const [previewPDF, setPreviewPDF] = useState(false);

  return (
    <>
      {previewPDF ? (
        <div className='px-2'>
          <div className='overflow-x-auto w-full'>
            <div
              ref={printRef}
              className='relative bg-white text-black mx-auto px-6 py-8 shadow-md rounded-md'
              style={{
                width: "794px", // A4 width
                minHeight: "1123px", // A4 height
              }}>
              {/* Watermark */}
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-0'>
                <p
                  style={{
                    transform: "rotate(-30deg)",
                    fontSize: "64px",
                    color: "rgba(0, 0, 0, 0.05)",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    userSelect: "none",
                  }}>
                  NFVCB Cooperative
                </p>
              </div>

              {/* Main content */}
              <div className='relative z-10 space-y-6 text-sm md:text-base'>
                {/* Personal Info */}
                <Card className='bg-transparent'>
                  <CardHeader>
                    <CardTitle>PERSONAL INFORMATION</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div>
                        <Label>Full Name</Label>
                        <p>{loan.name}</p>
                      </div>
                      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
                        <div>
                          <Label>Date Applied</Label>
                          <p>{dayjs(loan.loanDate).format("MMM DD, YYYY")}</p>
                        </div>
                        <div>
                          <Label>IPPIS Number</Label>
                          <p>{loan.ippis}</p>
                        </div>
                        <div>
                          <Label>Location</Label>
                          <p>{loan.location}</p>
                        </div>
                        <div>
                          <Label>Mobile Number</Label>
                          <p>{formatPhoneNumber(loan.mobileNumber)}</p>
                        </div>
                        <div>
                          <Label>Existing Loan</Label>
                          <p>{loan.existingLoan}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Info */}
                <Card className='bg-transparent'>
                  <CardHeader>
                    <CardTitle>FINANCIAL INFORMATION</CardTitle>
                  </CardHeader>
                  <CardContent className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    <div>
                      <Label>Amount</Label>
                      <p>{formatCurrency(loan.amountRequested)}</p>
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <p>{loan.accountNumber}</p>
                    </div>
                    <div>
                      <Label>Bank</Label>
                      <p>{loan.bank}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Guarantors */}
                <Card className='bg-transparent'>
                  <CardHeader>
                    <CardTitle>GUARANTORS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                      <div>
                        <Label>Guarantor 1</Label>
                        <p>{loan.guarantor1Name}</p>
                        <p>{formatPhoneNumber(loan.guarantor1Phone)}</p>
                      </div>
                      <div>
                        <Label>Guarantor 2</Label>
                        <p>{loan.guarantor2Name}</p>
                        <p>{formatPhoneNumber(loan.guarantor2Phone)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Attestation */}
                <Card className='bg-transparent'>
                  <CardHeader>
                    <CardTitle>ATTESTATION</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{loan.attestation}</p>
                  </CardContent>
                </Card>

                <div>
                  <h1 className='text-center text-2xl font-semibold py-4'>
                    OFFICIAL USE ONLY
                  </h1>
                </div>

                {/* Loan Processing */}
                <Card className='bg-transparent'>
                  <CardContent>
                    <div>
                      <div className='flex mb-6'>
                        <p>
                          Applicant contribution: .............................
                          as at .............................{" "}
                        </p>
                      </div>
                      <div className='flex flex-col md:flex-row gap-8'>
                        <div className='md:w-[50%]'>
                          <h2 className='text-center'>NEW LOAN ANALYSIS</h2>
                          <div className='grid grid-cols-2 gap-3 mt-3'>
                            <p>DETAILS</p>
                            <p>AMOUNT</p>
                          </div>
                          <div className='text-sm grid grid-cols-2 gap-3 mt-3 items-center'>
                            <p>Loan amount approved</p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                            <p>
                              Interest charged: 8%( ) 10%( ) 22%( ) amount
                              approved
                            </p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                            <p>Balance</p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                            <p>Less old loan balance if any</p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                            <p>Grand Total Paid</p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                          </div>
                        </div>
                        <div className='md:w-[50%]'>
                          <h2 className='text-center'>OLD LOAN ANALYSIS</h2>
                          <div className='grid grid-cols-2 gap-3 mt-3'>
                            <p>DETAILS</p>
                            <p>AMOUNT</p>
                          </div>
                          <div className='text-sm grid grid-cols-2 gap-3 mt-3 items-center'>
                            <p>Last month amount</p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                            <p>Duration / Start Month</p>
                            <p className='border rounded-lg px-3 py-1'>:</p>
                            <p>Monthly Deduction / Duration Paid</p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                            <p>Total Amount Paid From Loan</p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                            <p>Balance Loan Amount</p>
                            <p className='border rounded-lg px-3 py-1'>₦</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deduction Analysis */}
                <Card className='bg-transparent'>
                  <CardHeader>
                    <CardDescription className='text-center'>
                      Loan Deduction Analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <p>Loan Amount</p>
                      <p>Add or Less Old balance if any (Old Balance)</p>
                      <p>New loan deduction Amount</p>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <p>Duration</p>
                        <p>Monthly Deduction</p>
                      </div>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <p>Start Date</p>
                        <p>End Date</p>
                      </div>

                      <p>Remarks</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center mt-6 print:hidden'>
            <Button variant={'outline'} onClick={() => setPreviewPDF(!previewPDF)}>View Raw Data</Button>
            <Button onClick={handleDownloadPdf}>
              <Download className='w-4 h-4 mr-2' />
              Download PDF
            </Button>
            <Button variant='secondary' onClick={() => window.print()}>
              🖨️ Print
            </Button>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>PERSONAL INFORMATION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div>
                  <Label>Full Name</Label>
                  <p>{loan.name}</p>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
                  <div>
                    <Label>Date Applied</Label>
                    <p>{dayjs(loan.loanDate).format("MMM DD, YYYY")}</p>
                  </div>
                  <div>
                    <Label>IPPIS Number</Label>
                    <p>{loan.ippis}</p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p>{loan.location}</p>
                  </div>
                  <div>
                    <Label>Mobile Number</Label>
                    <p>{formatPhoneNumber(loan.mobileNumber)}</p>
                  </div>
                  <div>
                    <Label>Existing Loan</Label>
                    <p>{loan.existingLoan}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>FINANCIAL INFORMATION</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              <div>
                <Label>Amount</Label>
                <p>{formatCurrency(loan.amountRequested)}</p>
              </div>
              <div>
                <Label>Account Number</Label>
                <p>{loan.accountNumber}</p>
              </div>
              <div>
                <Label>Bank</Label>
                <p>{loan.bank}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>GUARANTORS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div>
                  <Label>Guarantor 1</Label>
                  <p>{loan.guarantor1Name}</p>
                  <p>{formatPhoneNumber(loan.guarantor1Phone)}</p>
                </div>
                <div>
                  <Label>Guarantor 2</Label>
                  <p>{loan.guarantor2Name}</p>
                  <p>{formatPhoneNumber(loan.guarantor2Phone)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attestation */}
          <Card>
            <CardHeader>
              <CardTitle>ATTESTATION</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{loan.attestation}</p>
            </CardContent>
          </Card>

          {/* <div>
            <h1 className='text-center text-2xl font-semibold py-4'>
              OFFICIAL USE ONLY
            </h1>
          </div> */}
          {/* <Card>
            <CardContent>
              <div>
                <div className='flex mb-6'>
                  <p>
                    Applicant contribution: ............................. as at
                    .............................{" "}
                  </p>
                </div>
                <div className='flex flex-col md:flex-row gap-8'>
                  <div className='md:w-[50%]'>
                    <h2 className='text-center'>NEW LOAN ANALYSIS</h2>
                    <div className='grid grid-cols-2 gap-3 mt-3'>
                      <p>DETAILS</p>
                      <p>AMOUNT</p>
                    </div>
                    <div className='text-sm grid grid-cols-2 gap-3 mt-3 items-center'>
                      <p>Loan amount approved</p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                      <p>
                        Interest charged: 8%( ) 10%( ) 22%( ) amount approved
                      </p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                      <p>Balance</p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                      <p>Less old loan balance if any</p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                      <p>Grand Total Paid</p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                    </div>
                  </div>
                  <div className='md:w-[50%]'>
                    <h2 className='text-center'>OLD LOAN ANALYSIS</h2>
                    <div className='grid grid-cols-2 gap-3 mt-3'>
                      <p>DETAILS</p>
                      <p>AMOUNT</p>
                    </div>
                    <div className='text-sm grid grid-cols-2 gap-3 mt-3 items-center'>
                      <p>Last month amount</p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                      <p>Duration / Start Month</p>
                      <p className='border rounded-lg px-3 py-1'>:</p>
                      <p>Monthly Deduction / Duration Paid</p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                      <p>Total Amount Paid From Loan</p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                      <p>Balance Loan Amount</p>
                      <p className='border rounded-lg px-3 py-1'>₦</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Deduction Analysis */}
          {/* <Card>
            <CardHeader>
              <CardDescription className='text-center'>
                Loan Deduction Analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <p>Loan Amount</p>
                <p>Add or Less Old balance if any (Old Balance)</p>
                <p>New loan deduction Amount</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <p>Duration</p>
                  <p>Monthly Deduction</p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <p>Start Date</p>
                  <p>End Date</p>
                </div>

                <p>Remarks</p>
              </div>
            </CardContent>
          </Card> */}

          <div className='flex justify-center'>
            <Button onClick={() => setPreviewPDF(!previewPDF)}>
              Preview PDF
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewCoreLoan;
