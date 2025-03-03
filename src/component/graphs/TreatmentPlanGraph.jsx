import React from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TreatmentPlanGraph = ({ data }) => {
  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Sort the data by date (ascending)
  const sortedData = [...data].sort(
    (a, b) => new Date(a.tp_vdate) - new Date(b.tp_vdate)
  );
  console.log(sortedData, "sortedData");

  const createGradient = (ctx, chartArea) => {
    if (!chartArea) return;
    const { top, bottom } = chartArea;

    // Create a linear gradient
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);

    // Add color stops for the gradient
    gradient.addColorStop(0, "red"); // Top color
    gradient.addColorStop(0.5, "yellow"); // Middle color
    gradient.addColorStop(1, "green"); // Bottom color

    return gradient;
  };
  const chartData = {
    labels: sortedData.map((item) => formattedDate(item.tp_vdate)),
    datasets: [
      {
        label: "Vas Scale",
        data: sortedData.map((item) => item.tp_iscale),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return createGradient(ctx, chartArea);
        },
        borderColor: "black",
        borderWidth: 1,
        barThickness: 45, // Adjust the thickness to make the bars thinner
        barPercentage: 4, // Reduce width relative to category width to minimize gaps
        categoryPercentage: 56, // Further reduce space around the bars
      },
    ],
  };
  const graphData = {
    labels: sortedData.map((item) => formattedDate(item.tp_vdate)),
    datasets: [
      {
        label: "Vas Scale",
        data: sortedData.map((item) => item.tp_iscale),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false, // Allows custom height and width
  //   plugins: {
  //     legend: {
  //       position: "top",
  //       labels: {
  //         font: {
  //           size: 14,
  //         },
  //       },
  //     },
  //     title: {
  //       display: true,
  //       text: "Vas Scale Over Time",
  //       font: {
  //         size: 18,
  //       },
  //     },
  //   },
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: "Date",
  //         font: {
  //           size: 14,
  //         },
  //       },
  //       ticks: {
  //         font: {
  //           size: 12,
  //         },
  //       },
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: "Vas Scale",
  //         font: {
  //           size: 14,
  //         },
  //       },
  //       ticks: {
  //         font: {
  //           size: 12,
  //         },
  //       },
  //       min: 0,
  //       max: 10,
  //     },
  //   },
  // };
  const options = {
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Pain Scale: ${tooltipItem.raw}`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "Pain Scale",
        },
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4 flex justify-center items-center">
      <div style={{ width: "100%", height: "300px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TreatmentPlanGraph;
