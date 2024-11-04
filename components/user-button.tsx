'use client'

import useAuth from '@/hooks/auth'
import { Button } from './ui/button'

export default function UserButton() {
  const { login, logout } = useAuth()

  return <Button onClick={() => login()}>Login</Button>
}
