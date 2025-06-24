import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import RejectCoreLoan from "./RejectCoreLoan";

type LoanProps = {
  _id: Id<"coreLoans">;
  userId: Id<"users">;
  name: string;
  amountRequested: number;
  loanDate: string;
  status?: "pending" | "done";
  guarantor1Name: string;
  guarantor1Phone: string;
  guarantor2Name: string;
  guarantor2Phone: string;
  attestation: string;
  ippis: string;
  location: string;
  mobileNumber: string;
  existingLoan: "yes" | "no";
  accountNumber: string;
  bank: string;
};

const ProcessingCoreLoans = () => {
  const [isLoading, setIsLoading] = useState<Id<"coreLoans"> | null>(null);

  const loans = useQuery(api.coreLoans.getCoreLoans, {
    status: "pending",
  });

  const approveLoan = useMutation(api.coreLoans.approveCoreLoan);

  if (loans === undefined) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-[180px] w-full rounded-lg' />
        ))}
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No pending loan request found
      </div>
    );
  }

  const handleApproveLoan = async (
    userId: Id<"users">,
    loanId: Id<"coreLoans">
  ) => {
    setIsLoading(loanId);
    try {
      await approveLoan({ userId, loanId });
      toast.success("Done!", { description: "Loan approved successfully" });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error!", { description: "Failed to approve loan" });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className='space-y-4'>
      {loans.map((loan: LoanProps) => (
        <Card key={loan._id}>
          <CardHeader>
            <CardTitle className='text-2xl'>
              {loan.name ?? "Unknown User"}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Amount</p>
                <p>₦{loan.amountRequested.toLocaleString()}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Date Applied</p>
                <p>{dayjs(loan.loanDate).format("MMM DD, YYYY")}</p>
              </div>
            </div>
            <Separator />
          </CardContent>
          <CardFooter className='flex gap-2 justify-end'>
            <Button asChild variant='outline'>
              <Link href={`/loan-preview/${loan._id}`}>Details</Link>
            </Button>
        
            <Button
              variant='secondary'
              onClick={() => handleApproveLoan(loan.userId, loan._id)}
              disabled={isLoading === loan._id}>
              {isLoading === loan._id ? (
                <div className='flex items-center justify-center gap-2'>
                  <Minus className='animate-spin' />
                  <span>Please wait...</span>
                </div>
              ) : (
                "Approve"
              )}
            </Button>

            <RejectCoreLoan
              id={loan._id}
              userId={loan.userId}
              name={loan.name ?? "Unknown User"}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProcessingCoreLoans;
