"use client";
import { useImgHandler } from "@/modules/campus_selector/hooks/store";
import usePrefetchImg from "@/modules/campus_selector/hooks/usePrefetch";
import Image from "next/image";
import styles from "../styles.module.css";
const ImgCampus = () => {
  const [img, isChanging] = useImgHandler();
  const isReady = usePrefetchImg();
  if (!isReady) return null;
  return (
    <Image
      alt="Image of campus"
      src={img}
      className={`${styles.img}`}
      priority
      data-state={isChanging ? "changing" : "idle"}
      width={1000}
      height={500}
    />
  );
};

export default ImgCampus;
