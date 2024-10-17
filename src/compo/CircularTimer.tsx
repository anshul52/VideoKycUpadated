import React from "react";

const CircularTimer: React.FC<{ value: number }> = ({ value }) => {
  const radius = 45; // Adjust the radius for the circular design
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 10) * circumference;

  return (
    <svg width="100" height="100" stroke="#05222C" className="bg-[#001820]">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#fff"
        strokeWidth="9"
        className="border-4 border-[#001820]"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#05222C"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#fff"
        fontSize="18"
        className=""
      >
        {value}
      </text>
    </svg>
  );
};

export default CircularTimer;
