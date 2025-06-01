"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { ChartWidgetProps } from "./types"

export function ChartWidget({ title, data, type = "bar", className = "" }: ChartWidgetProps) {
  const colors = ["#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f"]

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )

  return (
    <Card className={`bg-white border-gray-200 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>{type === "bar" ? renderBarChart() : renderPieChart()}</CardContent>
    </Card>
  )
}
