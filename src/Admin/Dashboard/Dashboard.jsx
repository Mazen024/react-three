
import './Dashboard.css';
import AdminCard from './AdminCard/AdminCard';
import ResponsivePieChart from './Charts/MyPieChart';
import { MonthlyChart } from './Charts/MonthlyChartComponent';
import ContinuousChart from './Charts/ContinouslyChartComponent';
export default function Dashboard() {

    return (
        <div className="containerOfPage">
            <div className="containerOfDashboard">
                <div className="containerOfCards">
                    <AdminCard/>
                    <ResponsivePieChart/>
                </div>
                <div className="containerOfCharts">
                    <MonthlyChart />
                    <ContinuousChart/>
                </div>
            </div>
        </div>
    )
}
