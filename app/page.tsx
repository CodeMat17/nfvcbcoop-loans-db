import { Button } from "@/components/ui/button";
import { checkRole } from "@/utils/roles";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const isAdmin = await checkRole("admin");
  if (isAdmin) {
    redirect("/admin");
  }

  return (
    <div className=' w-full max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center'>
      <p className='text-xl font-medium  text-center text-muted-foreground '>
        Welcome to the
      </p>
      <h1 className='text-4xl font-bold mb-3 mt-4 text-center'>
        NFVCB Cooperative Loan Manager <br /> (Admin Dashboard)
      </h1>
      <p className='text-lg text-red-600 animate-bounce mb-8 text-center'>
        YOU MUST BE AN ADMIN TO HAVE ACCESS TO THE DASHBOARD
      </p>
      <div className='space-y-4 flex flex-col items-center justify-center mt-12'>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild>
            <Link href='/sign-in' className=''>
              Sign In
            </Link>
          </Button>

          <p className='text-sm text-slate-500'>
            Don&apos;t have an account?{" "}
            <Link href='/sign-up' className='text-slate-900 hover:underline'>
              Sign Up
            </Link>
          </p>
        </SignedOut>
      </div>
    </div>
  );
}
