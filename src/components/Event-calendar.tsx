import { useState } from 'react'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const events = [
  { id: 1, name: 'Stereo picnic', date: '2024-06-12', description: 'Festival de música de distintos artistas para...' },
  { id: 2, name: 'Rock al parque', date: '2024-06-16', description: 'Festival de rock de distintos artistas para...' },
]

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 5, 1)) // June 2024

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Proximos servicios</h2>
        <Button variant="ghost" size="icon" className="text-gray-700">
          <Info className="w-5 h-5" />
        </Button>
      </div>
      <div className="space-y-4 mb-6">
        {events.map(event => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
                <div className="text-sm text-gray-600">{event.date}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
          <div key={day} className="font-semibold text-gray-600">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const isToday = day === new Date().getDate() && 
                          currentMonth.getMonth() === new Date().getMonth() && 
                          currentMonth.getFullYear() === new Date().getFullYear()
          const hasEvent = events.some(event => new Date(event.date).getDate() === day)
          return (
            <div 
              key={day} 
              className={`h-10 flex items-center justify-center rounded-full
                ${isToday ? 'bg-blue-500 text-white' : ''}
                ${hasEvent ? 'font-bold text-blue-600' : 'text-gray-900'}
              `}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}