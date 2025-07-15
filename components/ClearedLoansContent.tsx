import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

const ClearedLoansContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const loansData = useQuery(api.loans.getLoansByStatus, {
    status: "cleared",
  });

  // Pagination calculations
  const { currentLoans, totalPages } = useMemo(() => {
    if (!loansData) return { currentLoans: [], totalPages: 0 };

    const totalPages = Math.ceil(loansData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentLoans = loansData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    return { currentLoans, totalPages };
  }, [loansData, currentPage]);

  // Loading state
  if (loansData === undefined) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className='h-[220px] w-full rounded-lg' />
        ))}
      </div>
    );
  }

  // Empty state
  if (loansData.length === 0) {
    return (
      <div className='text-center py-16 text-muted-foreground'>
        No cleared loans found
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
                {loan.userName ?? "Unknown User"}
              </CardTitle>
            </CardHeader>
            <CardContent className='flex-1 space-y-4'>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Amount</p>
                    <p className='font-medium'>
                      ₦{loan.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Date Applied
                    </p>
                    <p className='font-medium'>
                      {dayjs(loan.dateApplied).format("MMM DD, YYYY")}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Approved Date
                    </p>
                    <p className='font-medium'>
                      {loan.approvedDate
                        ? dayjs(loan.approvedDate).format("MMM DD, YYYY")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Due Date</p>
                    <p className='font-medium'>
                      {loan.dueDate
                        ? dayjs(loan.dueDate).format("MMM DD, YYYY")
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Approved By</p>
                  <p className='font-medium'>{loan.approvedBy ?? "N/A"}</p>
                </div>
              </div>
              <Separator className='my-2' />
            </CardContent>
            <CardFooter className='flex justify-center pt-4'>
              <p className='text-lg font-medium tracking-widest text-green-600'>
                CLEARED!
              </p>
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

export default ClearedLoansContent;
