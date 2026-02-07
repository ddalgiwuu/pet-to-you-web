"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@pet-to-you/ui"

// TODO: Replace with actual user/hospital data from auth session
const mockHospitalData = {
  name: "서울동물병원",
  email: "admin@hospital.com",
  initial: "서"
}

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="환자, 예약, 진료 검색..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{mockHospitalData.name}</p>
            <p className="text-xs text-gray-500">{mockHospitalData.email}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
            {mockHospitalData.initial}
          </div>
        </div>
      </div>
    </header>
  )
}
