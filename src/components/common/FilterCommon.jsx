"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";

const FilterCommon = ({ handleFilterChange }) => {
  const [filterValue, setFilterValue] = useState("");
  return (
    <div className="flex items-center gap-1 bg-white rounded-full border px-3">
      <span className="relative w-4 h-4">
        <Image
          src="/Images/Search.png"
          alt="Search img"
          fill
          className="object-cover"
        />
      </span>
      <Input
        className="!w-60 !h-10 !px-2 rounded-lg border-none !bg-white"
        placeholder="Search Routes"
        value={filterValue}
        onChange={(e) => {
          setFilterValue(e.target.value);
          handleFilterChange(e.target.value);
        }}
      />
    </div>
  );
};

export default FilterCommon;
