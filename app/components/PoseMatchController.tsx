'use client';
import { useEffect, useState } from "react";
import PoseSourceSelector from "./PoseSourceSelector";
import PoseDetector from "./PoseDetector";
import PoseCanvas from "./PoseCanvas";
import UserPoseInput from "./UserPoseInput";
import type { PoseData } from "../types/poseData";

const PoseMatchController = () => {
    const [selectedSrc, setSelectedSrc] = useState<string | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");
    //const [poseResults, setPoseResults] = useState<PoseLandmarkerResult|null>(null);
    const [poseData, setPoseData] = useState<PoseData | null>(null);

    useEffect(() => {
        if (!selectedSrc)
            return;

        let cancelled = false;
        const img = new Image();

        img.src = selectedSrc;
        img.onload = () => {
            if (cancelled) return;

            setImage(img);
            setImageStatus("loaded");
        }
        img.onerror = () => {
            if (cancelled) return;

            setImage(null);
            setImageStatus("error");

        }
        return () => {
            cancelled = true;
        }
    }, [selectedSrc]);

    const handleSourceSelected = (src: string | null) => {
        setSelectedSrc(src);
        setPoseData(null);

        if (src) {
            setImageStatus("loading");
            setImage(null);
        } else {
            setImageStatus("idle");
            setImage(null);
        }
    };

    return (
        <>
            <div className="w-full max-w-6xl flex flex-col gap-6">
                <PoseSourceSelector imageStatus={imageStatus} selectedSrc={selectedSrc} onSourceSelected={handleSourceSelected} />
                {/* Main pose area */}
                <div className="flex justify-center gap-6">
                    {/* LEFT: Reference pose */}
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="font-medium">Reference Pose</h3>
                        <PoseCanvas image={image} poseData={poseData} />
                    </div>
                    {/* RIGHT: User camera */}
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="font-medium">Your Pose</h3>
                        <UserPoseInput />
                    </div>
                </div>
                {/* Controls */}
                <PoseDetector image={image} onPoseData={setPoseData} />
            </div>
        </>
    );
}

export default PoseMatchController;