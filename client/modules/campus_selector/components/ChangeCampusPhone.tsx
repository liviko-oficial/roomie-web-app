import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangeCampusBtn from "@/modules/home/components/ChangeCampusBtn";
import { useState } from "react";
type Props = {
  options: { name: string; change: () => void }[];
};
export default function ChangeCampusPhone({ options }: Props) {
  const [isOpen, setState] = useState(false);
  const handleClick = (fun: () => void) => () => {
    setState(false);
    fun();
  };
  return (
    <Dialog defaultOpen open={isOpen} onOpenChange={setState}>
      <DialogTrigger asChild>
        <ChangeCampusBtn className="block lg:hidden " />
      </DialogTrigger>
      <DialogContent className="border-none bg-accent-700">
        <DialogHeader>
          <DialogTitle className="text-left">Campus:</DialogTitle>
        </DialogHeader>
        <div className="max-h-80 flex flex-col">
          {options.map(({ name, change }) => (
            <button
              key={name}
              onClick={handleClick(change)}
              className="focus:outline-0 border-b border-b-accent-600 mb-2"
            >
              {name}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
