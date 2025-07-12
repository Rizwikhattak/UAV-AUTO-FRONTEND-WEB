"use client";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Image from "next/image";
import {
  deleteGeofence,
  getAllGeofences,
} from "@/store/Actions/geofenceActions";
import FilterCommon from "@/components/common/FilterCommon";
import { filterGeofences } from "@/store/Reducers/geofenceSlice";
import { Pencil, Trash2 } from "lucide-react";
import DeleteGeofenceModal from "@/components/GeoFence/DeleteGeofenceModal";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
const ViewGeofence = () => {
  const dispatch = useDispatch();
  const geofences = useSelector((state) => state.geofence);
  const router = useRouter();
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleGeofenceEdit = (geofennce) => {
    console.log("Edit geofence:", geofennce);
    setSelectedGeofence(geofennce);
    router.push(`${ROUTES.EDIT_GEOFENCE}/${geofennce.id}`);
  };
  const handleGeofenceDelete = async (geofennce) => {
    try {
      console.log("Delete geofence:", selectedGeofence.id);
      await dispatch(deleteGeofence(selectedGeofence.id)).unwrap();
      dispatch(getAllGeofences());
      setOpenDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (value) => {
    console.log("Filter value:", value);

    dispatch(filterGeofences(value));
  };
  useEffect(() => {
    dispatch(getAllGeofences());
  }, []);
  const tableColumns = [
    {
      accessorKey: "name",
      header: ({ column }) => <h1 className="text-lg py-3 pl-2"> Name</h1>,
      cell: ({ row }) => {
        const value = row.getValue("name");
        return <span className="ml-4 w-full">{value}</span>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "number_of_drones",
      header: ({ column }) => <h1 className="text-lg py-3">Drones</h1>,
      cell: ({ row }) => {
        const value = row.getValue("number_of_drones");
        console.log("Number of drones:", value);
        return <span className="ml-4 w-full">{value}</span>;
      },
      enableSorting: false,
    },

    {
      id: "actions",
      header: () => <h1 className="font-bold text-lg text-center">Actions</h1>,
      cell: ({ row }) => {
        const geofence = row.original;
        const disableDelete = geofence.number_of_drones > 0;

        return (
          <div className="flex items-center justify-center gap-4">
            {/* Edit button */}
            {/* <button
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => handleGeofenceEdit(geofence)}
            >
              <Pencil size={20} />
            </button> */}

            {/* Delete button with conditional tooltip */}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`${
                      disableDelete
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:text-red-800"
                    }`}
                    onClick={() => {
                      if (!disableDelete) {
                        setSelectedGeofence(geofence);
                        setOpenDeleteModal(true);
                      }
                    }}
                    disabled={disableDelete}
                  >
                    <Trash2 size={20} />
                  </button>
                </TooltipTrigger>
                {disableDelete && (
                  <TooltipContent>
                    <p className="text-sm">
                      Cannot delete a geofence while it has assigned drones.
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
      enableSorting: false,
      size: 100,
    },
  ];
  return (
    <section className="view-drones-page flex justify-center">
      <div className="w-full px-10 py-5 space-y-5">
        <div className="header flex flex-col items-center gap-y-4">
          <h1 className="font-medium text-3xl">View Geofences</h1>
          <FilterCommon handleFilterChange={handleFilterChange} />
          {/* <p>Manage your routes fleet with Ease View and Edit Drone Details</p> */}
          {/* <div className="card relative  h-44 w-80 rounded-lg shadow-xl bg-blue-950">
            <Image
              src="/dashboard_drone.png"
              alt=""
              fill
              className="object-cover"
            />
          </div> */}
        </div>
        <DataTableCommon
          columns={tableColumns}
          data={geofences.data}
          className="w-full"
        />
        <DeleteGeofenceModal
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          selectedGeofence={selectedGeofence}
          handleGeofenceDelete={handleGeofenceDelete}
          isLoading={geofences.isPostLoading}
        />
      </div>
    </section>
  );
};

export default ViewGeofence;
