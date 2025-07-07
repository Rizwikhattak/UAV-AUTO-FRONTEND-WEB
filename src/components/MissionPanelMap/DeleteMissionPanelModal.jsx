import ModalCommon from "@/components/common/ModalCommon";
import { Button } from "@/components/ui/button";
import {
  deleteMissionPanelMap,
  getMissionPanelMaps,
} from "@/store/Actions/missionPanelMapActions";
import { useParams } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const DeleteMissionPanelModal = ({ open, onOpenChange, panelId }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const missionPanelMap = useSelector((state) => state.missionPanelMap);
  const handleDeletePanelMap = async () => {
    try {
      await dispatch(deleteMissionPanelMap(panelId)).unwrap();
      await dispatch(getMissionPanelMaps(params.id)).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      onOpenChange(false);
    }
  };
  return (
    <>
      <ModalCommon
        open={open}
        onOpenChange={onOpenChange}
        headerTitle="Delete Panel Map"
        headerDescription="Are you sure u want to delete this panel map?"
      >
        <div className="flex items-center justify-between pt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleDeletePanelMap}
            variant="destructive"
            isLoading={missionPanelMap.isPostLoading}
          >
            Delete
          </Button>
        </div>
      </ModalCommon>
    </>
  );
};

export default DeleteMissionPanelModal;
