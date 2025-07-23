import React from "react";
import styles from "@/modules/home/styles.module.css";
const Icon = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const SeeMore = () => {
  return (
    <div
      className={`${styles.animation_scroll_delay} absolute bottom-2 h-fit -z-50 pointer-events-none lg:flex flex-col items-center w-full hidden`}
    >
      <Icon className={`size-7 -mb-4 ${styles.animation_scroll}`} />
      <Icon className={`size-7 -mb-4 ${styles.animation_scroll}`} />
      <Icon className={`size-7 ${styles.animation_scroll}`} />
    </div>
  );
};

export default SeeMore;
