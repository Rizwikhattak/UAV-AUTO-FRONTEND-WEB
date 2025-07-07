"use client";
import { RowSkeleton } from "@/components/common/SkeletonsCommon";
import DeleteMissionPanelModal from "@/components/MissionPanelMap/DeleteMissionPanelModal";
import { getMissionPanelMaps } from "@/store/Actions/missionPanelMapActions";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export const PanelMapRow = ({ item, index }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <tr key={index} className="hover:bg-gray-50">
        <td className="p-3 border-b">{item.solar_row}</td>
        <td className="p-3 border-b">{item.solar_column}</td>
        <td className="p-3 border-b">{item.solar_watts}</td>
        <td className="p-3 border-b">{item.solar_frame_no}</td>
        <td
          className="p-3 border-b"
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteOpen(true);
          }}
        >
          <Trash2 className="cursor-pointer text-red-500 hover:text-red-600" />
        </td>
      </tr>
      <DeleteMissionPanelModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        panelId={item?.id}
      />
    </>
  );
};
const ShowMissionPanelMap = () => {
  const params = useParams();
  const missionPlannerId = params.id;
  const dispatch = useDispatch();
  const missionPanelMap = useSelector((state) => state.missionPanelMap);
  useEffect(() => {
    dispatch(getMissionPanelMaps(missionPlannerId));
  }, []);

  return (
    <div className="w-[90%] max-w-5xl mx-auto py-6 overflow-x-auto">
      <table className="w-full  text-left border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Row</th>
            <th className="p-3 border-b">Column</th>
            <th className="p-3 border-b">Watts</th>
            <th className="p-3 border-b">Frame No.</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {missionPanelMap?.data?.map((item, index) => (
            <PanelMapRow item={item} index={index} />
          ))}
        </tbody>
      </table>
      {missionPanelMap?.data?.length <= 0 && (
        <p className="text-lg py-4 text-center font-semibold">No data</p>
      )}
    </div>
  );
};

export default ShowMissionPanelMap;

// "use client";
// import { getMissionPanelMaps } from "@/store/Actions/missionPanelMapActions";
// import { Trash2 } from "lucide-react";
// import { useParams } from "next/navigation";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const ShowMissionPanelMap = () => {
//   const params = useParams();
//   const missionPlannerId = params.id;
//   const dispaatch = useDispatch();
//   const missionPanelMap = useSelector((state) => state.missionPanelMap);
//   useEffect(() => {
//     dispaatch(getMissionPanelMaps(missionPlannerId));
//   }, []);
//   return (
//     <div className="py-4 w-[80%] mx-auto">
//       <div className="flex items-center justify-between px-4 sm:px-10 border-b-2 border-black">
//         <h1 className="text-lg font-semibold">Row</h1>
//         <h1 className="text-lg font-semibold">Column</h1>
//         <h1 className="text-lg font-semibold">Watts</h1>
//         <h1 className="text-lg font-semibold">Actions</h1>
//       </div>
//       {missionPanelMap.data.map((item, index) => {
//         return (
//           <div
//             key={index}
//             className="flex items-center justify-between px-4 sm:px-10 border-b-2 border-black"
//           >
//             <h1 className="text-lg">{item.solar_row}</h1>
//             <h1 className="text-lg">{item.solar_column}</h1>
//             <h1 className="text-lg">{item.solar_watts}</h1>
//             <h1 className="text-lg"><Trash2/></h1>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ShowMissionPanelMap;
