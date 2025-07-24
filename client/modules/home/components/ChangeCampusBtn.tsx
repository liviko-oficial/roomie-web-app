import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

const ChangeCampusBtn = ({
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        className,
        `p-1 lg:px-2 text-[8px] md:text-base rounded-sm  bg-primary-400/20 capitalize`
      )}
      {...props}
    >
      cambiar campus
    </button>
  );
};

export default ChangeCampusBtn;
