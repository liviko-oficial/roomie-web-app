"use client";
import React from "react";
import { useStoreArray } from "@/modules/campus_selector/hooks/store";
import ChangeCampusDesktop from "@/modules/campus_selector/components/ChangeCampusDesktop";
import ChangeCampusPhone from "@/modules/campus_selector/components/ChangeCampusPhone";

export default function ChangeCapus({}) {
  const options = useStoreArray();
  return (
    <>
      <ChangeCampusPhone options={options} />
      <ChangeCampusDesktop options={options} />
    </>
  );
}
