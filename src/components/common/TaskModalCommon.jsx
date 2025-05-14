import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { InputCommon, DatePickerCommon, SelectCommon } from "./FormCommons";
import { Button } from "../ui/button";

const TaskModalCommon = ({
  openDialog,
  setOpenDialog,
  toggleEditMode = () => {},
  form,
  onFormSubmit,
  selectDropdownItems = [
    {
      name: "OFFICE SUPPLIES",
      value: "officeSupplies",
    },
    {
      name: "SUPPLIES",
      value: "supplies",
    },
  ],
}) => {
  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpenDialog(false);
        }
        toggleEditMode();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <div className="grid gap-4 py-4">
              <InputCommon
                control={form.control}
                name="supplierName"
                label="Name"
                className="!w-full"
                placeholder="Enter Your Full Name"
                formType="card"
              />
              <InputCommon
                control={form.control}
                inputType="number"
                name="amount"
                label="Amount"
                className="!w-full"
                placeholder="Enter Amount"
                formType="card"
              />
              <DatePickerCommon
                id="date"
                name="date"
                selected={form.watch("date")} // Watch ensures correct value display
                onChange={(date) => form.setValue("date", date)}
                formType="card"
              />
              <SelectCommon
                control={form.control}
                name="tag"
                label="Tag"
                items={selectDropdownItems}
                formType="card"
                className="w-full"
                placeholder="Select a tag"
              />
            </div>

            <DialogFooter>
              <Button variant="hover-blue-full" type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModalCommon;
