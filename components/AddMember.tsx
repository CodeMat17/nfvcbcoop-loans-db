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
import { useMutation } from "convex/react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const AddMember = () => {
  const [name, setName] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [pin, setPin] = useState("");
  const [totalContribution, setTotalContribution] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [ippis, setIppis] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle currency input changes
  const handleCurrencyChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void
  ) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = rawValue === "" ? 0 : parseInt(rawValue, 10);
    setter(numericValue);
  };

  const createUser = useMutation(api.users.createUser);

  const handleUpdate = async () => {
    if (
      !name.trim() ||
      !dateJoined.trim() ||
      !totalContribution ||
      !monthlyContribution ||
      !pin.trim() || !ippis.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      await createUser({
        name,
        dateJoined,
        pin,
        totalContribution,
        monthlyContribution,
        ippis
      });
      toast.success("Done!", { description: "New member added successfully" });
      setName("");
      setDateJoined("");
      setPin("");
      setTotalContribution(0);
      setMonthlyContribution(0);
      setIppis("");
      setOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to add new member: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button className='w-full'>Add Member</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Member</AlertDialogTitle>
          </AlertDialogHeader>
          <div className='space-y-3'>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full">
                <label className='text-sm font-medium text-muted-foreground'>
                  Date Joined
                </label>
                <Input
                  value={dateJoined}
                  onChange={(e) => setDateJoined(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className='text-sm font-medium text-muted-foreground'>
                  IPPIS No.
                </label>
                <Input
                  value={ippis}
                  onChange={(e) => setIppis(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Passcode
              </label>
              <Input
                inputMode='numeric'
                pattern='\d*'
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
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
              {isLoading ? "Please wait..." : "Add"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddMember;
