"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "../ui/button";

type Props = {
  id: Id<"coreLoans">;
  userId: Id<"users">;
  name: string;
}

const RejectCoreLoan = ({ id, name, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const rejectLoan = useMutation(api.coreLoans.rejectCoreLoan);

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await rejectLoan({ loanId: id, userId });
      toast.success("Done!", { description: "Loan rejected successfully" });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error!", { description: "Failed to reject loan" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='destructive'>Reject</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              loan application from{" "}
              <span className='font-medium italic'>{name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={isLoading}>
              {isLoading ? "Please wait..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RejectCoreLoan;
