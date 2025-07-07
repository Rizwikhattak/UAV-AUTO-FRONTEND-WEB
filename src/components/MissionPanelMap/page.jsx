"use client";
import { InputCommon } from "@/components/common/FormCommons";
import { addMissionPanelMapSchema } from "@/components/MissionPanelMap/MissionPanelMapSchema";
import ShowMissionPanelMap from "@/components/MissionPanelMap/ShowMissionPanelMap";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  getMissionPanelMaps,
  insertMissionPanelMap,
} from "@/store/Actions/missionPanelMapActions";
import { ROUTES } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const MissionPanelMap = () => {
  const params = useParams();
  const missionPlannerId = params.id;
  const missionPanelMap = useSelector((state) => state.missionPanelMap);
  const dispatch = useDispatch();
  const router = useRouter();
  const initialState = {
    solar_row: null,
    solar_column: null,
    solar_watts: null,
    solar_frame_no: null,
  };
  const form = useForm({
    defaultValues: initialState,
    resolver: zodResolver(addMissionPanelMapSchema),
  });

  const handleFormSubmit = async (data) => {
    console.log("data", data);
    try {
      await dispatch(
        insertMissionPanelMap({ ...data, mission_planner_id: missionPlannerId })
      ).unwrap();
      dispatch(getMissionPanelMaps(missionPlannerId));
    } catch (err) {
      console.error(err);
    }
  };
  const handleFormError = (err) => {
    console.error(err);
  };
  const handleNext = () => {
    if (missionPanelMap.lenght <= 0)
      return toast.error("Please add mission panel map first");
    router.push(`${ROUTES.ACTIVE_MISSION_PLAN}/${missionPlannerId}`);
  };
  return (
    <div className="min-h-screen py-10">
      <div className="px-10">
        <h1 className="font-semibold text-center text-3xl mb-12">Add Watts</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)}
            className="flex items-center flex-col gap-5"
          >
            <div className="flex justify-center gap-3">
              <InputCommon
                name="solar_row"
                control={form.control}
                label="Row"
                placeholder="Enter Rows"
                className="sm:!w-80"
              />
              <InputCommon
                name="solar_column"
                control={form.control}
                label="Column"
                placeholder="Enter Columns"
                className="sm:!w-80"
              />
            </div>
            <div className="flex justify-center gap-3">
              <InputCommon
                name="solar_watts"
                control={form.control}
                label="Watts"
                placeholder="Enter Watts"
                className="sm:!w-80"
              />
              <InputCommon
                name="solar_frame_no"
                control={form.control}
                label="Fame No."
                placeholder="Enter Frame No."
                className="sm:!w-80"
              />
            </div>
            <Button
              type="submit"
              variant="hover-blue-fit"
              className="sm:!w-28 text-lg mt-4"
              isLoading={missionPanelMap.isPostLoading}
            >
              Add
            </Button>
          </form>
        </Form>
      </div>
      <ShowMissionPanelMap />

      <div className="flex items-center justify-center">
        <Button
          variant="hover-blue-fit"
          className="sm:!w-64 text-lg"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MissionPanelMap;
