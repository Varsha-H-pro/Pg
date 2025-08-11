import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

import axiosInstance from '../helper/axiosInstance';
import RevenueChart from './RevenueChart';
import { useDispatch } from 'react-redux';
import { getComlainSummery } from '../redux/slice/userSlice';

const ComplaintsChart = () => {
  const dispatch=useDispatch()
  const [summary, setSummary] = useState({});
  const [propertySummary, setPropertySummary] = useState([]);

  // Define a color palette to be used for different segments
  const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  useEffect(() => {
    const fetchComplaintsData = async () => {
      try {
        const response = await dispatch(getComlainSummery())
        setSummary(response?.payload?.data);
      } catch (error) {
        console.error('Error fetching complaints data:', error);
      }
    };

    const fetchComplaintsDataByProperty = async () => {
      try {
        const response = await axiosInstance.get('/helper/complainSummeryByProperty');
        setPropertySummary(response.data.data);
      } catch (error) {
        console.error('Error fetching complaints data by property:', error);
      }
    };

    fetchComplaintsData();
    fetchComplaintsDataByProperty();
  }, []);

  const pieData = {
    labels: ['Cleaning', 'Food', 'Maintenance', 'Noise', 'Other'],
    datasets: [
      {
        data: [
          summary.cleaning || 0,
          summary.food || 0,
          summary.maintenance || 0,
          summary.noise || 0,
          summary.other || 0,
        ],
        backgroundColor: colorPalette, // Use the color palette for the summary chart
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        display: (context) => context.dataset.data[context.dataIndex] > 0,
        color: 'white',
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += context.raw;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className='flex flex-col h-full w-full'>
      <h1 className='bg-blue-600 text-white text-center mx-16 my-1 rounded-lg shadow-lg shadow-blue-300 p-2 font-semibold'>
        See your Report here  </h1>
        <h2 className='text-xl my-1 font-semibold'>Complaints by Category</h2>
      <div className="   rouned-lg category flex  items-center w-full h-1/2 mb-10">
        <div className=' mx-2  w-1/2 flex h-full  hover:scale-110 duration-500'>
          <Pie data={pieData} options={options} />
        </div>
        <div className="w-1/2 h-full">
        <RevenueChart />
        </div>
        
      </div>
      <div className="property w-full  flex  flex-col items-center h-1/2 mb-5">
        <h2 className='text-xl font-semibold mb-2'>Complaints by Property</h2>
        <div className='flex  items-start justify-center gap-2  h-screen w-full'>
          {propertySummary.map((property, index) => (
            <div className=' flex h-1/2 w-1/2' key={property.property}>
              <h3 className='text-md font-semibold ml-1'>{property.name}</h3>
              <div className='  flex flex-wrap justify-center items-center  w-full      hover:scale-110 duration-500'>
                <Pie
                className='w-full h-full '
                  data={{
                    labels: ['Cleaning', 'Food', 'Maintenance', 'Noise', 'Other'],
                    datasets: [
                      {
                        data: [
                          property.cleaning || 0,
                          property.food || 0,
                          property.maintenance || 0,
                          property.noise || 0,
                          property.other || 0,
                        ],
                        backgroundColor: colorPalette, // Use the color palette for the property chart
                      },
                    ],
                  }}
                  options={options}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsChart;