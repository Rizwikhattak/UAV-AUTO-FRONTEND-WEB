"use client";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import DataTableFiltersCommon from "@/components/common/DataTableFiltersCommon";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { getMaintenanceSchedules } from "@/store/Actions/maintenanceScheduleActions";
import { ROUTES } from "@/utils/constants";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const MaintenanceMissions = () => {
  const maintenanceSchedule = useSelector((state) => state.maintenanceSchedule);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleScheduledMissionEdit = (schMission) => {
    console.log(schMission);
    router.push(
      `${ROUTES.MAINTENANCE_MISSIONS}/edit/${schMission?.mission_planner_id}`
    );
  };
  const handleScheduledMissionView = (schMission) => {
    console.log(schMission);
    router.push(
      `${ROUTES.MAINTENANCE_MISSIONS}/view/${schMission?.mission_planner_id}`
    );
  };

  useEffect(() => {
    const fetchScheduledMissions = async () => {
      try {
        await dispatch(getMaintenanceSchedules()).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchScheduledMissions();
  }, []);
  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => <h1 className="font-bold text-lg">Name</h1>,
      enableSorting: false,
    },
    {
      accessorKey: "scheduled",
      header: ({ column }) => (
        <h1 className="font-bold text-lg py-3">Scheduled</h1>
      ),
      cell: ({ row }) => {
        const isScheduled = row.getValue("scheduled");

        return <p>{isScheduled ? "Yes" : "No"}</p>;
      },
      enableSorting: false,
    },

    {
      id: "actions",
      header: () => <h1 className="font-bold text-lg text-center">Actions</h1>,
      cell: ({ row }) => {
        const schMission = row.original;

        return (
          <div className="flex items-center justify-center gap-4">
            <button
              className="text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => handleScheduledMissionView(schMission)}
            >
              <Eye size={20} />
            </button>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className={`   ${
                      schMission.scheduled
                        ? "text-gray-400 cursor-not-allowed"
                        : " text-blue-600 hover:text-blue-800 cursor-pointer"
                    }`}
                    onClick={() => handleScheduledMissionEdit(schMission)}
                    disabled={schMission.scheduled}
                  >
                    <Pencil size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm bg-gray-300 p-1 rounded-xl">
                    Mission is already scheduled
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* <button
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => {
                setSelectedDrone(drone);
                setOpenDeleteModal(true);
              }}
            >
              <Trash2 size={20} />
            </button> */}
          </div>
        );
      },
      enableSorting: false,
      size: 100,
    },
  ];
  return (
    <div className="min-h-screen p-10">
      <h1 className=" text-lg sm:text-4xl text-center">Missions</h1>
      <div className="space-y-3">
        {/* <div>
          <DataTableFiltersCommon
            filters={filters}
            selectedFilter={selectedFilter}
            handleFilterChange={handleFilterChange}
          />
        </div> */}
        <DataTableCommon
          // filters={filters}
          columns={columns}
          data={maintenanceSchedule.data}
          isLoading={maintenanceSchedule.isLoading}
          // selectedFilter={selectedFilter}
          // setSelectedFilter={setSelectedFilter}
          // totalDataCount={bankAccountsData.count}
          // onFetchData={(offset, limit) =>
          //   dispatch(getAllBankAccounts({ offset, limit }))
          // }
        />
      </div>
    </div>
  );
};

export default MaintenanceMissions;
