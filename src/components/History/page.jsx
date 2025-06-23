"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import DataTableFiltersCommon from "@/components/common/DataTableFiltersCommon";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getMissionHistory } from "@/store/Actions/planMissionActions";
import { Eye } from "lucide-react";
import {
  filterAscDesc,
  filterMissions,
} from "@/store/Reducers/planMissionSlice";
import FilterCommon from "@/components/common/FilterCommon";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";

const ViewHistory = () => {
  const filters = ["All", "Completed", "Aborted"];
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const router = useRouter();
  const dispatch = useDispatch();
  const planMission = useSelector((state) => state.planMission);
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    dispatch(filterAscDesc({ filter: filter }));
  };
  const handleInputFilterChange = (filterValue) => {
    dispatch(filterMissions({ filter: filterValue }));
  };
  const handleViewHistory = (history) => {
    router.push(`${ROUTES.VIEW_HISTORY}/${history.id}`);
  };
  useEffect(() => {
    dispatch(getMissionHistory());
  }, [dispatch]);

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
    {
      id: "actions",
      header: () => <h1 className="font-bold text-lg text-center">Actions</h1>,
      cell: ({ row }) => {
        const history = row.original;

        return (
          <div className="flex items-center justify-center gap-4">
            <button
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => handleViewHistory(history)}
            >
              <Eye size={20} />
            </button>
          </div>
        );
      },
      enableSorting: false,
      size: 100,
    },
  ];
  return (
    <div className=" p-10">
      <div className="flex flex-col items-center gap-3 pb-5">
        <h1 className="text-lg sm:text-2xl font-semibold">History</h1>
        <FilterCommon handleFilterChange={handleInputFilterChange} />
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
          data={planMission.data}
          isLoading={planMission.isLoading}
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

export default ViewHistory;
