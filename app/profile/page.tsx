import { getWixServerClient } from '@/lib/wix-client.server'
import { getLoggedInMember } from '@/wix-api/members'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MemberInfoForm from './member-info-form'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your user profile page',
}

export default async function ProfilePage() {
  const member = await getLoggedInMember(getWixServerClient())

  if (!member) notFound()

  return (
    <main className='mx-auto max-w-7xl space-y-10 px-5 py-10'>
      <h1 className='text-center text-3xl font-bold md:text-4xl'>
        Your Profile
      </h1>
      <MemberInfoForm member={member} />
    </main>
  )
}
