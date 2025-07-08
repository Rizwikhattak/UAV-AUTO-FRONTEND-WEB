"use client";
import { DatePickerCommon } from "@/components/common/FormCommons";
import { PlanMaintenanceSchema } from "@/components/PlanMaintenance/PlanMaintenanceSchema";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const PlanMaintenance = () => {
  const initialState = {
    date_from_damaged: "",
    date_to_damaged: "",
    date_from_dusty: "",
    date_to_dusty: "",
  };
  const form = useForm({
    defaultValues: initialState,
    resolver: zodResolver(PlanMaintenanceSchema),
  });
  const watchDateFromDamaged = form.watch("date_from_damaged");
  return (
    <div className="min-h-screen p-10">
      <h1 className="text-lg sm:text-3xl text-center">Schedule</h1>
      <Form {...form}>
        <form className="py-10">
          <div className="flex items-center gap-4">
            <p>Damage</p>
            <DatePickerCommon
              control={form.control}
              name="date_from_damaged"
              label="From"
            />
            <DatePickerCommon
              control={form.control}
              name="date_to_damaged"
              label="To"
              minDate={watchDateFromDamaged}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlanMaintenance;
