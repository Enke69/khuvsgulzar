'use client'

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2', '#4F46E5', '#BE185D']

interface Props {
  adsByDay: { date: string; зар: number }[]
  catDist: { name: string; value: number }[]
}

export default function AdminCharts({ adsByDay, catDist }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-5">Зар нийтлэлт (30 хоног)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={adsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={6} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="зар" stroke="#2563EB" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-5">Ангиллын тархалт</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={catDist} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {catDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
