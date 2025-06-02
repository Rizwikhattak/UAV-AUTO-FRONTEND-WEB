"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import DataTableFiltersCommon from "@/components/common/DataTableFiltersCommon";

const ViewDronePage = () => {
  const filters = ["Speed", "Flight Duration", "Ceiling"];
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };
  const columns = [
    // Bank Name
    {
      accessorKey: "image",
      header: ({ column }) => <h1 className="font-bold text-lg py-3">Image</h1>,
      enableSorting: false,
      size: 100, // <-- Set the "Image" column to 100px fixed width
      minSize: 100, // enforce 100px minimum
      maxSize: 100,
      cell: ({ row }) => {
        const src = row.getValue("image");
        return (
          <div className="relative w-12 sm:w-32 h-12 sm:h-32 rounded-lg">
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
      accessorKey: "name",
      header: ({ column }) => <h1 className="font-bold text-lg">Name</h1>,
      cell: ({ row }) => {
        const { name, speed, flightDuration, ceiling } = row.original;
        return (
          <div className="flex flex-col gap-3 px-4">
            <div>
              <h1>{name}</h1>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                  <Image
                    src="/Images/speed.png"
                    alt="Ceiling Icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p>{speed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                  <Image
                    src="/Images/battery.png"
                    alt="Ceiling Icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p>{flightDuration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                  <Image
                    src="/Images/ceiling.png"
                    alt="Ceiling Icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p>{ceiling}</p>
                </div>
              </div>
            </div>
          </div>
        );
      },
      enableSorting: false,
    },
  ];
  return (
    <div className=" p-10">
      <div className="flex flex-col items-center gap-3 pb-5">
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
      <div className="space-y-3">
        <div>
          <DataTableFiltersCommon
            filters={filters}
            selectedFilter={selectedFilter}
            handleFilterChange={handleFilterChange}
          />
        </div>
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
    name: "Phantom X7",
    speed: "90km/h",
    flightDuration: "1.5h",
    ceiling: "100m",
  },
  {
    image: "/Images/Drone_1.png",

    name: "Falcon Pro",
    speed: "85km/h",
    flightDuration: "2h",
    ceiling: "300m",
  },
  {
    image: "/Images/Drone_2.png",
    name: "Eagle Eye",
    speed: "70km/h",
    flightDuration: "1h",
    ceiling: "200m",
  },
  {
    image: "/Images/Drone_3.png",

    name: "Swift Hawk",
    speed: "65km/h",
    flightDuration: "2h",
    ceiling: "350m",
  },
];

export default ViewDronePage;
