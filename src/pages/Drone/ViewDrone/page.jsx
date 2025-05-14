"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DataTableCommon } from "@/components/common/DataTableCommon";
const ViewDronePage = () => {
  const columns = [
    // Bank Name
    {
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeaderCommon column={column} title="Image" />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const src = row.getValue("image");
        return (
          <div className="relative w-32 h-32">
            <Image
              src={src}
              alt="Sample Image"
              fill
              className="object-contain"
            />
          </div>
        );
      },
    },

    // Account Type
    {
      accessorKey: "rest_content",
      header: ({ column }) => (
        <DataTableColumnHeaderCommon column={column} title="Account Type" />
      ),
      cell: ({ row }) => {
        const { name, speed, flightDuration, ceiling } =
          row.getValue("rest_content");
        return (
          <span
            className={`capitalize px-2 py-1 rounded-xl ${
              type?.toLocaleLowerCase()?.trim()?.replace(/\s+/g, "") ===
              "personal"
                ? "bg-[#EFF8FF] text-[#175CD3]"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {name}
          </span>
        );
      },
      enableSorting: true,
    },
  ];
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
      <div>
        <DataTableCommon
          // filters={filters}
          columns={columns}
          data={drones}
          // isLoading={bankAccountsData.isLoading}
          // selectedFilter={selectedFilter}
          // setSelectedFilter={setSelectedFilter}
          // totalDataCount={bankAccountsData.count}
          // onFetchData={(offset, limit) =>
          //   dispatch(getAllBankAccounts({ offset, limit }))
          // }
        />
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
const drones = [
  {
    image: "/Images/dashboard_drone.png",
    rest_content: {
      name: "Phantom X7",
      speed: "90km/h",
      flightDuration: "1.5h",
      ceiling: "100m",
    },
  },
  {
    image: "/Images/dashboard_drone.png",
    rest_content: {
      name: "Falcon Pro",
      speed: "85km/h",
      flightDuration: "2h",
      ceiling: "300m",
    },
  },
  {
    image: "/Images/dashboard_drone.png",
    rest_content: {
      name: "Eagle Eye",
      speed: "70km/h",
      flightDuration: "1h",
      ceiling: "200m",
    },
  },
  {
    image: "/Images/dashboard_drone.png",
    rest_content: {
      name: "Swift Hawk",
      speed: "65km/h",
      flightDuration: "2h",
      ceiling: "350m",
    },
  },
  {
    image: "/Images/dashboard_drone.png",
    rest_content: {
      name: "Eagle Eye",
      speed: "55km/h",
      flightDuration: "2.5h",
      ceiling: "500m",
    },
  },
];

export default ViewDronePage;
