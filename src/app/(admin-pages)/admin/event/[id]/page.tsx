// src/app/(admin-pages)/event/[id]/page.tsx

import AdminSpecificEventDashboard from '@/components/dashboard/events/AdminSpecificEventDashboard'

export default function UserPage({ params }: { params: { id: number } }) {
  const { id } = params

  return (
    <AdminSpecificEventDashboard id={id} />
  )
}