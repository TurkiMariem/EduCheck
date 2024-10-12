import React, { useEffect } from 'react';
import './Alert.css'; // Import your CSS file for styling

const Alert = ({ message, type,onClose  }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // Hide the alert after 10 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);
    console.log("alert launched", message, type);
  return (
    <div className={`alert ${type}`}>
      <span className="close-btn" onClick={onClose} >&times;</span>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
