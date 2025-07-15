import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const ITEMS_PER_PAGE = 12;

const ApprovedCoreLoans = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const loans = useQuery(api.coreLoans.getCoreLoans, {
    status: "done",
  });

  // Pagination calculations
  const { currentLoans, totalPages } = useMemo(() => {
    if (!loans) return { currentLoans: [], totalPages: 0 };

    const totalPages = Math.ceil(loans.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentLoans = loans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return { currentLoans, totalPages };
  }, [loans, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Loading state
  if (loans === undefined) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-8 w-3/4' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Skeleton className='h-4 w-1/2 mb-2' />
                      <Skeleton className='h-6 w-full' />
                    </div>
                    <div>
                      <Skeleton className='h-4 w-1/2 mb-2' />
                      <Skeleton className='h-6 w-full' />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (loans.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-muted-foreground'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium'>No approved loans</h3>
        <p className='text-muted-foreground mt-1'>
          All approved core loans will appear here
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Loans Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {currentLoans.map((loan) => (
          <Card key={loan._id} className='h-full'>
            <CardHeader>
              <CardTitle className='text-xl truncate'>
                {loan.name || "Unknown User"}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Amount Requested
                    </p>
                    <p className='font-medium'>
                      ₦{loan.amountRequested.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Date Applied
                    </p>
                    <p className='font-medium'>
                      {dayjs(loan.loanDate).format("MMM DD, YYYY")}
                    </p>
                  </div>
                  {/* <div>
                    <p className='text-sm text-muted-foreground'>Loan Type</p>
                    <p className='font-medium'>{loan.loanType || "N/A"}</p>
                  </div> */}
                  <div>
                    <p className='text-sm text-muted-foreground'>Status</p>
                    <p className='font-medium text-green-600'>Approved</p>
                  </div>
                </div>
              </div>
              <Separator className='my-2' />
              {/* <div>
                <p className='text-sm text-muted-foreground'>Purpose</p>
                <p className='font-medium line-clamp-2'>
                  {loan.loanPurpose || "Not specified"}
                </p>
              </div> */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </div>

          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='icon'
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label='Previous page'>
              <ChevronLeft className='h-4 w-4' />
            </Button>

            <div className='flex items-center justify-center w-32'>
              <span className='text-sm font-medium'>
                {currentPage} / {totalPages}
              </span>
            </div>

            <Button
              variant='outline'
              size='icon'
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label='Next page'>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>

          <div className='text-sm text-muted-foreground'>
            Showing {currentLoans.length} of {loans.length} loans
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedCoreLoans;
