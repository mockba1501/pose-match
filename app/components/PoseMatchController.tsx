'use client';
import { useEffect, useState } from "react";
import PoseSourceSelector from "./PoseSourceSelector";
import PoseDetector from "./PoseDetector";
import PoseCanvas from "./PoseCanvas";
import type { PoseData } from "../types/poseData";

const PoseMatchController = () => {
    const [selectedSrc, setSelectedSrc] = useState<string|null>(null);
    const [image, setImage] = useState<HTMLImageElement|null>(null);
    const [imageStatus, setImageStatus] = useState<"idle"|"loading"|"loaded"|"error">("idle");
    //const [poseResults, setPoseResults] = useState<PoseLandmarkerResult|null>(null);
    const [poseData, setPoseData] = useState<PoseData|null>(null);

    useEffect(() => {
        if (!selectedSrc) 
            return;
        
        let cancelled = false;
        const img = new Image();
        
        img.src = selectedSrc;
        img.onload = () => {
            if(cancelled) return;
            
            setImage(img);
            setImageStatus("loaded");
        }
        img.onerror = () => {
            if(cancelled) return;
            
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
        <PoseSourceSelector imageStatus={imageStatus} selectedSrc={selectedSrc} onSourceSelected={handleSourceSelected} />
        <PoseDetector image={image} onPoseData={setPoseData}/>
        <PoseCanvas image={image} poseData={poseData}/>
    </>
    );
}

export default PoseMatchController;