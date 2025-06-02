"use client";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { getAllDrones } from "@/store/Actions/droneActions";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";

import Image from "next/image";
const ViewGeofence = () => {
  const dispatch = useDispatch();
  const routes = [
    {
      id: 1,
      name: "Iqbal Solar park",
      landing_station: "Committee Chowk station",
      departure_station: "Faizabad station",
      num_drones: 1,
    },
    {
      id: 2,
      name: "Quaid e Azam Solar park",
      landing_station: "6th Road station",
      departure_station: "Faizabad station",
      num_drones: 2,
    },
    {
      id: 3,
      name: "RWP Solar park",
      landing_station: "Saddar station",
      departure_station: "Rehmanabad station",
      num_drones: 3,
    },
    {
      id: 4,
      name: "ISB Solar park",
      landing_station: "Golra station",
      departure_station: "Mureed station",
      num_drones: 4,
    },
    {
      id: 5,
      name: "Nust Solar Park",
      landing_station: "Lahore station",
      departure_station: "Shahdara station",
      num_drones: 5,
    },
  ];

  console.log("DROOOONESSSSSSSSSs", routes);
  useEffect(() => {
    dispatch(getAllDrones());
  }, [dispatch]);

  return (
    <section className="view-drones-page flex justify-center">
      <div className="w-full px-10 py-5 space-y-5">
        <div className="header flex flex-col items-center gap-y-4">
          <h1 className="font-medium text-3xl">View Geofences</h1>
          <div className="flex items-center gap-1 bg-white rounded-full border px-3">
            <span className="relative w-4 h-4">
              <Image src="/Images/Search.png" fill className="object-cover" />
            </span>
            <Input
              className="!w-60 !h-10 !px-2 rounded-lg border-none !bg-white"
              placeholder="Search Routes"
            />
          </div>
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
          data={routes}
          className="w-full"
        />
      </div>
    </section>
  );
};

const tableColumns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeaderCommon column={column} title="ID" />
  //   ),
  //   cell: ({ row }) => {
  //     const value = row.getValue("id");
  //     return <span className="ml-4 w-full">{value}</span>;
  //   },
  // },
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
    accessorKey: "num_drones",
    header: ({ column }) => <h1 className="text-lg py-3">No. of drones</h1>,
    cell: ({ row }) => {
      const value = row.getValue("num_drones");
      return <span className="ml-4 w-full">{value}</span>;
    },
    enableSorting: false,
  },
  // {
  //   accessorKey: "departure_station",
  //   header: ({ column }) => (
  //     <DataTableColumnHeaderCommon column={column} title="Departure Station" />
  //   ),
  //   cell: ({ row }) => {
  //     const value = row.getValue("departure_station");
  //     return <span className="ml-4 w-full">{value}</span>;
  //   },
  // },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     // Spread the entire row data for editing/deleting
  //     const rowData = { ...row.original };
  //     console.log("Route Data:", rowData);

  //     return (
  //       <div className="flex items-center gap-3">
  //         {/* <EditDroneSheet triggerButton={<Edit />} droneData={rowData} /> */}
  //         {/* <DeleteDroneDialog triggerButton={<Trash2 />} droneData={rowData} /> */}
  //         {/* If you have a sheet/dialog for editing a route: */}
  //         {/* <EditRouteSheet triggerButton={<Edit />} routeData={rowData} /> */}
  //         {/* If you have a dialog for deleting a route: */}
  //         {/* <DeleteRouteDialog triggerButton={<Trash2 />} routeData={rowData} /> */}
  //       </div>
  //     );
  //   },
  // },
];
export default ViewGeofence;
