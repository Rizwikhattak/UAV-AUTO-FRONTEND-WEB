"use client";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import FilterCommon from "@/components/common/FilterCommon";
import DeleteMissionModal from "@/components/PlanMissions/DeleteMissionModal";
// Update these imports to your mission plan-specific components if available
// import { DeleteMissionPlanDialog } from "@/components/missionPlan/DeleteMissionPlanDialog";
// import { EditMissionPlanSheet } from "@/components/missionPlan/EditMissionPlanSheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  deleteMissionPlan,
  getAllMissionPlans,
} from "@/store/Actions/planMissionActions";
import { filterMissions } from "@/store/Reducers/planMissionSlice";
import { ROUTES } from "@/utils/constants";
import { Pencil, Trash2 } from "lucide-react";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ViewMissionPlans = () => {
  const dispatch = useDispatch();
  const planMissions = useSelector((state) => state.planMission);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [selectedMission, setSelectedMission] = React.useState(null);
  const router = useRouter();
  const handleMissionEdit = (mission) => {
    router.push(`${ROUTES.EDIT_MISSION_PLAN}/${mission.id}`);
  };
  const handleMissionDelete = async () => {
    try {
      if (selectedMission) {
        await dispatch(deleteMissionPlan(selectedMission.id)).unwrap();
        setOpenDeleteModal(false);
        setSelectedMission(null);
        // Optionally, you can refetch the mission plans after deletion
        dispatch(getAllMissionPlans());
      }
    } catch (error) {
      console.error("Error deleting mission plan:", error);
    }
  };
  const handleFilterChange = (filterValue) => {
    dispatch(filterMissions({ filter: filterValue }));
  };

  useEffect(() => {
    dispatch(getAllMissionPlans());
  }, [dispatch]);
  const tableColumns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeaderCommon column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("name");
        return <span className="ml-4 w-full">{value}</span>;
      },
      enableSorting: false,
    },

    // {
    //   accessorKey: "status",
    //   header: ({ column }) => (
    //     <DataTableColumnHeaderCommon column={column} title="Status" />
    //   ),
    //   cell: ({ row }) => {
    //     const value = row.getValue("status");
    //     return <span className="ml-4 w-full">{value}</span>;
    //   },
    //   enableSorting: false,
    // },
    {
      id: "actions",
      header: () => <h1 className="font-bold text-lg text-center">Actions</h1>,
      cell: ({ row }) => {
        const mission = row.original;

        return (
          <div className="flex items-center justify-center gap-4">
            <button
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => handleMissionEdit(mission)}
            >
              <Pencil size={20} />
            </button>
            <button
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => {
                setSelectedMission(mission);
                setOpenDeleteModal(true);
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        );
      },
      enableSorting: false,
      size: 100,
    },
  ];
  return (
    <section className="view-mission-plans-page flex flex-col items-center h-screen justify-center">
      <div className="w-full px-10 py-5 space-y-5">
        <div className="header flex flex-col items-center gap-y-4">
          <h1 className="font-medium text-3xl">View Missions</h1>
          {/* <p>
            Manage your mission plans with ease. View and edit mission plan
            details below.
          </p> */}
          {/* Uncomment and update if you want to display an image:
          <div className="card relative h-44 w-80 rounded-lg shadow-xl bg-blue-950">
            <Image
              src="/dashboard_mission.png"
              alt="Mission Plans Dashboard"
              fill
              className="object-cover"
            />
          </div>
          */}
          <FilterCommon handleFilterChange={handleFilterChange} />
        </div>
        <DataTableCommon
          columns={tableColumns}
          data={planMissions.data}
          isLoading={planMissions.isLoading}
          className="w-full"
        />
        <DeleteMissionModal
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          selectedMission={selectedMission}
          handleMissionDelete={handleMissionDelete}
          isLoading={planMissions.isPostLoading}
        />
      </div>
    </section>
  );
};

export default ViewMissionPlans;
