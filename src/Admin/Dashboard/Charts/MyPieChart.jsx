import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import './MyPieChart.css'
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      data: [30, 50, 20],
      backgroundColor: ["#FF5733", "#3498DB", "#FFC300"], // Colors for slices
      hoverBackgroundColor: ["#FF3210", "#2182C3", "#FFA000"], // Hover effect
      borderWidth: 2,
      borderColor: "#fff",
    },
  ],
};

const options = {
  responsive: true, // Ensures it resizes
  maintainAspectRatio: false, // Allows flexible height
  plugins: {
    legend: {
      position: "right", // Moves legend to column format
      labels: { color: "00ffff", font: { size: 14 } },
      // color
    },
    datalabels: {
      formatter: (value, context) => {
        // Calculate percentage
        let total = context.dataset.data.reduce((acc, val) => acc + val, 0);
        let percentage = ((value / total) * 100).toFixed(1) + "%";
        return percentage;
      },
      color: "#00ff00",
      font: { weight: "bold", size: 14 },
    }
  },
};

const ResponsivePieChart = () => {
  return (
    <div className="containerOfPieChart">
      <p>Etc data</p>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ResponsivePieChart;