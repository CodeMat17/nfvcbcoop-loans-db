"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Inbox,
  Menu,
  NotebookPen,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationItems = [

  {
    title: "Members Data",
    path: "/admin",
    icon: NotebookPen,
  },
  {
    title: "Quick Loans",
    path: "/admin/quick-loans",
    icon: Inbox,
  },
  {
    title: "Core Loans",
    path: "/admin/core-loans",
    icon: Wallet,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => setIsMobileOpen(false), [pathname]);

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const role =
  //   typeof user?.publicMetadata?.role === "string"
  //     ? user.publicMetadata.role
  //     : "Admin";

  return (
    <div className='flex min-h-screen bg-slate-50'>
      {/* Mobile Header */}
      <header
        className={cn(
          "sm:hidden fixed top-0 left-0 right-0 z-40 bg-white transition-all duration-300",
          isScrolled ? "shadow-sm py-2" : "py-3"
        )}>
        <div className='container mx-auto px-4 flex items-center justify-between h-full'>
          <div className='flex items-center gap-3'>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className='rounded-lg p-1 text-slate-600 hover:bg-slate-100 transition-colors'
                  aria-label='Open menu'>
                  {isMobileOpen ? (
                    <X className='h-6 w-6' />
                  ) : (
                    <Menu className='h-6 w-6' />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='w-[280px] p-0 max-h-screen overflow-y-auto'>
                <div className='flex flex-col h-full'>
                  {/* Mobile Navigation Header */}
                  <div className='flex h-16 items-center gap-3 border-b border-slate-100 px-4'>
                    <span className='font-semibold text-slate-800 text-lg'>
                      NFVCB COOP
                    </span>
                  </div>

                  {/* Mobile Navigation Items */}
                  <nav className='flex-1 space-y-1 p-4 mt-12'>
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                            isActive
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          )}
                          onClick={() => setIsMobileOpen(false)}>
                          <item.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive ? "text-white" : "text-slate-400"
                            )}
                          />
                          <span className='truncate'>{item.title}</span>
                        </Link>
                      );
                    })}
                  
                  </nav>
                </div>
              
              </SheetContent>
            </Sheet>

            <span className='font-semibold text-slate-800 text-lg'>
              Dashboard
            </span>
          </div>

          {/* Mobile Header UserButton */}
          <div className='flex items-center'>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  userButtonPopoverCard: "shadow-xl rounded-lg mt-2",
                  userButtonTrigger: "shadow-none",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className='hidden sm:flex flex-col bg-white shadow-lg fixed h-full z-30 transition-all duration-300 w-16 md:w-64'>
        {/* Logo Area */}
        <div className='flex h-16 items-center gap-3 border-b border-slate-100 px-4 overflow-hidden'>
          <span
            className={cn(
              "font-semibold text-slate-800 text-lg whitespace-nowrap transition-opacity",
              "md:opacity-100 opacity-0 duration-300"
            )}>
            NFVCB COOP
          </span>
        </div>

        {/* Navigation Items */}
        <nav className='flex-1 space-y-1 p-2 md:p-4'>
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "group flex items-center gap-3 rounded-lg p-3 md:px-3 md:py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}>
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-white" : "text-slate-400"
                  )}
                />
                <span
                  className={cn(
                    "truncate transition-opacity duration-300",
                    "md:opacity-100 opacity-0"
                  )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Header */}
      <header
        className={cn(
          "hidden sm:flex items-center justify-between fixed top-0 left-16 right-0 h-16 bg-white shadow-sm z-20 px-6 transition-all duration-300 md:left-64",
          isScrolled ? "py-2" : "py-3"
        )}>
        <div className='text-lg font-medium text-slate-800 capitalize'>
          {navigationItems.find((item) => item.path === pathname)?.title ||
            "Dashboard"}
        </div>

        <div className='flex items-center gap-4'>
          <div className='text-sm text-slate-500 hidden md:block'>
            {user?.primaryEmailAddress?.emailAddress}
          </div>
          <div className='flex items-center gap-2'>
            <div className='text-sm font-medium text-slate-700 hidden lg:block'>
              {user?.fullName || user?.username || "Admin"}
            </div>
            <div className='relative'>
              <UserButton
                afterSignOutUrl='/'
                appearance={{
                  elements: {
                    userButtonPopoverCard: "shadow-xl rounded-lg mt-2",
                    userButtonTrigger: "shadow-none",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 pt-16 sm:pt-16 sm:pl-16 md:pl-64 min-h-screen transition-all'>
        <div className='p-4 sm:p-6'>
          <div className='rounded-xl bg-white p-4 shadow-sm sm:p-6'>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
