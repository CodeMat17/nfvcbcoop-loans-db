"use client";

import ApprovedCoreLoans from "@/components/coreLoans/ApprovedCoreLoans";
import ProcessingCoreLoans from "@/components/coreLoans/ProcessingCoreLoans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLoansPage() {
  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Core Loans</h1>

      <Tabs defaultValue='processing'>
        <TabsList className='mb-4 px-2 py-7 gap-3'>
          <TabsTrigger asChild className='py-5' value='processing'>
            <button className='px-4'>Request</button>
          </TabsTrigger>
          <TabsTrigger asChild className='py-5' value='approved'>
            <button className='px-4'>Approved</button>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='processing'>
          <ProcessingCoreLoans />
        </TabsContent>

        <TabsContent value='approved'>
          <ApprovedCoreLoans />
        </TabsContent>
      </Tabs>
    </div>
  );
}
