// ModalCommon.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Props:
 * - open: boolean (controls whether the dialog is open or closed)
 * - onOpenChange: function (called when the dialog should open/close)
 * - headerTitle, headerDescription, ModalStyle, children, etc.
 */
const ModalCommon = ({
  open,
  onOpenChange,
  headerTitle,
  onCloseData,
  headerDescription,
  ModalStyle = "",
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[425px] ", ModalStyle)}
        onOpenChange={onOpenChange}
        onCloseData={onCloseData}
        onInteractOutside={(e) => {
          //Prevents modals from closing when clicked outside
          // e.preventDefault();
        }}
      >
        <DialogHeader className="">
          <DialogTitle>{headerTitle}</DialogTitle>
          <DialogDescription>{headerDescription}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCommon;
