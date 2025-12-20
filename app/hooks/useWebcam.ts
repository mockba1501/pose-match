import { useEffect, useState } from "react";

const useWebcam = () => {
    const [status, setStatus] = useState<"idle" | "requesting" | "ready" | "error">("idle");
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startStream = async () => {
        if (status === "error") {
            reset(); // optionally reset before requesting again
        }

        setStatus("requesting");

        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });

            setStatus("ready");
            setStream(cameraStream);

            //cleaning up the stream
            return true;
        } catch (error: unknown) {
            setStatus("error");
            console.log(error);
            return false
        }
    };

    const stopStream = () => {
        if (!stream)
            return;
        stream.getTracks().forEach(track => track.stop());
        setStatus("idle");
        setStream(null);
    }

    const reset = () => {
        stopStream(); // stop any lingering stream
        setStatus("idle"); // reset state
    };

    useEffect(() => {
        // This effect runs once on mount
        return () => {
            // Cleanup on unmount
            stopStream(); // safely stops tracks and clears stream
        };
    }, []);

    return { status, stream, startStream, stopStream };
}

export default useWebcam;