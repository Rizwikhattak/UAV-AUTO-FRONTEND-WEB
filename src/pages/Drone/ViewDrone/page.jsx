"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
const ViewDronePage = () => {
  return (
    <div>
      <div>
        <h1 className="text-lg sm:text-2xl font-semibold">View Drones</h1>
        <div className="bg-blue-900 mx-auto relative rounded-lg w-64 h-36 sm:w-80 sm:h-40">
          <Image
            src="/Images/dashboard_drone.png"
            alt="Sample Image"
            fill
            className="object-contain"
          />
        </div>
      </div>
      {/* <div>
        <div className="filters flex items-center gap-3">
          <Button variant="hover-blue-fit">Speed</Button>
          <Button variant="hover-blue-fit">Speed</Button>
          <Button variant="hover-blue-fit">Speed</Button>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h1 className="font-semibold">Image</h1>
          </div>
          <div className="col-span-9">
            <h1 className="font-semibold">Name</h1>
          </div>
          <div className="relative drone-image col-span-3 h-40">
            <Image
              src="/Images/dashboard_drone.png"
              alt="Sample Image"
              fill
              className="object-contain"
            />
          </div>
          <div className="rest-content col-span-9">
            <h1>Phantom X7</h1>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ViewDronePage;
