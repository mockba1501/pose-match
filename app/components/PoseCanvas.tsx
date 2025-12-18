'use client';
import { useEffect, useRef } from "react";
import type { PoseData } from "../types/poseData";
import { POSE_CONNECTIONS } from "../lib/pose/poseLandmarks";

const PoseCanvas = ({image, poseData}:
    {
        image: HTMLImageElement | null,
        poseData: PoseData|null
    }) => {

    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    
    const drawLandmarks = (
        ctx: CanvasRenderingContext2D,
        pose: PoseData
    ) => {
        ctx.fillStyle = "red";
        for (const landmark of pose.landmarks) {
            if(!landmark.visible)
                continue;

            const x = landmark.x * ctx.canvas.width;
            const y = landmark.y * ctx.canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const drawConnectors = (
        ctx: CanvasRenderingContext2D,
        pose: PoseData,
        connections: Array<[number, number]>
    ) => {
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        
        for (const [startIdx, endIdx] of connections) {
            const startLandmark = pose.landmarks[startIdx];
            const endLandmark = pose.landmarks[endIdx];

            if(!startLandmark.visible || !endLandmark.visible)
                continue;

            const startX = startLandmark.x * ctx.canvas.width;
            const startY = startLandmark.y * ctx.canvas.height;
            const endX = endLandmark.x * ctx.canvas.width;
            const endY = endLandmark.y * ctx.canvas.height;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    useEffect(()=> {
        const canvas = canvasRef.current;
        if(!canvas)
            return;

        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(!image)
            return;
        
        // Set canvas size to match image
        canvas.width = image.width;
        canvas.height = image.height;
        
        // the original image
        ctx.drawImage(image, 0, 0);

        if(!poseData)
            return;
        // draw pose landmarks and connections
        drawConnectors(ctx, poseData, POSE_CONNECTIONS);
        drawLandmarks(ctx, poseData);

    },[image, poseData]);

    return (
        <>
        <h3>PoseCanvas</h3>
        <canvas ref={canvasRef}></canvas>
        </>
    )
}

export default PoseCanvas;