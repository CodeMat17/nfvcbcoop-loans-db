"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import dayjs from "dayjs";
import { Button } from "./ui/button";

type Props = {
  loan: {
    name: string;
    amountRequested: number;
    loanDate: string;
    purpose?: string;
  };
};

const LoanPreviewPdf = ({ loan }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2, // sharpens image
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    pdf.save(`Loan_${loan.name}.pdf`);
  };

  return (
    <>
      <div
        ref={printRef}
        className='p-6 bg-white text-black w-full max-w-2xl mx-auto rounded shadow'>
        <h1 className='text-2xl font-bold mb-4'>Loan Preview</h1>
        <div className='space-y-2 text-sm'>
          <p>
            <strong>Name:</strong> {loan.name}
          </p>
          <p>
            <strong>Amount:</strong> ₦{loan.amountRequested.toLocaleString()}
          </p>
          <p>
            <strong>Date:</strong> {dayjs(loan.loanDate).format("MMM DD, YYYY")}
          </p>
          {loan.purpose && (
            <p>
              <strong>Purpose:</strong> {loan.purpose}
            </p>
          )}
        </div>
      </div>

      <div className='mt-4 text-right'>
        <Button onClick={handleDownloadPdf}>Download PDF</Button>
      </div>
    </>
  );
};

export default LoanPreviewPdf;
