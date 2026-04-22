import React, { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ datasets, labels }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    const handleColorSchemeChange = () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)
    return () =>
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
  }, [chartRef])

  // Dữ liệu mặc định nếu không có props truyền xuống
  const defaultLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const defaultDatasets = [
    {
      label: 'Doanh thu (Triệu VND)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderColor: '#6366f1',
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#6366f1',
      borderWidth: 3,
      data: [0, 0, 0, 0, 0, 0, 0],
      fill: true,
      cubicInterpolationMode: 'monotone',
    },
  ]

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '350px', marginTop: '20px' }}
        data={{
          labels: labels || defaultLabels,
          datasets: datasets || defaultDatasets,
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: {
                usePointStyle: true,
                padding: 20,
              }
            },
            tooltip: {
              backgroundColor: '#1e293b',
              padding: 12,
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              cornerRadius: 12,
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#64748b',
                font: { size: 12, weight: '500' }
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false,
              },
              ticks: {
                color: '#64748b',
                font: { size: 12 }
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 6,
            },
          },
        }}
      />
    </>
  )
}

export default MainChart
