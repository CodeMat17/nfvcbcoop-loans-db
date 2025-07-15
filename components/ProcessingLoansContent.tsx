import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Minus } from "lucide-react";
import { useState, useMemo } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<Id<"loans"> | null>(null);
  const ITEMS_PER_PAGE = 12;

  const loans = useQuery(api.loans.getLoansByStatus, {
    status: "processing",
  });

  const approveLoan = useMutation(api.loans.approveLoan);

  // Pagination calculations
  const { currentLoans, totalPages } = useMemo(() => {
    if (!loans) return { currentLoans: [], totalPages: 0 };

    const totalPages = Math.ceil(loans.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentLoans = loans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return { currentLoans, totalPages };
  }, [loans, currentPage]);

  const handleApproveLoan = async (loanId: Id<"loans">) => {
    setIsLoading(loanId);
    try {
      await approveLoan({ loanId, adminName: "Admin User Head" });
      toast.success("Loan Approved", {
        description: "The loan was successfully approved",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Approval Failed", {
        description: "Could not approve the loan",
      });
    } finally {
      setIsLoading(null);
    }
  };

  // Loading state
  if (loans === undefined) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className='h-[180px] w-full rounded-lg' />
        ))}
      </div>
    );
  }

  // Empty state
  if (loans.length === 0) {
    return (
      <div className='text-center py-16 text-muted-foreground'>
        No pending loan requests
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {currentLoans.map((loan) => (
          <Card key={loan._id} className='flex flex-col h-full'>
            <CardHeader>
              <CardTitle className='text-xl truncate'>
                {loan.userName || "Unknown User"}
              </CardTitle>
            </CardHeader>
            <CardContent className='flex-1'>
              <div className='flex justify-between gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Amount</p>
                  <p className='font-medium'>₦{loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Date Applied</p>
                  <p className='font-medium'>
                    {dayjs(loan.dateApplied).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>
              <Separator className='my-4' />
            </CardContent>
            <CardFooter className='flex gap-2 justify-end pt-4'>
              <Button
                variant='secondary'
                onClick={() => handleApproveLoan(loan._id)}
                disabled={isLoading === loan._id}
                className='min-w-[100px]'>
                {isLoading === loan._id ? (
                  <div className='flex items-center justify-center gap-2'>
                    <Minus className='animate-spin size-4' />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Approve"
                )}
              </Button>
              <RejectLoan
                id={loan._id}
                name={loan.userName || "Unknown User"}
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between px-2'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='icon'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>
              <ChevronLeft className='size-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }>
              <ChevronRight className='size-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingLoansContent;
