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
import { Upload } from "lucide-react";

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
    <div className="flex justify-center items-center p-10 h-screen bg-[--color-avocado-100]">
      <div className="flex  flex-col sm:w-[70%] gap-4">
        <div className="content-header text-center space-y-4">
          <h1 className="text-xl font-bold">Upload Video</h1>
          {/* <p>Plan and schedule your next mission efficiently.</p> */}
          <Button
            type="button"
            onClick={() => router.push("/missionPlan/ActiveMission")}
            variant={mission.isLoading ? "outline-full" : "hover-blue-full"}
            disabled={mission.isLoading}
            className="flex items-center gap-1"
          >
            <span>
              <Upload />
            </span>
            <span> Upload Video</span>
          </Button>
        </div>
        {/* === Mission-summary table ===================================== */}
        <div className="p-8 mx-auto">
          <div className="border-2 border-black inline-block">
            <table className="border-collapse">
              <tbody>
                <tr>
                  <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                    Clean
                  </td>
                  <td className="border border-black px-4 py-3 w-24"></td>
                  <td className="border border-black px-4 py-3 w-24"></td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                    Dusty
                  </td>
                  <td className="border border-black px-4 py-3 w-24"></td>
                  <td className="border border-black px-4 py-3 w-24"></td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                    Damage
                  </td>
                  <td className="border border-black px-4 py-3 w-24"></td>
                  <td className="border border-black px-4 py-3 w-24"></td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                    Total
                  </td>
                  <td className="border border-black px-4 py-3 w-24"></td>
                  <td className="border border-black px-4 py-3 w-24"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <Button
            type="button"
            variant={mission.isLoading ? "outline-full" : "hover-blue-full"}
            disabled={mission.isLoading}
          >
            {mission.isLoading ? <Spinner /> : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
