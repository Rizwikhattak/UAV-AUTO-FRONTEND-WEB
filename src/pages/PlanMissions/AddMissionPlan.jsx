"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMissionSchema } from "./PlanMissionSchema";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/common/SpinnerCommon";
import { getAllStations } from "@/store/Actions/stationActions";
import { getAllDrones } from "@/store/Actions/droneActions";
import { getAllOperators } from "@/store/Actions/operatorActions";
import { addMissionPlan } from "@/store/Actions/planMissionActions";
import {
  DateTimePickerCommon,
  InputCommon,
  SelectCommon,
} from "@/components/common/FormCommons";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function AddMissionPlan() {
  const dispatch = useDispatch();
  console.log("CAAAAALLLLLEEEEED");
  // Example: Suppose you have slices for station, drone, operator
  const station = useSelector((state) => state.station);
  const droneState = useSelector((state) => state.drone);
  const operatorState = useSelector((state) => state.operator);
  const mission = useSelector((state) => state.planMission);
  const router = useRouter();
  // Example initial form values
  let initialState = {
    name: "",
    departure_station_id: "",
    landing_station_id: "",
    start_date: "",
    start_time: "",
    status: "not set",
    drone_id: "",
    operator_id: "",
  };

  // Setup React Hook Form with the mission schema
  const form = useForm({
    resolver: zodResolver(addMissionSchema),
    defaultValues: initialState,
  });

  // Fetch any data you need for dropdowns
  useEffect(() => {
    dispatch(getAllStations());
    dispatch(getAllDrones());
    dispatch(getAllOperators());
  }, [dispatch]);

  // Submit handler
  const handleFormSubmit = async (data) => {
    try {
      console.log("Mission Form Submitted:", data);
      // If your API expects FormData, create it:
      // const formData = new FormData();
      // Object.entries(data).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });
      // await dispatch(addMissionPlan(formData)).unwrap();

      // Otherwise, if a simple JSON POST is fine:
      data.admin_id = 1;
      await dispatch(addMissionPlan(JSON.stringify(data))).unwrap();
      // Then reset to your initial form defaults
      form.reset({
        name: "",
        departure_station_id: "",
        landing_station_id: "",
        start_date: "",
        start_time: "",
        status: "not set",
        drone_id: "",
        operator_id: "",
      });

      // initialState = { ...initialState };
    } catch (err) {
      console.log("Error adding mission:", err);
    }
  };

  const handleError = (errors) => {
    console.log("Validation Errors:", errors);
  };
  const stationData = [
    {
      name: "CUST SOLAR PANEL FARM",
      value: "CUST SOLAR PANEL FARM",
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center p-10 h-screen bg-[--color-avocado-100]">
      <div className="flex  flex-col sm:w-[70%] gap-4">
        <div className="content-header text-center">
          <h1 className="text-xl font-bold">Plan Mission</h1>
          {/* <p>Plan and schedule your next mission efficiently.</p> */}
        </div>

        <Form {...form} className="w-full">
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, handleError)}
            className="space-y-4"
          >
            {/* Mission Name */}
            <InputCommon
              control={form.control}
              name="name"
              label="Mission Name"
              placeholder="Enter mission name"
            />

            {/* Departure Station */}
            {/* {station.isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : ( */}
            <SelectCommon
              control={form.control}
              name="departure_station_id"
              style="!rounded-full w-full"
              label="Geofences"
              items={stationData} // e.g., { id, name } objects
              placeholder="Select Geofence"
            />
            {/* )} */}

            {/* Landing Station */}
            {/* {station.isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <SelectCommon
                control={form.control}
                name="landing_station_id"
                label="Landing Station"
                items={station.data} // same or different data as needed
                placeholder="Select landing station"
              />
            )} */}

            {/* <DateTimePickerCommon control={form.control} name="start_date" /> */}
            {/* {droneState.isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : ( */}
            <SelectCommon
              control={form.control}
              name="drone_id"
              style="!rounded-full w-full"
              label="Drones"
              items={drones} // e.g., { id, name } objects
              placeholder="Select drone"
            />
            {/* )} */}

            {/* Operator */}
            {/* {operatorState.isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <SelectCommon
                control={form.control}
                name="operator_id"
                label="Operator"
                items={operatorState.data} // e.g., { id, name } objects
                placeholder="Assign to operator"
              />
            )} */}

            <Button
              type="button"
              onClick={() => router.push("/missionPlan/ActiveMission")}
              variant={mission.isLoading ? "outline-full" : "hover-blue-full"}
              disabled={mission.isLoading}
            >
              {mission.isLoading ? <Spinner /> : "Commence Now"}
            </Button>
            <Button
              type="submit"
              variant={mission.isLoading ? "outline-full" : "hover-blue-full"}
              disabled={mission.isLoading}
            >
              {mission.isLoading ? <Spinner /> : "Schedule for later"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
const drones = [
  {
    image: "/Images/dashboard_drone.png",
    name: "Phantom X7",
    value: "Phantom X7",
    speed: "90km/h",
    flightDuration: "1.5h",
    ceiling: "100m",
  },
  {
    image: "/Images/Drone_1.png",

    name: "Falcon Pro",
    value: "Falcon Pro",
    speed: "85km/h",
    flightDuration: "2h",
    ceiling: "300m",
  },
  {
    image: "/Images/Drone_2.png",
    name: "Eagle Eye",
    value: "Eagle Eye",
    speed: "70km/h",
    flightDuration: "1h",
    ceiling: "200m",
  },
  {
    image: "/Images/Drone_3.png",

    name: "Swift Hawk",
    value: "Swift Hawk",
    speed: "65km/h",
    flightDuration: "2h",
    ceiling: "350m",
  },
];
