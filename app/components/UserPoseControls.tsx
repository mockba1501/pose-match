"use client";
import { BUTTON_BASE, BUTTON_PRIMARY, BUTTON_DANGER } from "../config/ui";

const UserPoseControls = ({ status, onStart, onStop }:
    {
        status: string,
        onStart: (() => void) | null,
        onStop: (() => void) | null
    }) => (
    <div className="flex gap-2">
        {status === "idle" && <button className={`${BUTTON_BASE} ${BUTTON_PRIMARY}`} onClick={onStart ?? (() => { })}>Start Camera</button>}
        {status === "ready" && <button className={`${BUTTON_BASE} ${BUTTON_DANGER}`} onClick={onStop ?? (() => { })}>Stop Camera</button>}
        {status === "requesting" && <p>Waiting for camera permission…</p>}
        {status === "error" && <p>Failed to access camera</p>}
    </div>
);

export default UserPoseControls;