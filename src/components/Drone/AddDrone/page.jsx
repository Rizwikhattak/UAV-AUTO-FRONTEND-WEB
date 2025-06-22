"use client";
import {
  CardInputCommon,
  ComboboxCommon,
  SelectCommon,
} from "@/components/common/FormCommons";
import InputCommon from "@/components/common/InputCommon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { insertDroneSchema } from "@/components/Drone/DroneSchema";
import {
  getDroneById,
  insertDrone,
  updateDrone,
} from "@/store/Actions/droneActions";
import { getAllStations } from "@/store/Actions/stationActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import { SET_IMAGE_URL } from "@/utils/Helpers";
const InsertDronePage = () => {
  const params = useParams();
  const droneId = params.id;
  const drone = useSelector((state) => state.drone);
  console.log("Drone Data:", drone);
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
    resolver: zodResolver(insertDroneSchema),
    defaultValues: initialState,
  });

  useEffect(() => {
    dispatch(getAllStations());
  }, [dispatch]);
  useEffect(() => {
    const fetchDroneById = async () => {
      if (droneId) {
        try {
          const response = await dispatch(getDroneById(droneId)).unwrap();
          console.log(response);
          form.reset({
            name: response?.data?.name || "",
            speed: response?.data?.speed || "",
            flight_duration: response?.data?.flight_duration || "",
            ceiling: response?.data?.ceiling || "",
            fps: response?.data?.fps || "",
            station_id: response?.data?.station_id || "",
            image: SET_IMAGE_URL(response?.data?.image_path) || "",
          });
          console.log("Fetched Drone Data:", drone);
        } catch (err) {
          console.error("Error fetching drone by ID:", err);
        }
      }
    };
    fetchDroneById();
  }, [droneId, dispatch]);
  const handleFormSubmit = async (data) => {
    try {
      console.log("Form Submitted:", data);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      droneId
        ? await dispatch(updateDrone({ id: droneId, formData })).unwrap()
        : await dispatch(insertDrone(formData)).unwrap();
      router.push(ROUTES.HOME);
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
            <h1 className="text-xl font-bold">
              {droneId ? "Update Drone" : "Add New Drone"}
            </h1>
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
                {droneId ? "Update Drone" : "Add Drone"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default InsertDronePage;
