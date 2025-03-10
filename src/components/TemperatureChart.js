import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TemperatureChart = ({ hourlyTemperatures, hourlyTimes }) => {
    const data = {
        labels: hourlyTimes,
        datasets: [
            {
                label: "Temperature (°C)",
                data: hourlyTemperatures,
                borderColor: "rgb(34, 229, 255)",
                backgroundColor: "rgba(76, 225, 245, 0.2)",
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Temperature Over Next 24 Hours",
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default TemperatureChart;