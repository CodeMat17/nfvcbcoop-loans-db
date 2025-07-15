import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
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
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

const ITEMS_PER_PAGE = 12;

const ApprovedLoansContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClearing, setIsClearing] = useState<Id<"loans"> | null>(null);

  const clearLoan = useMutation(api.loans.clearLoan);
  const loans = useQuery(api.loans.getLoansByStatus, { status: "approved" });

  // Memoized filtered loans based on search term
  const filteredLoans = useMemo(() => {
    if (!loans) return [];

    const term = searchTerm.toLowerCase().trim();
    if (!term) return loans;

    return loans.filter(
      (loan) =>
        loan.userName?.toLowerCase().includes(term) ||
        loan.approvedBy?.toLowerCase().includes(term) ||
        loan.amount.toString().includes(term)
    );
  }, [loans, searchTerm]);

  // Updated to handle both number timestamps and ISO strings
  const isDueDatePassed = useCallback(
    (dueDate: number | string | undefined) => {
      if (!dueDate) return false;
      const dueDay =
        typeof dueDate === "number" ? dayjs(dueDate) : dayjs(dueDate);
      return dueDay.isBefore(dayjs(), "day");
    },
    []
  );

  // Pagination calculations based on filtered loans
  const totalItems = filteredLoans.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentLoans = filteredLoans.slice(startIndex, endIndex);

  const handleClearLoan = async (loanId: Id<"loans">) => {
    setIsClearing(loanId);
    try {
      await clearLoan({ loanId });
      toast.success("Loan Cleared", {
        description: "The loan has been marked as cleared successfully",
        position: "top-right",
      });

      // Reset to first page if we cleared the last item on current page
      if (currentLoans.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to clear loan. Please try again.",
        position: "top-right",
      });
      console.log("Error Msg: ", error);
    } finally {
      setIsClearing(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  if (loans === undefined) {
    return (
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <Skeleton className='h-10 w-full max-w-md' />
          <Skeleton className='h-10 w-32' />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className='h-4 w-3/4 mb-2' />
                        <Skeleton className='h-4 w-full' />
                      </div>
                    ))}
                  </div>
                  <div>
                    <Skeleton className='h-4 w-1/2 mb-2' />
                    <Skeleton className='h-4 w-3/4' />
                  </div>
                </div>
                <Separator />
              </CardContent>
              <CardFooter className='flex justify-end'>
                <Skeleton className='h-10 w-32 rounded-md' />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
          All approved loans will appear here
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Search and Results Header */}
      <div className='flex flex-col justify-center items-center gap-2'>
        <div className='relative w-full max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search by name, amount, or approver...'
            className='pl-10'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            {totalItems} loan{totalItems !== 1 ? "s" : ""} found
          </span>
          {searchTerm && (
            <Button variant='ghost' size='sm' onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredLoans.length === 0 ? (
        <div className='text-center py-12'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
            <Search className='h-6 w-6 text-muted-foreground' />
          </div>
          <h3 className='text-lg font-medium'>No matching loans</h3>
          <p className='text-muted-foreground mt-1'>
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
            {currentLoans.map((loan) => {
              const isDue = isDueDatePassed(loan.dueDate);

              return (
                <Card
                  key={loan._id}
                  className={cn(
                    "hover:shadow-md transition-shadow flex flex-col h-full",
                    isDue && "border-red-200 bg-red-50"
                  )}>
                  <CardHeader>
                    <CardTitle
                      className={cn(
                        "text-xl truncate leading-5",
                        isDue ? "text-red-600" : ""
                      )}>
                      {loan.userName || "Unknown User"} <br />
                      {isDue && (
                        <span className='ml-2 text-xs font-normal text-red-500'>
                          (Due Date Passed)
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4 flex-1'>
                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Amount
                          </p>
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
                          <p
                            className={cn(
                              "text-sm",
                              isDue
                                ? "text-red-500 font-medium"
                                : "text-muted-foreground"
                            )}>
                            Due Date
                          </p>
                          <p
                            className={cn(
                              "font-medium",
                              isDue ? "text-red-600" : ""
                            )}>
                            {loan.dueDate
                              ? dayjs(loan.dueDate).format("MMM DD, YYYY")
                              : "N/A"}
                            {isDue && (
                              <span className='ml-1 text-red-500'>⚠️</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          Approved By
                        </p>
                        <p className='font-medium truncate'>
                          {loan.approvedBy || "N/A"}
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </CardContent>
                  <CardFooter className='flex justify-end pt-4'>
                    <Button
                      variant='secondary'
                      disabled={isClearing === loan._id}
                      onClick={() => handleClearLoan(loan._id)}
                      className='min-w-[150px]'>
                      {isClearing === loan._id ? (
                        <span className='flex items-center gap-2'>
                          <span className='animate-spin'>↻</span>
                          Processing...
                        </span>
                      ) : (
                        "Mark as Cleared"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='text-sm text-muted-foreground'>
                Showing {Math.min(startIndex + 1, totalItems)} - {endIndex} of{" "}
                {totalItems} loans
              </div>

              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='icon'
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}>
                  <ChevronLeft className='h-4 w-4' />
                </Button>

                <div className='flex items-center justify-center w-32'>
                  <span className='text-sm font-medium'>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <Button
                  variant='outline'
                  size='icon'
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>

              <div className='flex space-x-1'>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show first, last, and surrounding pages
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size='icon'
                      className='hidden sm:inline-flex'
                      onClick={() => handlePageChange(pageNum)}>
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApprovedLoansContent;
