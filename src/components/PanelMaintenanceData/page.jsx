"use client";
import { Button } from "@/components/ui/button";
import { getPanelsReports } from "@/store/Actions/maintenanceScheduleActions";
import { ROUTES } from "@/utils/constants";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const PanelMaintenanceData = () => {
  const params = useParams();
  const missionPlannerId = params.id;
  const dispatch = useDispatch();
  const router = useRouter();
  const maintenanceSchedule = useSelector((state) => state.maintenanceSchedule);
  useEffect(() => {
    const fetchPanelReports = async () => {
      try {
        await dispatch(getPanelsReports(missionPlannerId)).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchPanelReports();
  }, []);
  return (
    <div className="min-h-screen p-10 flex flex-col">
      <div className="flex-1">
        <h1 className=" text-2xl sm:text-3xl text-center">
          Panels Maintainance
        </h1>
        <div className="flex gap-5 sm:gap-52 justify-center py-10">
          <div className="damage-table w-[15rem]">
            <h1 className="text-center text-xl py-1">Damage</h1>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4 border-b border-black">
                <div>Row</div>
                <div>Column</div>
              </div>
              {maintenanceSchedule?.data?.damaged_solar_panel?.length > 0 ? (
                maintenanceSchedule?.data?.damaged_solar_panel?.map(
                  (item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between px-4 border-b border-black"
                      >
                        <div>{item?.solar_row}</div>
                        <div>{item?.solar_column}</div>
                      </div>
                    );
                  }
                )
              ) : (
                <p className="text-center">No data</p>
              )}
            </div>
          </div>
          <div className="dusty-table w-[15rem]">
            <h1 className="text-center text-xl py-1">Dusty</h1>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4 border-b border-black">
                <div>Row</div>
                <div>Column</div>
              </div>
              {maintenanceSchedule?.data?.dusty_solar_panel?.length > 0 ? (
                maintenanceSchedule?.data?.dusty_solar_panel?.map(
                  (item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between px-4 border-b border-black"
                      >
                        <div>{item?.solar_row}</div>
                        <div>{item?.solar_column}</div>
                      </div>
                    );
                  }
                )
              ) : (
                <p className="text-center">No data</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Button
          variant="hover-blue-fit"
          className="!w-64 text-lg"
          onClick={() => {
            router.push(
              `${ROUTES.MAINTENANCE_MISSIONS}/edit/${missionPlannerId}`
            );
          }}
        >
          Plan Maintenance
        </Button>
      </div>
    </div>
  );
};

export default PanelMaintenanceData;
