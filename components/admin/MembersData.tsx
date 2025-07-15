"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import AddMember from "@/components/AddMember";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import dayjs from "dayjs";
import UpdateRecords from "@/components/UpdateRecords";
import { Id } from "@/convex/_generated/dataModel";

type Member = {
  _id: Id<"users">;
  name: string;
  pin: string;
  dateJoined: string;
  totalContribution: number;
  monthlyContribution: number;
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MembersData() {
  const { user } = useUser();
  console.log("User: ", user);

  const members = useQuery(api.users.getAllUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers =
    members?.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.pin?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className='w-full max-w-4xl mx-auto py-8 px-3'>
      <div className='flex flex-col gap-6'>
        <div>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-3'>
            <div className='flex flex-col items-center sm:items-start gap-1'>
              <h1 className='text-2xl font-bold'>Members Record</h1>
              <Badge variant='secondary' className='px-3 py-1'>
                {members?.length || 0} members
              </Badge>
            </div>

            <AddMember />
          </div>
          <div className='mt-4 relative w-full '>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search members...'
              className='pl-10 py-5'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {members === undefined ? (
          <div className='flex flex-col gap-4'>
            {[...Array(6)].map((_, i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 gap-4 text-center'>
            <Search className='w-12 h-12 text-muted-foreground' />
            <h3 className='text-lg font-medium'>No members found</h3>
            <p className='text-muted-foreground'>
              {searchTerm
                ? "Try a different search term"
                : "No members in the system yet"}
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {filteredMembers.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent>
        <div className='flex justify-between gap-2'>
         
            <div className='leading-5'>
              <h3 className='font-semibold sm:text-2xl'>{member.name}</h3>
              <div className='flex flex-col text-muted-foreground'>
                <p>Joined {dayjs(member.dateJoined).format("MMM YYYY")}</p>
                <p className='text-muted-foreground'>PIN: {member.pin}</p>
              </div>
            </div>
         

          <UpdateRecords
            id={member._id}
            userName={member.name}
            joined={member.dateJoined}
            total={member.totalContribution}
            monthly={member.monthlyContribution}
          />
        </div>
        <div className='mt-4 flex gap-6 text-muted-foreground'>
          <div className='md:flex md:items-center md:gap-3'>
            <p className='text-sm mb-1'>Total Contributions</p>

            <Badge className='py-1.5 px-3' variant={"secondary"}>
              {formatCurrency(member.totalContribution)}
            </Badge>
          </div>

          <div className='md:flex md:items-center md:gap-3'>
            <p className='text-sm mb-1'>Monthly Contribution</p>
            <Badge className='py-1.5 px-3' variant={"secondary"}>
              {formatCurrency(member.monthlyContribution)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MemberCardSkeleton() {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[120px]' />
              <Skeleton className='h-3 w-[80px]' />
            </div>
          </div>
          <Skeleton className='h-4 w-full' />
          <div className='flex justify-end pt-2'>
            <Skeleton className='h-8 w-20' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
