"use client";

const YearText = ({ ...props }) => {
  return <span {...props}>{new Date().getFullYear()}</span>;
};

export default YearText;
