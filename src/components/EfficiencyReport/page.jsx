"use client";
import { getEfficiencyReports } from "@/store/Actions/efficiencyReportActions";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const EfficiencyReport = () => {
  const params = useParams();
  const missionPlannerId = params.id;
  const efficiencyReport = useSelector((state) => state.efficiencyReport);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEfficiencyReports(missionPlannerId));
  }, []);

  return (
    <div className="w-[90%] max-w-5xl mx-auto py-6 overflow-x-auto">
      <h1 className=" text-lg sm:text-2xl font-semibold text-center py-10">
        Efficincy Report
      </h1>
      <table className="w-full  text-left border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Row</th>
            <th className="p-3 border-b">Column</th>
            <th className="p-3 border-b">Watts</th>
            <th className="p-3 border-b">Frame No.</th>
            <th className="p-3 border-b">Label</th>
            <th className="p-3 border-b">Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {efficiencyReport?.data?.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-3 border-b">{item?.solar_row}</td>
              <td className="p-3 border-b">{item?.solar_column}</td>
              <td className="p-3 border-b">{item?.solar_watts}</td>
              <td className="p-3 border-b">{item?.solar_frame_no}</td>
              <td className="p-3 border-b">{item?.label}</td>
              <td className="p-3 border-b">{item?.calculated_efficiency}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {efficiencyReport?.data?.length <= 0 && (
        <p className="text-lg py-4 text-center font-semibold">No data</p>
      )}
    </div>
  );
};
export default EfficiencyReport;
