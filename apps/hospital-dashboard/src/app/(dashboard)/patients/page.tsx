"use client"

import { Card, CardHeader, CardTitle, CardContent, DataTable, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input } from "@pet-to-you/ui"
import { Search, Filter, UserPlus } from "lucide-react"
import { mockPatients } from "@/lib/mock-data"

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">환자 관리</h1>
          <p className="text-gray-500 mt-1">등록된 환자 정보를 관리하세요</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          새 환자 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>전체 환자 ({mockPatients.length}명)</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="이름, 연락처 검색..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>보호자명</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>반려동물</TableHead>
                <TableHead>마지막 방문</TableHead>
                <TableHead>총 방문 횟수</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id} animate>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {patient.pets.map((pet) => (
                        <div key={pet.id}>
                          <p className="font-medium">{pet.name}</p>
                          <p className="text-xs text-gray-500">
                            {pet.type} · {pet.breed} · {pet.age}세
                          </p>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.totalVisits}회</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      상세보기
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  )
}
