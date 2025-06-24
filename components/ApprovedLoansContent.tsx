import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "sonner";
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

const ApprovedLoansContent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const clearLoan = useMutation(api.loans.clearLoan);

  const loans = useQuery(api.loans.getLoansByStatus, {
    status: "approved",
  });

  if (loans === undefined) {
    <div className='space-y-4'>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className='h-[180px] w-full rounded-lg' />
      ))}
    </div>;
  }

  if (loans?.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No approved loan found
      </div>
    );
  }

  const handleClearLoan = async (loanId: Id<"loans">) => {
    setIsLoading(true);
    try {
      await clearLoan({ loanId });
      toast.success("Done!", { description: "Loan cleared successfully" });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error!", { description: "Failed to clear loan" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      {loans?.map((loan) => (
        <Card key={loan._id}>
          <CardHeader>
            <CardTitle className='text-2xl'>
              {loan.userName ?? "Unknown User"}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Amount</p>
                  <p>₦{loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Date Applied</p>
                  <p>{dayjs(loan.dateApplied).format("MMM DD, YYYY")}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Approved Date</p>
                  <p>
                    {loan.approvedDate
                      ? dayjs(loan.approvedDate).format("MMM DD, YYYY")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Due Date</p>
                  <p>
                    {loan.dueDate
                      ? dayjs(loan.dueDate).format("MMM DD, YYYY")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Approved By</p>
                <p>{loan.approvedBy ?? "N/A"}</p>
              </div>
            </div>
            <Separator />
          </CardContent>
          <CardFooter className='flex justify-end'>
            <Button
           
              disabled={isLoading}
              onClick={() => handleClearLoan(loan._id)}>
              {isLoading ? "Please wait..." : "Mark as Cleared"}{" "}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ApprovedLoansContent;
