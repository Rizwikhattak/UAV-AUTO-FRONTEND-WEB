import ModalCommon from "@/components/common/ModalCommon";
import { Button } from "@/components/ui/button";
import {
  handleMissionAbort,
  updateMissionPlan,
} from "@/store/Actions/planMissionActions";
import { ROUTES } from "@/utils/constants";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const ComenceNowDialogue = ({ mission }) => {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const [isAbortLoading, setIsAbortLoading] = useState(false);
  const [isComenceNowLoading, setIsComenceNowLoading] = useState(false);
  const router = useRouter();
  const handleAbort = async () => {
    try {
      setIsAbortLoading(true);
      await dispatch(handleMissionAbort(mission.id)).unwrap();
      setIsAbortLoading(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleComenceNow = async () => {
    try {
      await dispatch(
        updateMissionPlan({
          id: mission.id,
          status: "completed",
        })
      ).unwrap();
      return router.push(`${ROUTES.ACTIVE_MISSION_PLAN}/${mission.id}`);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <ModalCommon
        open={open}
        onOpenChange={setOpen}
        headerTitle="Scheduled Mission"
        headerDescription={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p>{mission?.name}</p>
              <p>{mission?.start_date}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>{mission?.start_time}</p>
              <p>{mission?.status}</p>
            </div>
          </div>
        }
      >
        <div className="flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={handleAbort}
            isLoading={isAbortLoading}
          >
            Abort
          </Button>
          <Button variant="hover-blue-fit" onClick={handleComenceNow}>
            Comence Now
          </Button>
        </div>
      </ModalCommon>
    </>
  );
};

export default ComenceNowDialogue;
