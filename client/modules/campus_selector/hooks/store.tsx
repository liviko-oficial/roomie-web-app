import { useCampusStore } from "@/modules/campus_selector/stores/campusStore";
import { asArrayOptions } from "@/modules/campus_selector/stores/options";
import { useEffect, useState } from "react";
export const useStoreArray = () => {
  const set = useCampusStore((state) => state.handleChange);
  const values = asArrayOptions();
  return values.map(({ id, name }) => ({ change: () => set(id), name }));
};
export const useImgHandler = (): [string, boolean] => {
  const [isChanging, setChange] = useState(false);
  const img = useCampusStore((state) => state.state.img);
  useEffect(() => {
    const id_func = useCampusStore.subscribe(() => {
      setChange(true);
      setTimeout(() => setChange(false), 200);
    });
    return () => id_func();
  }, []);
  return [img, isChanging];
};
