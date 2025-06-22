"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import DataTableFiltersCommon from "@/components/common/DataTableFiltersCommon";
import { Input } from "@/components/ui/input";

const ViewHistory = () => {
  const filters = ["All", "Completed", "Aborted"];
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };
  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => <h1 className="text-lg">Name</h1>,
      cell: ({ row }) => {
        const { name } = row.original;
        return <span>{name}</span>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <h1 className="text-lg py-3">Status</h1>,
      enableSorting: false,
      cell: ({ row }) => {
        const status = row.getValue("status");
        return <span>{status}</span>;
      },
    },
  ];
  return (
    <div className=" p-10">
      <div className="flex flex-col items-center gap-3 pb-5">
        <h1 className="text-lg sm:text-2xl font-semibold">History</h1>
        <div className="flex items-center gap-1 bg-white rounded-full border px-3">
          <span className="relative w-4 h-4">
            <Image src="/Images/Search.png" fill className="object-cover" />
          </span>
          <Input
            className="!w-60 !h-10 !px-2 rounded-lg border-none !bg-white"
            placeholder="Search Missions"
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
          data={missionHistory}
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
// HistoryScreenDummyData.js
export const missionHistory = [
  { id: "1", name: "Jinnah Solar Check", status: "Completed" },
  { id: "3", name: "Voltage Output Check", status: "Completed" },
  { id: "2", name: "Dust Accumulation Check", status: "Aborted" },
  { id: "4", name: "Energy Generation Report", status: "Aborted" },
  { id: "5", name: "Surveillance Drone Report", status: "Completed" },
];

export default ViewHistory;
