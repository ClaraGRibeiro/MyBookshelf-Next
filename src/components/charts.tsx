'use client'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'

type ChartsProps = {
  type: 'pie' | 'bar'
  data?: { name: string; value: number }[]
  value?: number
  total?: number
  label?: string
  colors?: string[]
}

const Charts = ({ type, value, total, label, data, colors = ['#cad5e2', '#cad5e2'] }: ChartsProps) => {
  if (type === 'pie') {
    const pieData = [
      { name: 'Readings', value },
      { name: 'Remaining', value: value && total ? (total - value) : 0 },
    ]

    return (
      <div className='flex flex-col items-center text-sm'>
        <PieChart width={120} height={120}>
          <Pie
            data={pieData}
            cx='50%'
            cy='50%'
            innerRadius={50}
            outerRadius={60}
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
      <div className='w-full md:w-[75%] h-64 flex flex-col items-center justify-center text-sm'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={2}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='value' fill={colors[0]} name={label} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return null
}

export default Charts