'use client'
import { Link } from "lucide-react"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"

const UserAccountnav = () => {
  
    return <div>
    <Button className="" onClick = {()=>signOut()}> Sign Out</Button>
  </div>
}
export default UserAccountnav;