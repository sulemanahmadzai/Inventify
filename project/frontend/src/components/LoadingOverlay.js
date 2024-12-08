import React from 'react';
import { Backdrop, Typography, Box } from '@mui/material';

/**
 * LoadingOverlay Component
 * Displays 5 glowing squares with different colors to indicate loading.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.open - Determines if the overlay is visible
 * @param {string} [props.message='Loading...'] - Customizable loading message
 * @returns JSX Element
 */
const LoadingOverlay = ({ open, message = 'Loading...' }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,  // Ensures overlay appears on top of other components
        flexDirection: 'column',
        gap: 2,  // Adds space between squares and message
      }}
      open={open}
    >
      {/* Glowing Squares Animation */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box className="glowing-square" sx={{ backgroundColor: 'red' }} />
        <Box className="glowing-square" sx={{ backgroundColor: 'blue' }} />
        <Box className="glowing-square" sx={{ backgroundColor: 'green' }} />
        <Box className="glowing-square" sx={{ backgroundColor: 'yellow' }} />
        <Box className="glowing-square" sx={{ backgroundColor: 'purple' }} />
      </Box>

      {/* Loading message */}
      <Typography variant="h6">{message}</Typography>

      <style jsx>{`
        .glowing-square {
          width: 10px;
          height: 10px;
          animation: glow 1.5s infinite alternate;
        }

        .glowing-square:nth-child(1) {
          animation-delay: 0s;
        }
        .glowing-square:nth-child(2) {
          animation-delay: 0.3s;
        }
        .glowing-square:nth-child(3) {
          animation-delay: 0.6s;
        }
        .glowing-square:nth-child(4) {
          animation-delay: 0.9s;
        }
        .glowing-square:nth-child(5) {
          animation-delay: 1.2s;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px 2px currentColor;
            transform: scale(1);
          }
          100% {
            box-shadow: 0 0 15px 5px currentColor;
            transform: scale(1.2);
          }
        }
      `}</style>
    </Backdrop>
  );
};

export default LoadingOverlay;
