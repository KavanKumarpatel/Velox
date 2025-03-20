import { CategoryScale, Chart as ChartJs, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend, } from "chart.js";
import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { getLast7Days } from "../../lib/features";

const labels = getLast7Days();

ChartJs.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
);

const lineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },

    scales: {
        x: {
            grid: {
           display: false,
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false,
            },
        },
    },
};

const LineChart = ({value = []}) => {
  const data = {
     labels: labels,
    datasets: [
        {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
    },
],
  };


  return (
    <Line style={{ color: "#dfe3e8" }} data={data} options={lineChartOptions} />
  );
};


const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 120,
};

const DoughnutChart = ({value = [], labels = [] }) => {
    
  const data = {
    labels : labels,
    datasets: [
        {
        data: value,
        label: 'Total Chats vs Group Chats',
        fill: 'true',
        backgroundColor: ['rgba(75,192,192,0.2)', 'rgba(20, 169, 169, 1'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(20, 169, 169, 1'],
        offset: 20,
    },
],
  };

  return (
    <Doughnut style={{zIndex: '5'}} data={data} options={doughnutChartOptions}/>
)
};

export { LineChart, DoughnutChart };
