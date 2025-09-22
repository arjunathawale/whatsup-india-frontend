import React from "react";
import Chart from "react-apexcharts";

const BarChart = ({data, categories, title, xaxisTitle, yaxisTitle}) => {
    // Sample data for message counts (1 to 31 days)
    // const messageCounts = [
    //     40, 60, 80, 50, 100, 20, 30, 70, 90, 45, 85, 65, 55, 35, 75, 95, 25, 15, 105, 50, 80, 60, 40, 70, 30, 20, 50, 75, 85, 65, 95,
    // ];

    const options = {
        chart: {
            type: "bar",
            height: 350,
        },
        xaxis: {
            categories: categories,
            title: {
                text: xaxisTitle,
            },
        },
        yaxis: {
            title: {
                text: yaxisTitle,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                columnWidth: "60%",
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} messages`,
            },
        },
    };

    const series = [
        {
            name: "Messages",
            data: data,
        },
    ];

    return (
        <div className="w-full bg-white p-0 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mt-4">{title}</h2>
            <Chart options={options} series={series} type="bar" height={550} />
        </div>
    );
};

export default BarChart;
