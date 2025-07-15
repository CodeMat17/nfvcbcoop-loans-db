"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";

interface ExcelLoanRow {
  pin: string;
  amount: number;
  approvedBy: string;
  approvedDate: string; // ISO format
}

// Convert Excel serial date or string to ISO date string
const excelDateToISO = (value: unknown): string => {
  if (typeof value === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const converted = new Date(excelEpoch.getTime() + value * 86400000);
    return converted.toISOString();
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) return new Date(parsed).toISOString();
  }

  return new Date().toISOString(); // fallback
};

export default function ExcelUpload() {
  const [previewData, setPreviewData] = useState<ExcelLoanRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const importLoan = useMutation(api.loans.importLoanByPin);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const cleanedData: ExcelLoanRow[] = (
      jsonData as Record<string, unknown>[]
    ).map((row) => ({
      pin: String(row.pin ?? "").trim(),
      amount: Number(row.amount),
      approvedBy: String(row.approvedBy ?? "").trim(),
      approvedDate: excelDateToISO(row.approvedDate),
    }));

    setPreviewData(cleanedData);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      for (const row of previewData) {
        await importLoan({
          pin: row.pin,
          amount: row.amount,
          approvedDate: row.approvedDate,
          approvedBy: row.approvedBy,
        });
      }

      toast.success("Loans imported successfully!");
      setPreviewData([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to import loans.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6 p-6 bg-white rounded shadow dark:bg-gray-900'>
      <h2 className='text-xl font-semibold'>Import Approved Loans</h2>

      <input type='file' accept='.xlsx, .xls' onChange={handleFileUpload} />

      {previewData.length > 0 && (
        <div className='mt-4'>
          <h3 className='font-medium mb-2'>Preview</h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left border border-gray-200 dark:border-gray-700'>
              <thead className='bg-gray-100 dark:bg-gray-800'>
                <tr>
                  <th className='p-2 border'>PIN</th>
                  <th className='p-2 border'>Amount</th>
                  <th className='p-2 border'>Approved By</th>
                  <th className='p-2 border'>Approved Date</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    <td className='p-2 border'>{row.pin}</td>
                    <td className='p-2 border'>{row.amount}</td>
                    <td className='p-2 border'>{row.approvedBy}</td>
                    <td className='p-2 border'>
                      {new Date(row.approvedDate).toLocaleDateString("en-NG", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className='mt-4'>
            {isSubmitting ? "Importing..." : "Import Loans"}
          </Button>
        </div>
      )}
    </div>
  );
}
