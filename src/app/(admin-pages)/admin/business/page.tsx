import { CreateBusinessButton } from '@/components/business/create-business-button'
import AdminBusinessDashboard from '@/components/dashboard/businesses/AdminBusinessDashboard'
import SearchInput from '@/components/shared/search-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getBusinesses } from '@/lib/api/business'



export default async function AdminBusiness() {

  const businesses = await getBusinesses()

  return (
    <>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de emprendimiento</h1>
      {/* Top content of the table */}
        <div className="flex justify-between mb-4">
          <SearchInput className='w-1/3' paramName="name" placeholder="Buscar por nombre..." />

          {/* Create button */}
        <div className="flex gap-2">
          <CreateBusinessButton />
        </div>
      </div>

    </div>
    <AdminBusinessDashboard businesses={businesses} />
    </>
  )
}