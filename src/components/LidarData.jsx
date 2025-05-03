import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LidarData = () => {
  const [lidarData, setLidarData] = useState({ ultrasonic: 0, lidar: 0 });

  useEffect(() => {
    const lidarRef = ref(database, 'lidar_data');
    onValue(lidarRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Lidar Data:', data);
      if (data) {
        setLidarData(data);
      }
    });

    return () => {
      // Cleanup listener if needed
    };
  }, []);

  const chartData = {
    labels: ['Ultrasonic (cm)', 'LiDAR (cm)'],
    datasets: [
      {
        label: 'Sensor Data',
        data: [lidarData.ultrasonic, lidarData.lidar],
        backgroundColor: ['#007bff', '#28a745'],
      },
    ],
  };

  return (
    <div>
      <h2>Sensor Data</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default LidarData;