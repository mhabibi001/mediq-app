import React, { useState, useEffect } from "react";

const Timer = ({ duration, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds

  useEffect(() => {
    if (!duration || duration <= 0) return; // ✅ No timer case

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onTimeout, duration]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return duration > 0 ? (
    <div>
      <p>Time Remaining: {formatTime(timeLeft)}</p>
    </div>
  ) : null;
};

export default Timer;
