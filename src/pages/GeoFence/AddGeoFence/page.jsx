"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllStations } from "@/store/Actions/stationActions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { addDrone } from "@/store/Actions/droneActions";
import Spinner from "@/components/common/SpinnerCommon";
import { InputCommon } from "@/components/common/FormCommons";
import InteractiveMap from "@/components/common/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import { geofenceSchema } from "@/pages/GeoFence/GeofenceSchema";
const AddGeofence = () => {
  const drone = useSelector((state) => state.drone);
  const dispatch = useDispatch();
  const [inputImage, setInputImage] = useState(null);
  const station = useSelector((state) => state.station);
  console.log("Stationnnnnnnnnnnnnnnn:", station);
  const initialState = {
    name: "",
    speed: "",
    flight_duration: "",
    ceiling: "",
    fps: "",
    station_id: "",
    image: "",
  };

  const form = useForm({
    resolver: zodResolver(geofenceSchema),
    defaultValues: initialState,
  });

  // useEffect(() => {
  //   dispatch(getAllStations());
  // }, [dispatch]);
  console.log("Stations", station);

  const handleFormSubmit = async (data) => {
    try {
      console.log("Form Submitted:", data);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await dispatch(addDrone(formData)).unwrap();
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleError = (errors) => {
    console.log("Validation Errors:", errors);
  };

  return (
    <div className="flex justify-center p-5 sm:p-10 bg-[--color-avocado-100]">
      <div className="flex flex-col w-full sm:w-[70%] gap-4">
        <div className="content-header text-center">
          <h1 className="text-xl font-bold">Geofence</h1>

          {/* <p>Configure and Deploy Your Drone for Optimal Mission Performance</p> */}
        </div>
        <Form {...form} className="w-full">
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, handleError)}
            className="space-y-4"
          >
            {/* <CardInputCommon control={form.control} /> */}
            <InputCommon
              control={form.control}
              name="name"
              label="Name"
              placeholder="Enter Geofence name"
            />
            <div className="flex flex-col justify-start mb-2">
              <Button
                variant="link"
                className="flex justify-start items-center gap-2 w-full"
              >
                <span className="relative w-8 h-8">
                  <Image
                    src="/Images/Location.png"
                    fill
                    alt="Location"
                    className="w-8 h-8 object-cover"
                  />
                </span>
                <span>Add a Station</span>
              </Button>
              <Button
                variant="link"
                className="flex justify-start items-center gap-2 w-full"
              >
                <span className="relative w-8 h-8">
                  <Image
                    src="/Images/Location.png"
                    fill
                    alt="Location"
                    className="w-8 h-8 object-cover"
                  />
                </span>
                <span>Add Geofencing points</span>
              </Button>
            </div>

            <div className="card relative mx-auto h-44 w-80 rounded-lg shadow-xl bg-blue-950">
              <InteractiveMap />
            </div>

            <Button
              type="submit"
              variant={drone.loading ? "outline-full" : "hover-blue-full"}
              disabled={drone.loading}
              className="!mt-10"
            >
              {drone.loading ? <Spinner /> : "Add Geofence"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
const stationDropDownItems = [
  {
    name: "Shamsabad Station",
    value: "shamsabadStation",
  },
  {
    name: "Rehmanabad Station",
    value: "rehmanabadStation",
  },
  {
    name: "6th Road Station",
    value: "sixthRoadStation",
  },
];
export default AddGeofence;
