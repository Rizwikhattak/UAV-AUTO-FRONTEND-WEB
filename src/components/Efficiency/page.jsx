"use client";
import { InputCommon } from "@/components/common/FormCommons";
import { efficiencySchema } from "@/components/Efficiency/efficiencyScheema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  getAllPanelEfficiencies,
  insertPanelEfficiency,
  updateSolarPanelEfficiency,
} from "@/store/Actions/panelEfficiencyActions";
import { CONSTANTS } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function Efficiency() {
  const dispatch = useDispatch();
  const panelEffSlice = useSelector((state) => state.panelEfficiency);
  const [stateIds, setStateIds] = useState({
    cleanId: -1,
    damagedId: -1,
    dustyId: -1,
  });
  const initialState = {
    clean: 0,
    dusty: 0,
    damaged: 0,
  };

  const form = useForm({
    resolver: zodResolver(efficiencySchema),
    defaultValues: initialState,
  });
  const fetchEfficiencies = async () => {
    try {
      const resp = await dispatch(getAllPanelEfficiencies()).unwrap();
      let cleanCount = 0,
        dustyCount = 0,
        damagedCount = 0;
      resp?.data?.forEach(({ id, label, efficiency_pct }, index) => {
        if (label === CONSTANTS.CLEAN_SOLAR_PANEL) {
          cleanCount = efficiency_pct;
          setStateIds((prev) => ({ ...prev, cleanId: id }));
        } else if (label === CONSTANTS.DAMAGED_SOLAR_PANEL) {
          damagedCount = efficiency_pct;
          setStateIds((prev) => ({ ...prev, damagedId: id }));
        } else if (label === CONSTANTS.DUSTY_SOLAR_PANEL) {
          dustyCount = efficiency_pct;
          setStateIds((prev) => ({ ...prev, dustyId: id }));
        }
        form.setValue("clean", cleanCount);
        form.setValue("damaged", damagedCount);
        form.setValue("dusty", dustyCount);
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleSave = async (data) => {
    console.log("Form data:", data);
    try {
      const payload = [
        {
          id: stateIds.cleanId,
          label: "clean_solar_panel",
          efficiency_pct: data.clean,
        },
        {
          id: stateIds.dustyId,
          label: "dusty_solar_panel",
          efficiency_pct: data.dusty,
        },
        {
          id: stateIds.damagedId,
          label: "damaged_solar_panel",
          efficiency_pct: data.damaged,
        },
      ];
      await dispatch(updateSolarPanelEfficiency(payload)).unwrap();
      await fetchEfficiencies();
    } catch (err) {
      console.error(err);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  useEffect(() => {
    fetchEfficiencies();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-black text-center">
          Efficiency Percentage
        </h1>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave, handleError)}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
              <div className="space-y-4">
                <InputCommon
                  name="clean"
                  label="Clean"
                  placeholder="Enter clean efficiency percentage"
                  control={form.control}
                  type="number"
                  min="0"
                  max="100"
                />

                <InputCommon
                  name="dusty"
                  label="Dusty"
                  placeholder="Enter dusty efficiency percentage"
                  control={form.control}
                  type="number"
                  min="0"
                  max="100"
                />

                <InputCommon
                  name="damaged"
                  label="Damage"
                  placeholder="Enter damaged efficiency percentage"
                  control={form.control}
                  type="number"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              variant="hover-blue-full"
              className="w-full"
              isLoading={panelEffSlice.isPostLoading}
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
