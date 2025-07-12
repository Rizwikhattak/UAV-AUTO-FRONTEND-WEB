"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Spinner from "@/components/common/SpinnerCommon";
import { InputCommon } from "@/components/common/FormCommons";
import InteractiveMap from "@/components/common/InteractiveMap";
import FullScreenMapModal from "@/components/common/FullScreenMapModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import { geofenceSchema } from "@/components/GeoFence/GeofenceSchema";
import {
  getGeofenceById,
  insertGeofence,
  updateGeofence,
} from "@/store/Actions/geofenceActions";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import FullScreenMapRouteModal from "@/components/common/FullScreenMaopRouteModal";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { Trash2 } from "lucide-react";

const AddGeofence = () => {
  const params = useParams();
  const geofenceId = params.id;
  console.log("Geofence ID:", geofenceId);
  const geofence = useSelector((state) => state.geofence);
  const dispatch = useDispatch();
  const [inputImage, setInputImage] = useState(null);
  const station = useSelector((state) => state.station);
  const router = useRouter();
  // Modal states
  const [showStationModal, setShowStationModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);

  // Pins state
  const [stationPins, setStationPins] = useState([]);
  const [routePins, setRoutePins] = useState([]);
  const [deletedPins, setDeletedPins] = useState([]);
  const [routeData, setRouteData] = useState([]);
  // Combine all pins for display
  const allPins = [
    ...stationPins.map((pin) => ({ ...pin, type: "station" })),
    ...routePins.map((pin) => ({ ...pin, type: "route" })),
  ];
  console.log("Stationnnnnnnnnnnnnnnn:", station);

  const initialState = {
    name: "",
    rows: "",
    columns: "",
    stationPins: [],
    routePins: [],
  };

  const form = useForm({
    resolver: zodResolver(geofenceSchema),
    defaultValues: initialState,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = form;

  console.log("Stations", station);

  const handleFormSubmit = async (data) => {
    try {
      console.log("Form Submitted:", data);
      const payload = {
        name: data.name,
        // rows: data.rows,
        // columns: data.columns,
        station_latitude: stationPins[0]?.lat || 0,
        station_longitude: stationPins[0]?.lng || 0,
        // deleted_pins: deletedPins.map((pin) => pin.location_pin_id),
        // locations: data.routePins.map((pin) => {
        //   if (pin.location_pin_id) {
        //     return {
        //       location_pin_id: pin.location_pin_id,
        //       latitude: pin.lat,
        //       longitude: pin.lng,
        //     };
        //   }
        //   return {
        //     latitude: pin.lat,
        //     longitude: pin.lng,
        //   };
        // }),
        locations: routeData?.map((route) => {
          return {
            ...route,
            pins: route?.pins?.map((item) => ({
              latitude: item?.lat,
              longitude: item?.lng,
            })),
          };
        }),
      };
      console.log("This is payload", payload);
      geofenceId
        ? await dispatch(
            updateGeofence({ ...payload, id: geofenceId })
          ).unwrap()
        : await dispatch(insertGeofence(payload)).unwrap();
      router.push(ROUTES.HOME);
      form.reset(initialState);
    } catch (err) {
      console.log(err);
    }
  };

  const handleError = (errors) => {
    console.log("Validation Errors:", errors);
  };

  const handleStationPins = (pins) => {
    setStationPins(pins);
    form.setValue("stationPins", pins);
    clearErrors("stationPins");
    setShowStationModal(false);
  };

  const handleRouteData = (pins, rows, cols) => {
    setRoutePins(pins);
    setRouteData((prev) => [
      ...prev,
      {
        fence_number: prev.length + 1,
        rows: rows,
        columns: cols,
        pins: pins,
      },
    ]);
    form.setValue("routePins", pins);
    clearErrors("routePins");
    setShowRouteModal(false);
  };
  const handleDeletePins = (pins) => {
    setDeletedPins((oldPins) => (pins ? [...oldPins, pins] : oldPins));
  };
  console.log("Deleted Pins:", deletedPins);

  const columns = [
    {
      accessorKey: "fence_number",
      header: ({ column }) => <h1 className="">Fence No.</h1>,
      enableSorting: false,
    },
    {
      accessorKey: "rows",
      header: ({ column }) => <h1 className="">Rows</h1>,
      enableSorting: false,
    },
    {
      accessorKey: "columns",
      header: ({ column }) => <h1 className="">Columns</h1>,
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <h1 className="text-center">Actions</h1>,
      cell: ({ row }) => {
        const fence = row.original;
        return (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => {
                setRouteData((prev) =>
                  prev.filter(
                    (item) => item?.fence_number !== fence?.fence_number
                  )
                );
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

  useEffect(() => {
    const fetchGeofenceById = async () => {
      try {
        if (geofenceId) {
          const geofenceData = await dispatch(
            getGeofenceById(geofenceId)
          ).unwrap();
          console.log("Fetched Geofence Data:", geofenceData);
          setValue("name", geofenceData?.data?.name);
          setValue("rows", geofenceData?.data?.rows);
          setValue("columns", geofenceData?.data?.columns);
          const respStationPins = [
            {
              id: geofenceData?.data?.station_id,
              lat: geofenceData?.data?.station_latitude,
              lng: geofenceData?.data?.station_longitude,
              type: "station",
            },
          ];
          const respRoutePins = geofenceData?.data?.locations.map((loc) => ({
            id: loc.location_pin_id,
            location_pin_id: loc.location_pin_id,
            lat: loc.latitude,
            lng: loc.longitude,
            type: "route",
          }));
          setStationPins(respStationPins);
          setRoutePins(respRoutePins);
          form.setValue("stationPins", respStationPins);
          form.setValue("routePins", respRoutePins);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchGeofenceById();
  }, [geofenceId]);
  return (
    <div className="flex justify-center p-5 sm:p-10 bg-[--color-avocado-100]">
      <div className="flex flex-col w-full sm:w-[70%] gap-4">
        <div className="content-header text-center">
          <h1 className="text-xl font-bold">Geofence</h1>
        </div>

        <Form {...form} className="w-full">
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, handleError)}
            className="space-y-4"
          >
            <InputCommon
              control={form.control}
              name="name"
              label="Name"
              placeholder="Enter Geofence name"
            />
            {/* <InputCommon
              control={form.control}
              name="rows"
              label="Rows"
              placeholder="Enter Total No. of Panel Rows"
            />
            <InputCommon
              control={form.control}
              name="columns"
              label="Columns"
              placeholder="Enter Total No. of Panel Columns"
            /> */}

            <div className="flex flex-col justify-start mb-2">
              <Button
                type="button"
                variant="link"
                className="flex justify-start items-center gap-2 w-full"
                onClick={() => setShowStationModal(true)}
              >
                <span className="relative w-8 h-8">
                  <Image
                    src="/Images/Location.png"
                    fill
                    alt="Location"
                    className="w-8 h-8 object-cover"
                  />
                </span>
                <span>
                  {geofenceId ? "Update Station" : "Add a Station"}{" "}
                  {stationPins.length > 0 ? "(1 set)" : "(none set)"}
                </span>
              </Button>
              {errors.stationPins && (
                <p className="text-red-500 text-sm pl-5">
                  {errors.stationPins.message}
                </p>
              )}
              {/* <Button
                type="button"
                variant="link"
                className="flex justify-start items-center gap-2 w-full"
                onClick={() => setShowRouteModal(true)}
              >
                <span className="relative w-8 h-8">
                  <Image
                    src="/Images/Location.png"
                    fill
                    alt="Location"
                    className="w-8 h-8 object-cover"
                  />
                </span>
                <span>
                  {geofenceId
                    ? "Update Geofencing points"
                    : "Add Geofencing points"}{" "}
                  ({routePins.length} added)
                </span>
              </Button> */}
              <div className="flex items-center justify-center flex-col py-4">
                <Button
                  type="button"
                  variant="hover-blue-fit"
                  className="flex justify-start items-center gap-2"
                  onClick={() => setShowRouteModal(true)}
                >
                  {/* <span className="relative w-8 h-8">
                  <Image
                    src="/Images/Location.png"
                    fill
                    alt="Location"
                    className="w-8 h-8 object-cover"
                  />
                </span> */}
                  <span>
                    {geofenceId
                      ? "Update Geofencing points"
                      : "Add Geofencing points"}{" "}
                    {/* ({routePins.length} added) */}
                  </span>
                </Button>
                {errors.routePins && (
                  <p className="text-red-500 text-sm pl-5">
                    {errors.routePins.message}
                  </p>
                )}
              </div>
            </div>

            {/* <div className="card relative mx-auto h-44 w-80 sm:h-[16rem] sm:w-[35rem] rounded-lg shadow-xl bg-blue-950 overflow-hidden">
              <InteractiveMap displayOnly={true} pins={allPins} />
            </div> */}
            <div>
              <DataTableCommon
                // filters={filters}
                columns={columns}
                data={routeData}
                // isLoading={drones.isLoading}
                // selectedFilter={selectedFilter}
                // setSelectedFilter={setSelectedFilter}
                // totalDataCount={bankAccountsData.count}
                // onFetchData={(offset, limit) =>
                //   dispatch(getAllBankAccounts({ offset, limit }))
                // }
              />
            </div>
            <Button
              type="submit"
              variant="hover-blue-full"
              isLoading={geofence.isPostLoading}
              className="!mt-10"
            >
              {geofenceId ? "Update Geofence" : "Add Geofence"}
            </Button>
          </form>
        </Form>

        {/* Station Modal */}
        <FullScreenMapModal
          isOpen={showStationModal}
          onClose={() => setShowStationModal(false)}
          onSave={handleStationPins}
          title="Add Station"
          mode="station"
          existingPins={stationPins}
        />

        {/* Route Modal */}
        <FullScreenMapRouteModal
          isOpen={showRouteModal}
          onClose={() => setShowRouteModal(false)}
          onSave={handleRouteData}
          title="Add Geofencing Points"
          mode="route"
          // existingPins={routePins}
          handleDeletePins={handleDeletePins}
        />
      </div>
    </div>
  );
};

export default AddGeofence;
