// "use client";
// import { useSession } from "next-auth/react";
// import React from "react";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuPortal,
//     DropdownMenuSeparator,
//     DropdownMenuShortcut,
//     DropdownMenuSub,
//     DropdownMenuSubContent,
//     DropdownMenuSubTrigger,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "./ui/button";
// import UserAccountnav from "./UserAccountnav";
// const User = () => {
//     const { data: session } = useSession();

//     if (!session) {
//         return  null;
//     }

//     const { user } = session;

//     return (
//         <div className="flex items-center space-x-4 p-4 shadow rounded-lg">


//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button>
//                         {" "}
//                         <Avatar>
//                             <AvatarImage src={user.image || ""} alt={user.name || "User"} />
//                             <AvatarFallback>
//                                 {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                             </AvatarFallback>
//                         </Avatar>
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-56 bg-slate-950">
                    
//                      <DropdownMenuItem>{user.name} </DropdownMenuItem>
//                     <DropdownMenuItem>{user.email} </DropdownMenuItem>
                   
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>
//                      <UserAccountnav/>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//             {/* <img
//                 src={user.image}
//                 alt={user.name}
//                 className="w-10 h-10 rounded-full"
//             /> */}
//             {/* <div>
//                 <div className="font-bold text-gray-900">{user.name}</div>
//                 <div className="text-gray-600">{user.email}</div>
//             </div> */}
//         </div>
//     );
// };
// export default User;