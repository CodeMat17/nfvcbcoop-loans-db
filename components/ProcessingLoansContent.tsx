import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import RejectLoan from "./RejectLoan";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const ProcessingLoansContent = () => {
  const [isLoading, setIsLoading] = useState<Id<"loans"> | null>(null);

  const loans = useQuery(api.loans.getLoansByStatus, {
    status: "processing",
  });

  const approveLoan = useMutation(api.loans.approveLoan);

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

  const handleApproveLoan = async (loanId: Id<"loans">) => {
    setIsLoading(loanId);
    try {
      await approveLoan({ loanId, adminName: "Admin User Head" });
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
      {loans.map((loan) => (
        <Card key={loan._id}>
          <CardHeader>
            <CardTitle className='text-2xl'>
              {loan.userName ?? "Unknown User"}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Amount</p>
                <p>₦{loan.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Date Applied</p>
                <p>{dayjs(loan.dateApplied).format("MMM DD, YYYY")}</p>
              </div>
            </div>
            <Separator />
          </CardContent>
          <CardFooter className='flex gap-2 justify-end'>
            <Button
              variant='secondary'
              onClick={() => handleApproveLoan(loan._id)}
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

            <RejectLoan id={loan._id} name={loan.userName ?? "Unknown User"} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProcessingLoansContent;
