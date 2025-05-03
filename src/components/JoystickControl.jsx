import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, set } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const JoystickControl = () => {
  const [direction, setDirection] = useState('');
  const [speed, setSpeed] = useState(0);

  const handleDirection = (dir) => {
    setDirection(dir);
    const joystickRef = ref(database, 'joystick');
    set(joystickRef, { direction: dir, speed });
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value, 10);
    setSpeed(newSpeed);
    const joystickRef = ref(database, 'joystick');
    set(joystickRef, { direction, speed: newSpeed });
  };

  return (
    <div>
      <h2>Vehicle Controls</h2>
      <div className="arrow-buttons">
        <button className="up" onClick={() => handleDirection('up')}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button className="left" onClick={() => handleDirection('left')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button className="right" onClick={() => handleDirection('right')}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button className="down" onClick={() => handleDirection('down')}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
      <div>
        <input
          type="range"
          min="0"
          max="100"
          value={speed}
          onChange={handleSpeedChange}
        />
        <span>Speed: {speed}%</span>
      </div>
      <button className="emergency-stop" onClick={() => handleDirection('stop')}>
        EMERGENCY STOP
      </button>
    </div>
  );
};

export default JoystickControl;