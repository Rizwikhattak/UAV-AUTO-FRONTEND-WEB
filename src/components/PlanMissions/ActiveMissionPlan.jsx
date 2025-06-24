"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/common/SpinnerCommon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import VideoPreviewCard from "@/components/common/VideoPreviewCard"; // Adjust path as needed
import { uploadMissionVideo } from "@/store/Actions/planMissionActions";
import { ROUTES } from "@/utils/constants";

export default function ActiveMissionPlan() {
  const dispatch = useDispatch();
  console.log("CAAAAALLLLLEEEEED");
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
  // Submit handler
  const handleUpload = async () => {
    try {
      // Create form object
      const formData = new FormData();

      // Add mission planner ID
      if (missionId) {
        formData.set("mission_planner_id", missionId);
      }

      // Add video file
      if (videoFile) {
        formData.set("video", videoFile);
      }
      console.log("asd", videoFile, missionId);
      console.log("Form Data:", formData);
      const resp = await dispatch(uploadMissionVideo(formData)).unwrap();
      console.log("Upload Response:", resp);
      setPanelCounts({
        clean: resp?.data?.counts?.clean,
        dusty: resp?.data?.counts?.dusty,
        damage: resp?.data?.counts?.damaged,
        total: resp?.data?.counts?.total,
      });
      setMissionVideoId(resp?.data?.id);
    } catch (err) {
      console.log("Error adding mission:", err);
    }
  };

  const handleVideoSelect = (file) => {
    setVideoFile(file);
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
  };

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
          videoFile={videoFile}
          videoUrl={null}
          onVideoSelect={handleVideoSelect}
          onRemove={handleRemoveVideo}
          className="max-w-2xl mx-auto"
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
                    {panelCounts?.dusty !== null ? panelCounts?.dusty : "N/A"}
                  </td>
                  <td
                    className={`border ${
                      panelCounts?.dusty !== null
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
                      panelCounts?.damage !== null
                        ? "cursor-pointer underline text-blue-500"
                        : ""
                    } border-black px-4 py-3 w-24`}
                    onClick={() => {
                      if (panelCounts?.damage !== null) {
                        router.push(
                          `${ROUTES.VIEW_MISSION_IMAGES}/${missionVideoId}?label=damaged_solar_panel`
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

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="button"
            variant="hover-blue-full"
            onClick={handleUpload}
            isLoading={mission.isPostLoading}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
