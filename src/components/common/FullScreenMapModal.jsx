import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import InteractiveMap from "./InteractiveMap";
import ModalCommon from "@/components/common/ModalCommon";

const FullScreenMapModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  mode = "route",
  existingPins = [],
  handleDeletePins = () => {}, // Function to handle pin deletion
}) => {
  const [pins, setPins] = useState(existingPins);

  useEffect(() => {
    setPins(existingPins);
  }, [existingPins, isOpen]);

  const handleSave = () => {
    onSave(pins);
  };

  const handlePinsChange = (newPins) => {
    setPins(newPins);
  };

  return (
    <>
      <ModalCommon
        open={isOpen}
        onOpenChange={onClose}
        ModalStyle="sm:max-w-[40rem] max-h-[80vh] w-full h-full  "
        DialogHeaderComponent={
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-blue-800 bg-blue-50 p-3 rounded-md">
                {mode === "station"
                  ? "Click on the map to add station locations. Click on existing pins to remove them."
                  : "Click on the map to add geofencing points. Click on existing pins to remove them."}
              </DialogDescription>
            </div>
            {/* <Button
              onClick={handleSave}
              className="flex items-center gap-2 ml-4"
              variant="hover-blue-fit"
            >
              <Save size={16} />
              Save ({pins.length})
            </Button> */}
          </div>
        }
        DialogFotterComponent={
          <DialogFooter className=" pb-1 pt-6 sm:p-4 border-t bg-white flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {pins.length} {mode === "station" ? "station" : "geofencing"}{" "}
              point
              {pins.length !== 1 ? "s" : ""} added
            </span>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
                variant="hover-blue-fit"
              >
                <Save size={16} />
                Save Points
              </Button>
            </div>
          </DialogFooter>
        }
      >
        <div className="flex-1 h-[25vh]  sm:h-[40vh] py-4">
          <InteractiveMap
            displayOnly={false}
            pins={pins}
            onPinsChange={handlePinsChange}
            mode={mode}
            handleDeletePins={handleDeletePins}
          />
        </div>
      </ModalCommon>
    </>
  );
};

export default FullScreenMapModal;
