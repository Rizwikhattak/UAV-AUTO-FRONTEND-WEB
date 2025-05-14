"use client";
import {
  CardInputCommon,
  ComboboxCommon,
  SelectCommon,
} from "@/components/common/FormCommons";
import InputCommon from "@/components/common/InputCommon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { addDroneSchema } from "@/pages/Drone/DroneSchema";
import { addDrone } from "@/store/Actions/droneActions";
import { getAllStations } from "@/store/Actions/stationActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
const AddDronePage = () => {
  const drone = useSelector((state) => state.drone);
  const dispatch = useDispatch();
  const station = useSelector((state) => state.station);
  const initialState = {
    name: "",
    speed: "",
    flight_duration: "",
    ceiling: "",
    fps: "",
    station_id: "",
    image: "",
  };
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(addDroneSchema),
    defaultValues: initialState,
  });

  useEffect(() => {
    dispatch(getAllStations());
  }, [dispatch]);

  const handleFormSubmit = async (data) => {
    try {
      console.log("Form Submitted:", data);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await dispatch(addDrone(formData)).unwrap();
      router.push("/home");
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleError = (errors) => {
    console.log("Validation Errors:", errors);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        // key={router.route}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex justify-center p-10 bg-[--color-avocado-100]"
      >
        <div className="flex flex-col w-full lg:w-[60%] gap-4">
          <div className="content-header text-center">
            <h1 className="text-xl font-bold">Add New Drone</h1>
            <p>
              Configure and Deploy Your Drone for Optimal Mission Performance
            </p>
          </div>
          <Form {...form} className="w-full">
            <form
              onSubmit={form.handleSubmit(handleFormSubmit, handleError)}
              className="space-y-4"
            >
              <CardInputCommon control={form.control} />
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12">
                  <InputCommon
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Enter the drone's name"
                  />
                </div>
                <div className="col-span-6">
                  <InputCommon
                    control={form.control}
                    inputType="text"
                    name="speed"
                    label="Speed (km/h)"
                    placeholder="e.g 40"
                  />
                </div>
                <div className="col-span-6">
                  <InputCommon
                    control={form.control}
                    inputType="text"
                    name="flight_duration"
                    label="Flight Duration (hrs)"
                    placeholder="e.g 4"
                  />
                </div>
                <div className="col-span-6">
                  <InputCommon
                    control={form.control}
                    inputType="text"
                    name="ceiling"
                    label="Ceiling (meters)"
                    placeholder="e.g 40"
                  />
                </div>
                <div className="col-span-6">
                  <InputCommon
                    control={form.control}
                    inputType="text"
                    name="fps"
                    label="FPS"
                    placeholder="e.g 60"
                  />
                </div>
                <div className="col-span-12">
                  <ComboboxCommon
                    control={form.control}
                    name="station_id"
                    label="stations"
                    items={station.data}
                    isLoading={station.isLoading}
                    placeholder="Select Station"
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="hover-blue-full"
                isLoading={drone.isPostLoading}
              >
                Add Drone
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </AnimatePresence>
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
export default AddDronePage;
