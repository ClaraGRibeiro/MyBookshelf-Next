'use client'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

type ChartProps = {
  type: 'pie' | 'bar'
  data?: { name: string; value: number }[]
  value?: number
  nameValue?: string
  total?: number
  nameTotal?: string
  label?: string
  colors?: string[]
}

const Chart = ({ type, value, nameValue, total, nameTotal, label, data, colors = ['#cad5e2', '#cad5e2'] }: ChartProps) => {
  if (type === 'pie') {
    const pieData = [
      { name: nameValue, value },
      { name: nameTotal, value: value && total ? (total - value) : 0 },
    ]

    return (
      <div className='flex flex-col items-center text-sm'>
        <PieChart width={80} height={80}>
          <Pie
            data={pieData}
            cx='50%'
            cy='50%'
            innerRadius={18}
            outerRadius={30}
            startAngle={90}
            endAngle={-270}
            dataKey='value'
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <span>{label}</span>
        <span className='text-xs text-slate-800'>
          {value}/{total} ({value && total && (((value * 100) / total).toFixed(0))}%)
        </span>
      </div>
    )
  }
  
  if (type === 'bar' && data) {
    return (
      <div className='flex flex-col items-center text-sm'>
        <BarChart width={420} height={200} data={data} margin={{ top: 0, right: 40, left: 0, bottom: 0 }} barCategoryGap={2}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='value' fill={colors[0]} />
        </BarChart>
        <span>{label}</span>
      </div>
    )
  }

  return null
}

export default Chart