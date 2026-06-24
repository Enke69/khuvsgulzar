import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminNav />
      <main className="flex-1 bg-gray-50 min-h-screen overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
