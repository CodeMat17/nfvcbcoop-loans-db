import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const ClearedLoansContent = () => {
  const loans = useQuery(api.loans.getLoansByStatus, {
    status: "cleared",
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
        No cleared loan found
      </div>
    );
  }

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
          <CardFooter className='flex justify-center'>
         <p className="text-lg font-medium tracking-widest">CLEARED!</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ClearedLoansContent;
