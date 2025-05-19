import React from 'react';
import Chart from 'react-apexcharts';
import { ResponsiveContainer } from 'recharts';
import './LineChart.css';

const options = {
  chart: { 
    id: 'custom-line',
    background: '#EEEEEE'
   },
  colors: ['#FFff00'], // Change line color
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
  stroke: { width: 3, curve: 'smooth' }, // Smooth curve with thickness
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      gradientToColors: ['#FF00ff'], // Gradient effect
      stops: [0, 100],
    },
  },
  grid: { borderColor: '#ccc' }, // Grid color
  dataLabels: { 
    style: { colors: ['#00ff00'] }, 
    background: {foreColor:'#ff00ff'}
}, // Label color
responsive: [
    {
      breakpoint: 768, // When screen width is < 768px
      options: {
        chart: { height: 250 },
        legend: { position: 'bottom' },
      },
    },
    {
      breakpoint: 480, // When screen width is < 480px
      options: {
        chart: { height: 100 },
        legend: { show: false }, // Hide legend on small screens
      },
    },
  ],
};

const series = [{ name: 'Sales', data: [4000, 3000, 2000, 2780, 1890], borderColor: '#00bb9c' }];

const MyGraph = () => {
    return(

        <div className="containerOfLineChart" style={{width: '100%',maxWidth: '400px',
            minWidth: '180px'}}>
            <ResponsiveContainer width='100%' height='50%'>
                <Chart options={options} series={series} type="line" height={300} width={400} />
            </ResponsiveContainer>
        </div>
    );
};

export default MyGraph;