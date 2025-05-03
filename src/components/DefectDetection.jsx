import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DefectDetection = () => {
  const [defects, setDefects] = useState([]);

  useEffect(() => {
    const defectsRef = ref(database, 'defects');
    onValue(defectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDefects(Object.values(data));
      }
    });

    return () => {
      // Cleanup listener if needed
    };
  }, []);

  return (
    <div>
      <h2>Navigation Status</h2>
      <table>
        <thead>
          <tr>
            <th>GPS Accuracy</th>
            <th>Path Progress</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.3m</td>
            <td>35%</td>
          </tr>
        </tbody>
      </table>
      <p>Motor Temp: 41°C</p>
      <p>Signal Strength: 98%</p>
      <h3>Defect Detection</h3>
      {defects.length > 0 ? (
        <ul>
          {defects.map((defect, index) => (
            <li key={index}>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#dc3545', marginRight: '10px' }} />
              {defect.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No defects detected.</p>
      )}
    </div>
  );
};

export default DefectDetection;