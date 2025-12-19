'use client';
import { useEffect, useRef } from "react";
import type { PoseData } from "../types/poseData";
import { POSE_CONNECTIONS } from "../lib/pose/poseLandmarks";
import { POSE_VIEWPORT } from "../config/poseViewport";

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

         // Set canvas size to match image
        canvas.width = POSE_VIEWPORT.width;
        canvas.height = POSE_VIEWPORT.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(!image)
            return;
        
        const scale = Math.min(
            POSE_VIEWPORT.width/ image.width,
            POSE_VIEWPORT.height/ image.height
        )

        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;

        const offsetX = (POSE_VIEWPORT.width - drawWidth) / 2;
        const offsetY = (POSE_VIEWPORT.height - drawHeight) / 2;
        
        // the original image
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

        if(!poseData)
            return;
        // draw pose landmarks and connections
        drawConnectors(ctx, poseData, POSE_CONNECTIONS);
        drawLandmarks(ctx, poseData);

    },[image, poseData]);

    return (
        <div className="flex items-center justify-center">
        <canvas ref={canvasRef} className="bg-white rounded-md"></canvas>
        </div>
    )
}

export default PoseCanvas;