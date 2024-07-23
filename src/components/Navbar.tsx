'use client'
// import Link from 'next/link';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "./ui/button";
// import UserAccountnav from "./UserAccountnav";
// import { buttonVariants } from './ui/button';
// import { getServerSession } from 'next-auth';
// import { useSession } from 'next-auth/react';

const Navbar = () => {
    // const { data: session } = useSession();

    // Add a type guard to assert that session exists and has a user
    // const user = session?.user;

    return (
        <div className=' bg-slate-600 py-8 border-b border-s-zinc-200 fixed w-full z-10 top-0'> <div className='container flex items-center justify-end'></div></div>
        // <div className=' bg-zinc-600 py-4 border-b border-s-zinc-200 fixed w-full  z-10 top-0'>
        //     <div className='container flex items-center justify-end'>
        //         {user ? (
        //             <DropdownMenu >
        //                 <DropdownMenuTrigger asChild>
        //                     {/* <Button> */}
        //                         <Avatar className='bg-transparent'>
        //                             <AvatarImage src={user.image || ""} alt={user.name || "User"} />
        //                             <AvatarFallback>
        //                                 {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        //                             </AvatarFallback>
        //                         </Avatar>
        //                     {/* </Button> */}
        //                 </DropdownMenuTrigger>
        //                 <DropdownMenuContent className="w-72 bg-zinc-200">
        //                     <DropdownMenuItem className='justify-center my-3 text-2xl font-semibold' > {user.name}</DropdownMenuItem>
        //                     <DropdownMenuItem  className='justify-center my-3 text-xl'> {user.email}</DropdownMenuItem>
        //                     <DropdownMenuItem className='justify-center my-5'>
        //                         <UserAccountnav   />
        //                     </DropdownMenuItem>
        //                 </DropdownMenuContent>
        //             </DropdownMenu>
        //         ) : (
        //             <Link className={buttonVariants()} href='/sign-in'>
        //                 Sign in
        //             </Link>
        //         )}
        //     </div>
        // </div>
    );
};

export default Navbar;
