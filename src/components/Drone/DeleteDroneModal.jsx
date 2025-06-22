import ModalCommon from "@/components/common/ModalCommon";
import { Button } from "@/components/ui/button";
import React from "react";

const DeleteDroneModal = ({
  openDeleteModal,
  setOpenDeleteModal,
  selectedDrone,
  handleDroneDelete,
  isLoading,
}) => {
  return (
    <ModalCommon
      open={openDeleteModal}
      onOpenChange={setOpenDeleteModal}
      headerTitle="Delete Drone"
      headerDescription={`Are you sure you want to delete "${selectedDrone?.name}"?`}
      DialogFotterComponent={
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDroneDelete}
            isLoading={isLoading}
          >
            Confirm Delete
          </Button>
        </div>
      }
    />
  );
};

export default DeleteDroneModal;
