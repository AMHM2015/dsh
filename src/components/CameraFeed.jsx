import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const CameraFeed = () => {
  const [cameraUrl, setCameraUrl] = useState('');

  useEffect(() => {
    const cameraRef = ref(database, 'camera_feed');
    onValue(cameraRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCameraUrl(data.url);
      }
    });

    return () => {
      // Cleanup listener if needed
    };
  }, []);

  return (
    <div>
      <h2>Live Camera Feed</h2>
      {cameraUrl ? (
        <iframe
          src={cameraUrl}
          alt="Camera Feed"
          style={{ width: '100%', height: 'auto' }}
        ></iframe> 
      ) : (
        <p>Video unavailable. This video is unavailable.</p>
      )}
    </div>
  );
};

export default CameraFeed;