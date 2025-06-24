import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ApprovedCoreLoans = () => {
  const loans = useQuery(api.coreLoans.getCoreLoans, {
    status: "done",
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

  return (
    <div className='space-y-4'>
      {loans?.map((loan) => (
        <Card key={loan._id}>
          <CardHeader>
            <CardTitle className='text-2xl'>
              {loan.name ?? "Unknown User"}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Amount</p>
                  <p>₦{loan.amountRequested.toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Date Applied</p>
                  <p>{dayjs(loan.loanDate).format("MMM DD, YYYY")}</p>
                </div>
              </div>
            </div>
          </CardContent>
       
        </Card>
      ))}
    </div>
  );
};

export default ApprovedCoreLoans;
