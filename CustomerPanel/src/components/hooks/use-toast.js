// src/components/hooks/use-toast.js
import { useState } from "react";

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState(null);

  const toast = ({ description }) => {
    setToastMessage(description);
    // Automatically clear toast after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return {
    toast,
    toastMessage,
  };
};
