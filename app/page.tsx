import PoseMatchController from "./components/PoseMatchController";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-4 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">PoseMatch Reference Images</h1>
      <PoseMatchController />
    </div>
  );
}
