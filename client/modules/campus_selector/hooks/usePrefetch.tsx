import { getImageLinks } from "@/modules/campus_selector/stores/options";
import { useEffect, useState } from "react";

const usePrefetchImg = () => {
  const [isLoading, setLoader] = useState(true);
  useEffect(() => {
    const imgs = getImageLinks();
    const promises = imgs.map(
      (src) =>
        new Promise((res) => {
          const img = new Image();
          img.src = src;
          img.onload = res;
        })
    );
    Promise.all(promises).then(() => setLoader(() => false));
  }, []);
  return !isLoading;
};

export default usePrefetchImg;
