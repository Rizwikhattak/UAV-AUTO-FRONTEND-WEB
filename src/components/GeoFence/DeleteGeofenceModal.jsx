import ModalCommon from "@/components/common/ModalCommon";
import { Button } from "@/components/ui/button";
import React from "react";

const DeleteGeofenceModal = ({
  openDeleteModal,
  setOpenDeleteModal,
  selectedGeofence,
  handleGeofenceDelete,
  isLoading,
}) => {
  return (
    <ModalCommon
      open={openDeleteModal}
      onOpenChange={setOpenDeleteModal}
      headerTitle="Delete Drone"
      headerDescription={`Are you sure you want to delete "${selectedGeofence?.name}"?`}
      DialogFotterComponent={
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleGeofenceDelete}
            isLoading={isLoading}
          >
            Confirm Delete
          </Button>
        </div>
      }
    />
  );
};

export default DeleteGeofenceModal;
