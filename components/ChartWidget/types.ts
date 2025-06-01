import type { ChartData } from "@/types"

export interface ChartWidgetProps {
  title: string
  data: ChartData[]
  type?: "bar" | "pie"
  className?: string
}
