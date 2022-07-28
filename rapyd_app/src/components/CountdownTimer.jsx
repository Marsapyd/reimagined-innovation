import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import getRemainingUntilMsTimeStamp from './CountdownUtils';

const defaultRemainingTime = {
  seconds: '00',
  minutes: '00',
  hours: '00',
  days: '00'
};

const CountdownTimer = ({ countdownTimestampMs }) => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  const updateRemainingTime = countdown => {
    setRemainingTime(getRemainingUntilMsTimeStamp(countdown));
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(countdownTimestampMs);
    }, 1000);

    return () => clearTimeout(intervalId);
  }, [countdownTimestampMs]);

  return (
    <div className="w-full text-center text-white">
      <Typography variant="h3">
        {remainingTime.days} days left till space flight
      </Typography>
    </div>
  );
};
CountdownTimer.propTypes = {
  countdownTimestampMs: PropTypes.number.isRequired
};
export default CountdownTimer;
