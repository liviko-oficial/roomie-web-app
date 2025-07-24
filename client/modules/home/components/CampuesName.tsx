"use client";
import { useCampusStore } from "@/modules/campus_selector/stores/campusStore";
import React from "react";

function CampuesName({}) {
  const name = useCampusStore((val) => val.state.name);
  return (
    <h1 className="my-2 font-bold text-lg md:text-3xl lg:text-6xl text-center capitalize">
      {name}
    </h1>
  );
}

export default CampuesName;
