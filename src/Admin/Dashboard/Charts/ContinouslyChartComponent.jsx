import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import './ContinouslyChartComponent.css'
const data = [
  { month: "Jan", users: 4000 },
  { month: "Feb", users: 4500 },
  { month: "Mar", users: 4700 },
  { month: "Apr", users: 5200 },
  { month: "May", users: 6000 },
  { month: "Jun", users: 6500 },
  { month: "Jul", users: 7000 },
  { month: "Aug", users: 7200 },
  { month: "Sep", users: 7500 },
  { month: "Oct", users: 8000 },
  { month: "Nov", users: 8500 },
  { month: "Dec", users: 9000 },
];

const ContinuousChart = () => {
  return (
    <div className="containerOfContinuousChart">
      <span className="headerTitle">Increament of users</span>
      <ResponsiveContainer width="100%" height="80%" >
        <LineChart data={data} margin={{right:40, top:30}}>
          <XAxis dataKey="month" />
          <YAxis/>
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#0D7377" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContinuousChart;