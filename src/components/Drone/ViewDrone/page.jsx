"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import DataTableFiltersCommon from "@/components/common/DataTableFiltersCommon";
import { useDispatch, useSelector } from "react-redux";
import { deleteDrone, getAllDrones } from "@/store/Actions/droneActions";
import { SET_IMAGE_URL } from "@/utils/Helpers";
import { Pencil, Trash2 } from "lucide-react";
import { set } from "date-fns";
import { filterDrones } from "@/store/Reducers/droneSlice";
import DeleteDroneModal from "@/components/Drone/DeleteDroneModal";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";

const ViewDronePage = () => {
  const drones = useSelector((state) => state.drone);
  const dispatch = useDispatch();
  const router = useRouter();
  const filters = ["Speed", "Flight Duration", "Ceiling"];
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    dispatch(filterDrones({ filter: selectedFilter }));
  };
  const handleDroneEdit = (drone) => {
    console.log("Edit drone:", drone.id);
    // add navigation or modal logic here
    router.push(`${ROUTES.EDIT_DRONE}/${drone.id}`);
  };

  const handleDroneDelete = async () => {
    console.log("Delete drone:", selectedDrone.id);
    try {
      await dispatch(deleteDrone(selectedDrone.id)).unwrap();
      dispatch(getAllDrones());
      setOpenDeleteModal(false);
    } catch (err) {
      console.error("Error deleting drone:", err);
    }
  };
  useEffect(() => {
    dispatch(getAllDrones());
  }, []);

  const columns = [
    {
      accessorKey: "image_path",
      header: ({ column }) => <h1 className="font-bold text-lg py-3">Image</h1>,
      enableSorting: false,
      size: 100, // <-- Set the "Image" column to 100px fixed width
      minSize: 100, // enforce 100px minimum
      maxSize: 100,
      cell: ({ row }) => {
        const src = row.getValue("image_path");
        const image_url = SET_IMAGE_URL(src);
        console.log("image_url", image_url, src);
        return (
          <div className="relative w-12 sm:w-32 h-12 sm:h-32 rounded-lg">
            <Image
              src={image_url}
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
        const { name, speed, flight_duration, ceiling } = row.original;
        return (
          <div className="flex flex-col gap-3 px-4">
            <div>
              <h1 className="text-base sm:text-xl">{name}</h1>
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
                  <p>{flight_duration}</p>
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
    {
      id: "actions",
      header: () => <h1 className="font-bold text-lg text-center">Actions</h1>,
      cell: ({ row }) => {
        const drone = row.original;

        return (
          <div className="flex items-center justify-center gap-4">
            <button
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => handleDroneEdit(drone)}
            >
              <Pencil size={20} />
            </button>
            <button
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => {
                setSelectedDrone(drone);
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
          data={drones.data}
          isLoading={drones.isLoading}
          // selectedFilter={selectedFilter}
          // setSelectedFilter={setSelectedFilter}
          // totalDataCount={bankAccountsData.count}
          // onFetchData={(offset, limit) =>
          //   dispatch(getAllBankAccounts({ offset, limit }))
          // }
        />
      </div>
      <DeleteDroneModal
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        selectedDrone={selectedDrone}
        handleDroneDelete={handleDroneDelete}
        isLoading={drones.isPostLoading}
      />
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
