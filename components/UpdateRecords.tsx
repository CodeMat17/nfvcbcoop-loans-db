"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Edit } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import dayjs from "dayjs";

type Props = {
  id: Id<"users">;
  userName: string;
  joined: string;
  total: number;
  monthly: number;
};

const UpdateRecords = ({ id, userName, joined, total, monthly }: Props) => {
  const [name, setName] = useState(userName);
  const [dateJoined, setDateJoined] = useState(joined);
  const [totalContribution, setTotalContribution] = useState(total);
  const [monthlyContribution, setMonthlyContribution] = useState(monthly);

  const [isLoading, setIsLoading] = useState(false);

  // Format number with commas and Naira symbol

  // Handle currency input changes
  const handleCurrencyChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void
  ) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = rawValue === "" ? 0 : parseInt(rawValue, 10);
    setter(numericValue);
  };

  const updateUser = useMutation(api.users.updateUser);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateUser({
        userId: id,
        name,
        dateJoined,
        totalContribution,
        monthlyContribution,
      });
      toast.success("Done!", { description: "User updated successfully" });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error!", { description: "Failed to update user" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='outline' size='icon'>
            <Edit className='w-4 h-4' />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{name}</AlertDialogTitle>
            {/* <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              loan application from{" "}
              <span className='font-medium italic'>{name}</span>.
            </AlertDialogDescription> */}
          </AlertDialogHeader>
          <div className='space-y-3'>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Date Joined
              </label>
              <Input
                value={dayjs(dateJoined).format("MMM, YYYY")}
                onChange={(e) => setDateJoined(e.target.value)}
              />
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Total Contributions
              </label>
              <Input
                value={
                  totalContribution === 0
                    ? ""
                    : totalContribution.toLocaleString()
                }
                onChange={(e) => handleCurrencyChange(e, setTotalContribution)}
              />
            </div>

            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Monthly Contributions
              </label>
              <Input
                value={
                  monthlyContribution === 0
                    ? ""
                    : monthlyContribution.toLocaleString()
                }
                onChange={(e) =>
                  handleCurrencyChange(e, setMonthlyContribution)
                }
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Please wait..." : "Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpdateRecords;
