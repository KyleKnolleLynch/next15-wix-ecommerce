'use client'

import { members } from '@wix/members'
import Link from 'next/link'
import {
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import {
  Check,
  LogInIcon,
  LogOutIcon,
  Monitor,
  Moon,
  Sun,
  UserIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import useAuth from '@/hooks/auth'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './ui/dropdown-menu'

interface UserButtonProps {
  loggedInMember: members.Member | null
  className?: string
}

export default function UserButton({
  loggedInMember,
  className,
}: UserButtonProps) {
  const { login, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost' className={className}>
          <UserIcon /> <span className='sr-only'>User icon</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-44 max-w-64'>
        {loggedInMember && (
          <>
            <DropdownMenuLabel>
              Logged in as{' '}
              {loggedInMember.contact?.firstName || loggedInMember.loginEmail}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href='/profile'>
              <DropdownMenuItem>
                <UserIcon className='mr-2 size-4' />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className='mr-2 size-4' />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className='mr-2 size-4' />
                System default
                {theme === 'system' && <Check className='ms-2 size-4' />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className='mr-2 size-4' />
                Light
                {theme === 'light' && <Check className='ms-2 size-4' />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className='mr-2 size-4' />
                Dark
                {theme === 'dark' && <Check className='ms-2 size-4' />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />

        {loggedInMember ? (
          <DropdownMenuItem onClick={() => logout()}>
            <LogOutIcon className='mr-2 size-4' />
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => login()}>
            <LogInIcon className='mr-2 size-4' />
            Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
