import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ChangeCampusBtn from "@/modules/home/components/ChangeCampusBtn";
type Props = {
  options: { name: string; change: () => void }[];
};
const ChangeCampusDesktop = ({ options }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <ChangeCampusBtn className="w-fit self-end hidden lg:block" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="border-none text-left lg:text-right text-[8px] lg:text-sm grid grid-cols-2 gap-2 gird-row-[fit-content] p-0 self-start lg:self-end max-w-[300px]"
      >
        {options.map(({ name, change }) => (
          <button
            className="bg-primary-300/20 rounded-sm py-2"
            key={name}
            onClick={change}
          >
            {name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default ChangeCampusDesktop;
