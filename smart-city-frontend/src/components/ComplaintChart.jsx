import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ComplaintChart({ stats }) {

  const data = {
    labels: ["Pending", "In Progress", "Resolved"],
    datasets: [
      {
        label: "Complaints",
        data: [stats.pending, stats.inProgress, stats.resolved],
        backgroundColor: [
          "#f59e0b",
          "#6366f1",
          "#10b981"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-md">
      <Pie data={data} />
    </div>
  );
}

export default ComplaintChart;