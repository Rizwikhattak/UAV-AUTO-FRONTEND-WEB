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
import {
  getMissionPlanById,
  insertMissionPlan,
  updateMissionPlan,
} from "@/store/Actions/planMissionActions";
import {
  ComboboxCommon,
  DateTimePickerCommon,
  InputCommon,
  SelectCommon,
} from "@/components/common/FormCommons";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { getAllGeofences } from "@/store/Actions/geofenceActions";
import { ROUTES } from "@/utils/constants";

export default function AddMissionPlan() {
  const params = useParams();
  const missionPlanId = params.id;
  console.log("Mission Plan ID:", missionPlanId);
  const dispatch = useDispatch();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  console.log("CAAAAALLLLLEEEEED");
  // Example: Suppose you have slices for geofence, drone, operator
  const geofence = useSelector((state) => state.geofence);
  const drones = useSelector((state) => state.drone);
  const operatorState = useSelector((state) => state.operator);
  const mission = useSelector((state) => state.planMission);
  const router = useRouter();

  // Example initial form values
  const now = new Date();
  let initialState = {
    name: "",
    geofence_id: "",
    time: now, // Using single time field for the new DateTimePickerCommon
    status: "active",
    drone_id: "",
  };

  // Setup React Hook Form with the mission schema
  const form = useForm({
    resolver: zodResolver(addMissionSchema),
    defaultValues: initialState,
  });

  // Fetch any data you need for dropdowns
  useEffect(() => {
    dispatch(getAllGeofences());
    dispatch(getAllDrones());
  }, [dispatch]);
  useEffect(() => {
    const fetchMissionPlanById = async () => {
      if (missionPlanId) {
        try {
          const response = await dispatch(
            getMissionPlanById(missionPlanId)
          ).unwrap();
          console.log("Fetched Mission Plan:", response);

          // Helper function to safely parse date
          const parseDateTime = (dateStr, timeStr) => {
            if (!dateStr || !timeStr) return new Date(); // fallback to current date

            try {
              // Convert DD-MM-YYYY to YYYY-MM-DD format
              const dateParts = dateStr.split("-");
              if (dateParts.length !== 3) {
                console.warn("Invalid date format, expected DD-MM-YYYY");
                return new Date();
              }

              const [day, month, year] = dateParts;
              const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0"
              )}`;

              // Convert 12-hour time to 24-hour format
              const convertTo24Hour = (time12h) => {
                const [time, modifier] = time12h.split(" ");
                let [hours, minutes, seconds] = time.split(":");

                if (hours === "12") {
                  hours = "00";
                }

                if (modifier === "PM") {
                  hours = parseInt(hours, 10) + 12;
                }

                return `${hours.padStart(2, "0")}:${minutes}:${
                  seconds || "00"
                }`;
              };

              const time24h = convertTo24Hour(timeStr);
              const isoString = `${isoDate}T${time24h}`;

              console.log("Parsed ISO string:", isoString);
              const parsedDate = new Date(isoString);

              // Check if date is valid
              if (isNaN(parsedDate.getTime())) {
                console.warn(
                  "Invalid date parsed, using current date as fallback"
                );
                return new Date();
              }

              return parsedDate;
            } catch (error) {
              console.error("Error parsing date:", error);
              return new Date(); // fallback to current date
            }
          };

          // Reset form with fetched data
          form.reset({
            name: response?.data?.name || "",
            geofence_id: response?.data?.route_id || "",
            time: parseDateTime(
              response?.data?.start_date,
              response?.data?.start_time
            ),
            drone_id: response?.data?.drone_id || "",
          });
        } catch (error) {
          console.error("Error fetching mission plan:", error);
        }
      }
    };
    fetchMissionPlanById();
  }, [dispatch, missionPlanId]);

  // Submit handler for immediate mission
  const handleFormSubmit = async (data) => {
    try {
      console.log("Mission Form Submitted:", data);
      data.admin_id = 1;
      data.status = "active"; // Set status to active for immediate mission
      // Convert time field to separate start_date and start_time for API
      if (data.time) {
        data.start_date = data.time.toISOString().slice(0, 10);
        data.start_time = data.time.toTimeString().slice(0, 5);
      }

      const resp = missionPlanId
        ? await dispatch(
            updateMissionPlan({
              ...data,
              id: missionPlanId,
              route_id: data.geofence_id,
            })
          ).unwrap()
        : await dispatch(
            insertMissionPlan({ ...data, route_id: data.geofence_id })
          ).unwrap();
      router.push(`${ROUTES.MISSION_PANEL_MAP}/${resp?.data?.id}`);
      form.reset(initialState);
    } catch (err) {
      console.log("Error adding mission:", err);
    }
  };

  // Submit handler for scheduled mission
  const handleScheduledSubmit = async () => {
    try {
      // Get current form values
      const formData = form.getValues();

      // Validate the form
      const isValid = await form.trigger();
      if (!isValid) {
        console.log("Form validation failed");
        return;
      }

      console.log("Scheduled Mission Form Submitted:", formData);
      formData.admin_id = 1;
      formData.status = "pending"; // Change status to scheduled

      // Convert time field to separate start_date and start_time for API
      if (formData.time) {
        formData.start_date = formData.time.toISOString().slice(0, 10);
        formData.start_time = formData.time.toTimeString().slice(0, 5);
      }

      const resp = missionPlanId
        ? await dispatch(
            updateMissionPlan({
              ...formData,
              id: missionPlanId,
              route_id: formData.geofence_id,
            })
          ).unwrap()
        : await dispatch(
            insertMissionPlan({ ...formData, route_id: formData.geofence_id })
          ).unwrap();

      router.push(ROUTES.HOME);
      form.reset(initialState);
      setIsScheduleModalOpen(false);
    } catch (err) {
      console.log("Error scheduling mission:", err);
    }
  };

  const handleError = (errors) => {
    console.log("Validation Errors:", errors);
  };

  const handleScheduleClick = () => {
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="flex flex-col justify-center items-center p-10 h-screen bg-[--color-avocado-100]">
      <div className="flex flex-col sm:w-[70%] gap-4">
        <div className="content-header text-center">
          <h1 className="text-xl font-bold">
            {missionPlanId ? "Update Mission" : "Plan Mission"}
          </h1>
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

            <ComboboxCommon
              control={form.control}
              name="geofence_id"
              label="Geofence"
              items={geofence.data}
              isLoading={geofence.isLoading}
              placeholder="Select Geofence"
            />

            <ComboboxCommon
              control={form.control}
              name="drone_id"
              label="Drones"
              items={drones.data}
              isLoading={drones.isLoading}
              placeholder="Select drone"
            />

            <Button
              type="submit"
              variant="hover-blue-full"
              isLoading={mission.isPostLoading}
            >
              Commence Now
            </Button>

            <Button
              type="button"
              variant="hover-blue-full"
              onClick={handleScheduleClick}
            >
              Schedule for later
            </Button>
          </form>
        </Form>

        {/* Schedule Modal */}
        <Dialog
          open={isScheduleModalOpen}
          onOpenChange={setIsScheduleModalOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule Mission</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {/* Wrap the DateTimePickerCommon with Form context */}
              <Form {...form}>
                <DateTimePickerCommon
                  form={form}
                  control={form.control}
                  name="time"
                  label="Schedule Date & Time"
                  placeholder="Select date and time"
                />
              </Form>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsScheduleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="hover-blue-full"
                onClick={handleScheduledSubmit}
                isLoading={mission.isPostLoading}
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
