// src/app/(admin-pages)/event/[id]/page.tsx

import AdminConfEvents from '@/components/dashboard/events/AdminConfEventDashboard'

export default function UserPage({ params }: { params: { id: number } }) {
  const { id } = params

  return <AdminConfEvents id={id} />
}
