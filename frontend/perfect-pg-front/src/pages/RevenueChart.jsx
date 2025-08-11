import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axiosInstance from '../helper/axiosInstance';

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      const { data } = await axiosInstance.get('/owner/revenuedata');
    //    console.log(Object.values(data));
      const labels = Object.keys(data);
      const revenue = Object.values(data).map(item => item.totalAmount);
      const userCount = Object.values(data).map(item => item.userCount);
      console.log(userCount);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Revenue',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: revenue
          },
          {
            label: 'User Count',
            backgroundColor: 'rgba(153,102,255,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: userCount
          }
        ]
      });
    };

    fetchRevenueData();
  }, []);
  if (!chartData) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Bar
        data={chartData}
        options={{
          title: {
            display: true,
            text: 'Monthly Revenue and User Count',
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'right'
          }
        }}
      />
    </div>
  );
};

export default RevenueChart;
