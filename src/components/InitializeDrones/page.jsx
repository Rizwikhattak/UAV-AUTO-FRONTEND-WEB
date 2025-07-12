"use client";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { Button } from "@/components/ui/button";
import { initializeDrones } from "@/store/Actions/planMissionActions";
import { ROUTES } from "@/utils/constants";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const InitializeDrones = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const planMission = useSelector((state) => state.planMission);
  const handleInitializeDrones = async () => {
    try {
      await dispatch(
        initializeDrones({ mission_planner_id: params.id })
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      accessorKey: "drone",
      header: ({ column }) => <h1 className="">Drone Name</h1>,
      enableSorting: false,
      cell: ({ row }) => {
        const drone = row.getValue("drone");
        return <p>{drone?.name}</p>;
      },
    },
    {
      accessorKey: "drone",
      header: ({ column }) => <h1 className="">Flight Duration(s)</h1>,
      enableSorting: false,
      cell: ({ row }) => {
        const drone = row.getValue("drone");
        return <p>{drone?.flight_duration}</p>;
      },
    },
    {
      accessorKey: "fence_number",
      header: ({ column }) => <h1 className="">Fence Number</h1>,
      enableSorting: false,
    },
    {
      accessorKey: "video_flight_seconds",
      header: ({ column }) => <h1 className="">Flight Time(s)</h1>,
      enableSorting: false,
    },

    {
      accessorKey: "station_to_fence_seconds",
      header: ({ column }) => <h1 className="">Station to Fence(s)</h1>,
      enableSorting: false,
    },
    {
      accessorKey: "total_seconds",
      header: ({ column }) => <h1 className="">Total Seconds(s)</h1>,
      enableSorting: false,
    },
    // {
    //   id: "actions",
    //   header: () => <h1 className="text-center">Actions</h1>,
    //   cell: ({ row }) => {
    //     const fence = row.original;
    //     return (
    //       <div className="flex items-center justify-center gap-4">
    //         <button
    //           type="button"
    //           className="text-red-600 hover:text-red-800 cursor-pointer"
    //           onClick={() => {
    //             setRouteData((prev) =>
    //               prev.filter(
    //                 (item) => item?.fence_number !== fence?.fence_number
    //               )
    //             );
    //           }}
    //         >
    //           <Trash2 size={20} />
    //         </button>
    //       </div>
    //     );
    //   },
    //   enableSorting: false,
    //   size: 100,
    // },
  ];
  return (
    <div className="p-10 min-h-screen">
      <h1 className="flex items-center justify-center py-4 text-2xl">
        Initialize Drones to their corresponding geofence
      </h1>
      <div className="flex items-center justify-center pb-4">
        <Button onClick={handleInitializeDrones} variant="hover-blue-fit">
          Initialize Drones
        </Button>
      </div>
      <DataTableCommon
        // filters={filters}
        columns={columns}
        data={planMission.data}
        isLoading={planMission.isPostLoading}
        // selectedFilter={selectedFilter}
        // setSelectedFilter={setSelectedFilter}
        // totalDataCount={bankAccountsData.count}
        // onFetchData={(offset, limit) =>
        //   dispatch(getAllBankAccounts({ offset, limit }))
        // }
      />
      <div className="flex items-center justify-center py-10">
        <Button
          onClick={() => {
            router.push(`${ROUTES.ACTIVE_MISSION_PLAN}/${params.id}`);
          }}
          variant="hover-blue-fit"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default InitializeDrones;
