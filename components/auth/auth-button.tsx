"use client"

import { useUser } from "@stackframe/stack"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"

interface AuthButtonProps {
  isDark?: boolean
}

export function AuthButton({ isDark = false }: AuthButtonProps) {
  const user = useUser()

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/signin">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-xl ${
              isDark
                ? "text-gray-300 hover:text-white hover:bg-slate-800"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm" className="bg-black hover:bg-gray-800 text-white rounded-xl shadow-lg">
            Sign up free
          </Button>
        </Link>
      </div>
    )
  }

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.primaryEmail?.slice(0, 2).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImageUrl || ""} alt={user.displayName || "User"} />
            <AvatarFallback className="bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-56 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"} backdrop-blur-xl`}
        align="end"
        forceMount
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{user.displayName || "User"}</p>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{user.primaryEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator className={isDark ? "bg-slate-700" : "bg-gray-200"} />
        <Link href="/studio">
          <DropdownMenuItem className={`cursor-pointer ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Creative Studio</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile">
          <DropdownMenuItem className={`cursor-pointer ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem className={`cursor-pointer ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className={isDark ? "bg-slate-700" : "bg-gray-200"} />
        <DropdownMenuItem
          className={`cursor-pointer ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
          onClick={() => user.signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
