"use client";

import ApprovedLoansContent from "@/components/ApprovedLoansContent";
import ClearedLoansContent from "@/components/ClearedLoansContent";
import ProcessingLoansContent from "@/components/ProcessingLoansContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLoansPage() {
  return (
    <div className='w-full max-w-6xl mx-auto py-4'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Loan Requests</h1>

      <Tabs defaultValue='processing' >
        <TabsList className='mb-4 px-2 py-7 gap-3 w-full'>
          <TabsTrigger asChild className='py-5' value='processing'>
            <button className='px-4'>Request</button>
          </TabsTrigger>
          <TabsTrigger asChild className='py-5 border ' value='approved'>
            <button className='px-4'>Approved</button>
          </TabsTrigger>
          <TabsTrigger asChild className='py-5' value='cleared'>
            <button className='px-4 border border-red-500'>Cleared</button>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='processing'>
          <ProcessingLoansContent />
        </TabsContent>

        <TabsContent value='approved'>
          <ApprovedLoansContent />
        </TabsContent>

        <TabsContent value='cleared'>
          <ClearedLoansContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}