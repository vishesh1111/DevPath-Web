"use client";

import React from "react";

const LoadingSpinner = ({
  size = "40px",
  color = "#ffffff",
}) => {
  return (
    <div
      className="animate-spin rounded-full border-4 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: "transparent",
      }}
    />
  );
};

export default LoadingSpinner;