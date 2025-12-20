"use client";
import useWebcam from "../hooks/useWebcam";
import { POSE_VIEWPORT } from '../config/poseViewport';
import { BUTTON_BASE, BUTTON_PRIMARY, BUTTON_DANGER } from "../config/ui";

import { useRef, useEffect } from "react";

const UserPoseInput = ({ onVideoReady }:
    { onVideoReady: (video: HTMLVideoElement | null) => void }
) => {

    const webcamRef = useRef<HTMLVideoElement | null>(null)
    const { status, stream, startStream, stopStream } = useWebcam();

    useEffect(() => {
        if (!stream && webcamRef.current) {
            webcamRef.current.srcObject = null;
        }

        if (!stream || !webcamRef.current)
            return;

        webcamRef.current.srcObject = stream;
        webcamRef.current.play().catch(console.error);

        webcamRef.current.onloadedmetadata = null;
        webcamRef.current.onloadedmetadata = () => {
            onVideoReady(webcamRef.current!);
        };

    }, [stream]);

    const handleStopStream = () => {
        stopStream();
        webcamRef.current!.srcObject = null;
        onVideoReady(null);
    }

    return (
        <div className="flex flex-col items-center gap-2">

            {status === "idle" && <button className={`${BUTTON_BASE} ${BUTTON_PRIMARY}`} onClick={startStream}>Start Camera</button>}
            {status === "requesting" && <p>Waiting for camera permission…</p>}
            {status === "error" && <p>Failed to access camera</p>}

            <video ref={webcamRef} autoPlay muted playsInline width={POSE_VIEWPORT.width} height={POSE_VIEWPORT.height} />
            {status === "ready" && <button className={`${BUTTON_BASE} ${BUTTON_DANGER}`} onClick={handleStopStream}>Stop Camera</button>}
        </div>
    );
};

UserPoseInput.displayName = "UserPoseInput";

export default UserPoseInput;
