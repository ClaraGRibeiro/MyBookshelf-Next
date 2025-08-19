'use client'
import { PieChart, Pie, Cell, Tooltip } from "recharts"

type ChartProps = {
  value: number
  total: number
  label: string
  colors?: [string, string]
}

const Chart = ({ value, total, label, colors = ["#", "#"] }: ChartProps) => {
  const data = [
    { name: "done", value },
    { name: "remaining", value: total - value },
  ]

  return (
    <div className="flex flex-col items-center text-sm">
      <PieChart width={80} height={80}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={18}
          outerRadius={30}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <span>{label}</span>
      <span className="text-xs text-slate-800">
        {value}/{total} ({((value * 100) / total).toFixed(0)}%)
      </span>
    </div>
  )
}

export default Chart