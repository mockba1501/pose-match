import type { PoseData, JointAngleResult, PoseLandmark } from "../../types/poseData";
import { JOINTS } from "./poseLandmarks";

export function computeJointAngles(pose: PoseData): Record<string, number | null>{
    
    const result:Record<string, number | null> = {};
    
    JOINTS.forEach((joint) => {
        const angle = calculateAngle(pose.landmarks[joint.landmarks[0]], pose.landmarks[joint.landmarks[1]], pose.landmarks[joint.landmarks[2]]);
        result[joint.id] = angle;
    })

    return result;
}

function calculateAngle(PointA:PoseLandmark, PointB:PoseLandmark, PointC:PoseLandmark)
{
    if(!PointA || !PointB || !PointC || !PointA.visible || !PointB.visible || !PointC.visible)
        return null;

    const v1x = PointA.x - PointB.x;
    const v1y = PointA.y - PointB.y;
    const v2x = PointC.x - PointB.x;
    const v2y = PointC.y - PointB.y;

    const dotProduct = v1x*v2x + v1y*v2y;
    const v1Mag = Math.sqrt(v1x*v1x + v1y*v1y);
    const v2Mag = Math.sqrt(v2x*v2x + v2y*v2y)

    if(v1Mag === 0 || v2Mag === 0)
        return null;

    //Double check situation of radiants vs angles!
    const angle = Math.acos(dotProduct/(v1Mag*v2Mag));
    return angle * (180 / Math.PI)
}

export function compareJointAngles(refAngles:Record<string, number | null>, userAngles:Record<string, number | null>): JointAngleResult[] {
    const results:JointAngleResult[] = [];

    JOINTS.forEach((joint) => {
        //console.log("Computing the joint ", joint.id);

        const refAngle = refAngles[joint.id];
        const userAngle = userAngles[joint.id];

        let status: JointAngleResult["status"] = "ignored";
        let deviation = 0;

        if(refAngle !== null && userAngle !== null)
        {
            deviation = Math.abs(userAngle - refAngle);
            if(deviation < joint.toleranceDegrees)
                status = "within_tolerance";
            else
                status = "outside_tolerance";
        }
        
        results.push( {
            id: joint.id,
            referenceAngle: refAngle,
            userAngle: userAngle,
            deviation: deviation,
            status: status
        })
    })

    return results;

}