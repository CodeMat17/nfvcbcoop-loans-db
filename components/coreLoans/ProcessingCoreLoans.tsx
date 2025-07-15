import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Minus, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
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
import { Input } from "../ui/input";

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

const ITEMS_PER_PAGE = 12;

const ProcessingCoreLoans = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState<Id<"coreLoans"> | null>(null);

  const loans = useQuery(api.coreLoans.getCoreLoans, {
    status: "pending",
  });

  const approveLoan = useMutation(api.coreLoans.approveCoreLoan);

  // Filter loans based on search term
  const filteredLoans = useMemo(() => {
    if (!loans) return [];

    const term = searchTerm.toLowerCase().trim();
    if (!term) return loans;

    return loans.filter(
      (loan) =>
        loan.name?.toLowerCase().includes(term) ||
        loan.ippis?.includes(term) ||
        loan.mobileNumber?.includes(term)
    );
  }, [loans, searchTerm]);

  // Pagination calculations
  const totalItems = filteredLoans.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentLoans = filteredLoans.slice(startIndex, endIndex);

  const handleApproveLoan = async (
    userId: Id<"users">,
    loanId: Id<"coreLoans">
  ) => {
    setIsLoading(loanId);
    try {
      await approveLoan({ userId, loanId });
      toast.success("Loan Approved", {
        description: "The loan has been approved successfully",
      });

      // Reset to first page if we approved the last item on current page
      if (currentLoans.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Approval Failed", {
        description: "Failed to approve loan. Please try again.",
      });
    } finally {
      setIsLoading(null);
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

  // Loading state
  if (loans === undefined) {
    return (
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <Skeleton className='h-10 w-full max-w-md' />
          <Skeleton className='h-10 w-32' />
        </div>

        <div className='space-y-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between gap-4'>
                  <div>
                    <Skeleton className='h-4 w-16 mb-2' />
                    <Skeleton className='h-5 w-24' />
                  </div>
                  <div>
                    <Skeleton className='h-4 w-16 mb-2' />
                    <Skeleton className='h-5 w-24' />
                  </div>
                </div>
                <Separator />
              </CardContent>
              <CardFooter className='flex gap-2 justify-end'>
                <Skeleton className='h-9 w-20 rounded-md' />
                <Skeleton className='h-9 w-24 rounded-md' />
                <Skeleton className='h-9 w-24 rounded-md' />
              </CardFooter>
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
        <h3 className='text-lg font-medium'>No pending loan requests</h3>
        <p className='text-muted-foreground mt-1'>
          All pending core loans will appear here
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
            placeholder='Search by name, IPPIS, or phone...'
            className='pl-10'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            {totalItems} request{totalItems !== 1 ? "s" : ""} found
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
          <h3 className='text-lg font-medium'>No matching requests</h3>
          <p className='text-muted-foreground mt-1'>
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <>
          <div className='space-y-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
            {currentLoans.map((loan: LoanProps) => (
              <Card key={loan._id}>
                <CardHeader>
                  <CardTitle className='text-xl truncate'>
                    {loan.name ?? "Unknown User"}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between gap-4'>
                    <div>
                      <p className='text-sm text-muted-foreground'>Amount</p>
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
                  </div>
                  <Separator />
                </CardContent>
                <CardFooter className='flex gap-2 justify-end flex-wrap'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/core-loans/loan-preview/${loan._id}`}>Details</Link>
                  </Button>

                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => handleApproveLoan(loan.userId, loan._id)}
                    disabled={isLoading === loan._id}
                    className='min-w-[100px]'>
                    {isLoading === loan._id ? (
                      <div className='flex items-center justify-center gap-2'>
                        <Minus className='animate-spin h-4 w-4' />
                        <span>Processing...</span>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='text-sm text-muted-foreground'>
                Showing {Math.min(startIndex + 1, totalItems)} - {endIndex} of{" "}
                {totalItems} requests
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
                    Page {currentPage} of {totalPages}
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProcessingCoreLoans;
