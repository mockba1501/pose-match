// Resolves per-landmark semantic states from joint comparison results.
import type { JointAngleResult, LandmarkState } from "@/app/types/poseData";
import { JOINTS, POSE_LANDMARKS, statePriority } from "@/app/lib/pose/poseLandmarks";



function assignState(existing: LandmarkState, next: LandmarkState) :  LandmarkState {
    return statePriority[next] > statePriority[existing]? next : existing;
}

export function setLandmarkStates(jointComparisonResults: JointAngleResult[]):
Record<number, LandmarkState> {
    
    //Output: Map: Landmark index, state enum < Gray | Green | Yellow | Red >
    const result:Record<number, LandmarkState> = {};
    
    Object.values(POSE_LANDMARKS).forEach(index => {
        result[index] = "gray";
    })
    
    //Go over the Joint Comparison Results and check the status
    jointComparisonResults.forEach((jointResult) => {
        const jointId = jointResult.id;
        const jointStatus = jointResult.status;
        //JOINTS
        const jointDescriptor = JOINTS.find((joint) => joint.id === jointId);
        if(jointDescriptor)
        {
            // if the status outside_tolerance joint index 1 => red and 0, 2 will be yellow
            if(jointStatus === "outside_tolerance")
            {
                result[jointDescriptor.landmarks[1]] = assignState(result[jointDescriptor.landmarks[1]], "red");
            
                result[jointDescriptor.landmarks[0]] = assignState(result[jointDescriptor.landmarks[0]], "yellow");

                result[jointDescriptor.landmarks[2]] = assignState(result[jointDescriptor.landmarks[2]], "yellow");
            }
            // if the status within_tolerance all index => green
            else if(jointStatus === "within_tolerance")
            {
                jointDescriptor.landmarks.forEach(idx => {
                    result[idx] = assignState(result[idx], "green");
                });
            }
            else if (jointStatus === "ignored") {
                jointDescriptor.landmarks.forEach(idx => {
                    result[idx] = assignState(result[idx], "gray");
                });
            }
        }
    })

    return result;
}