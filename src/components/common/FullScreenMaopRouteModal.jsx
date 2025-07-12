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
import { Form } from "@/components/ui/form";
import { InputCommon } from "@/components/common/FormCommons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fenceSchema } from "@/components/GeoFence/GeofenceSchema";

const FullScreenMapRouteModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  mode = "route",
  existingPins = [],
  handleDeletePins = () => {}, // Function to handle pin deletion
}) => {
  const [pins, setPins] = useState(existingPins);
  const initialState = {
    rows: "",
    columns: "",
  };
  const form = useForm({
    defaultValues: initialState,
    resolver: zodResolver(fenceSchema),
  });
  // useEffect(() => {
  //   setPins(existingPins);
  // }, [existingPins, isOpen]);

  const handleSave = () => {
    const rows = form.getValues("rows");
    const cols = form.getValues("columns");
    setPins([]);
    form.reset();
    onSave(pins, rows, cols);
  };

  const handlePinsChange = (newPins) => {
    setPins(newPins);
  };
  const handleFormSubmit = (data) => {
    console.log(data);
    handleSave();
  };
  const handleFormError = (err) => {
    console.error(err);
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
        // DialogFotterComponent={
        //   <DialogFooter className=" pb-1 pt-6 sm:p-4 border-t bg-white flex justify-between items-center">
        //     <span className="text-sm text-gray-600">
        //       {pins.length} {mode === "station" ? "station" : "geofencing"}{" "}
        //       point
        //       {pins.length !== 1 ? "s" : ""} added
        //     </span>
        //     <div className="flex gap-2">
        //       <Button onClick={onClose} variant="outline">
        //         Cancel
        //       </Button>
        //       <Button
        //         onClick={handleSave}
        //         className="flex items-center gap-2"
        //         variant="hover-blue-fit"
        //       >
        //         <Save size={16} />
        //         Save Points
        //       </Button>
        //     </div>
        //   </DialogFooter>
        // }
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)}
            className="pt-10"
          >
            <InputCommon
              control={form.control}
              name="rows"
              label="Rows"
              placeholder="Enter Total No. of Panel Rows"
            />
            <InputCommon
              control={form.control}
              name="columns"
              label="Columns"
              placeholder="Enter Total No. of Panel Columns"
            />
            <div className=" pb-1 pt-6 sm:p-4 border-t bg-white flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {pins.length} {mode === "station" ? "station" : "geofencing"}{" "}
                point
                {pins.length !== 1 ? "s" : ""} added
              </span>
              <div className="flex gap-2">
                <Button onClick={onClose} variant="outline" type="button">
                  Cancel
                </Button>
                <Button
                  // onClick={handleSave}
                  type="submit"
                  className="flex items-center gap-2"
                  variant="hover-blue-fit"
                >
                  <Save size={16} />
                  Save Points
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </ModalCommon>
    </>
  );
};

export default FullScreenMapRouteModal;
