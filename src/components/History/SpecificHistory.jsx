"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/common/SpinnerCommon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import VideoPreviewCard from "@/components/common/VideoPreviewCard"; // Adjust path as needed
import {
  getMissionHistory,
  getMissionHistoryById,
  uploadMissionVideo,
} from "@/store/Actions/planMissionActions";
import { ROUTES } from "@/utils/constants";
import { SET_IMAGE_URL } from "@/utils/Helpers";

export default function SpecificHistory() {
  const dispatch = useDispatch();
  const params = useParams();
  const missionId = params.id;
  console.log("Mission ID:", missionId);
  const mission = useSelector((state) => state.planMission);
  const router = useRouter();

  // Video states
  const [videoFile, setVideoFile] = useState(null);
  const [panelCounts, setPanelCounts] = useState({
    clean: null,
    dusty: null,
    damage: null,
    total: null,
  });
  const [missionVideoId, setMissionVideoId] = useState(null);
  const [missionVideoUrl, setMissionVideoUrl] = useState("");

  useEffect(() => {
    const fetchHistoryById = async () => {
      try {
        const resp = await dispatch(getMissionHistoryById(missionId)).unwrap();
        setPanelCounts({
          clean: resp?.data?.clean,
          damage: resp?.data?.damaged,
          dusty: resp?.data?.dusty,
          total: resp?.data?.clean + resp?.data?.dusty + resp?.data?.damaged,
        });
        setMissionVideoId(resp?.data?.mission_video_id);
        setMissionVideoUrl(SET_IMAGE_URL(resp?.data?.video_url) || "");
      } catch (err) {
        console.error("Error fetching mission history:", err);
      }
    };
    fetchHistoryById();
  }, [missionId, dispatch]);

  return (
    <div className="flex justify-center items-center p-10 min-h-screen bg-[--color-avocado-100]">
      <div className="flex flex-col sm:w-[70%] gap-6">
        <div className="content-header text-center space-y-4">
          <h1 className="text-xl font-bold">Upload Video</h1>

          {/* Upload Button */}
          {/* <Button
            type="button"
            onClick={() => router.push("/missionPlan/ActiveMission")}
            variant={mission.isLoading ? "outline-full" : "hover-blue-full"}
            disabled={mission.isLoading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </Button> */}
        </div>
        {/* Video Preview Card */}
        <VideoPreviewCard
          videoUrl={missionVideoUrl}
          onVideoSelect={() => {}} // No-op function
          onRemove={() => {}} // No-op function
        />
        {/* Mission Summary Table */}
        <div className="p-8 mx-auto">
          <div className="border-2 border-black inline-block">
            <table className="border-collapse">
              <tbody>
                <tr>
                  <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                    Clean
                  </td>
                  <td className="border border-black px-4 py-3 w-24">
                    {panelCounts?.clean !== null ? panelCounts?.clean : "N/A"}
                  </td>
                  <td
                    className={`border ${
                      panelCounts?.clean !== null
                        ? "cursor-pointer underline text-blue-500"
                        : ""
                    } border-black px-4 py-3 w-24`}
                    onClick={() => {
                      if (panelCounts?.clean !== null) {
                        router.push(
                          `${ROUTES.VIEW_MISSION_IMAGES}/${missionVideoId}?label=clean_solar_panel`
                        );
                      }
                    }}
                  >
                    {panelCounts?.clean !== null ? "images" : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                    Dusty
                  </td>
                  <td className="border border-black px-4 py-3 w-24">
                    {panelCounts?.clean !== null ? panelCounts?.dusty : "N/A"}
                  </td>
                  <td
                    className={`border ${
                      panelCounts?.clean !== null
                        ? "cursor-pointer underline text-blue-500"
                        : ""
                    } border-black px-4 py-3 w-24`}
                    onClick={() => {
                      if (panelCounts?.dusty !== null) {
                        router.push(
                          `${ROUTES.VIEW_MISSION_IMAGES}/${missionVideoId}?label=dusty_solar_panel`
                        );
                      }
                    }}
                  >
                    {panelCounts?.dusty !== null ? "images" : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                    Damage
                  </td>
                  <td className="border border-black px-4 py-3 w-24">
                    {panelCounts?.damage !== null ? panelCounts?.damage : "N/A"}
                  </td>
                  <td
                    className={`border ${
                      panelCounts?.clean !== null
                        ? "cursor-pointer underline text-blue-500"
                        : ""
                    } border-black px-4 py-3 w-24`}
                    onClick={() => {
                      if (panelCounts?.damage !== null) {
                        router.push(
                          `${ROUTES.VIEW_MISSION_IMAGES}/${missionVideoId}?label=damage_solar_panel`
                        );
                      }
                    }}
                  >
                    {panelCounts?.damage !== null ? "images" : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                    Total
                  </td>
                  <td className="border border-black px-4 py-3 w-24">
                    {panelCounts?.total !== null ? panelCounts?.total : "N/A"}
                  </td>
                  <td
                    className={`border ${
                      panelCounts?.total !== null
                        ? "cursor-pointer underline text-blue-500"
                        : ""
                    } border-black px-4 py-3 w-24`}
                    onClick={() => {
                      if (panelCounts?.total !== null) {
                        router.push(
                          `${ROUTES.VIEW_MISSION_IMAGES}/${missionVideoId}?label=total_solar_panel`
                        );
                      }
                    }}
                  >
                    {panelCounts?.total !== null ? "images" : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
