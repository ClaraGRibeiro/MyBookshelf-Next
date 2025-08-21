'use client'

// components shadcn
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from './ui/chart'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import { Label, Pie, PieChart } from 'recharts'

type ChartsProps = {
  type: 'pie' | 'bar'
  dataChart?: { name: string, value: number }[]
  value?: number
  total?: number
  label: string
  colors: string[]
}

const Charts = ({ type, dataChart, value, total, label, colors }: ChartsProps) => {
  if (type === 'pie') {
    const chartData = [
      { name: 'Readings', value, fill: colors[0], label: 'Readings' },
      { name: 'Remaining', value: value && total ? total - value : 0, fill: colors[1], label: 'Remaining' },
    ]
    return (
      <ChartContainer config={{}} className='mx-auto aspect-square h-32 w-32'>
        <PieChart width={200} height={200}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey='value' nameKey='name' innerRadius={50} outerRadius={60}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className='text-3xl' fill={colors[0]}>
                        {value && total ? `${((value * 100) / total).toFixed(0)}%` : '0%'}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className='fill-slate-600'>{label}</tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 30} className='fill-slate-400'>{value}/{total}</tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    )
  }
  if (type === 'bar') {
    return (
      <ChartContainer config={{ value: {label: 'Books',} }} className='w-[90%] md:w-[75%] h-64'>
        <BarChart accessibilityLayer data={dataChart} margin={{ top: 36, }} barCategoryGap={4}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey='name' tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent  />} />
          <Bar dataKey='value' fill={colors[0]} radius={8}>
            <LabelList position='top' offset={12} className='fill-slate-800 text-lg' />
          </Bar>
        </BarChart>
      </ChartContainer >
    )
  }

}

export default Charts