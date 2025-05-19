import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";
import './MonthlyChartComponent.css';
const data = [
  { month: "Denvers", sales: 4000 },
  { month: "Shop1", sales: 3000 },
  { month: "Shop2", sales: 5000 },
  { month: "Shop3", sales: 7000 },
  { month: "Shop4", sales: 6000 },
];

export const MonthlyChart = () => {
  const [totalProfits, setTotalProfits] = useState(0);
  useEffect(()=>{
    setTotalProfits(data.reduce((sum, item) => sum + item.sales, 0));
  }
  ,[])
  return (
    <div className="containerOfMonthlyChartComponent">
      <div className="containerOfHeader">
        <div className='containerOfIconAndProfits'>
          <span className="titleOfObjective">Total Profit</span>
          <FontAwesomeIcon icon={faChartBar} size="2x" color="#0D7377" className="iconOfChart" />
        </div>
        <span className="totalProfits">${totalProfits}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{right:40, bottom:10}}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#0D7377" barSize={50} radius={4}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};