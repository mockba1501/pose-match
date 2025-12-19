'use client';

const PoseSourceSelector = ({imageStatus, selectedSrc, onSourceSelected}:
  {
    imageStatus: "idle"|"loading"|"loaded"|"error",
    selectedSrc: string | null,
    onSourceSelected: (sourceSelected:string|null)=>void
  }
  ) => {
  const basePath = "/reference-poses/v1/";
  const poseImageCollection = [
    "01-man-squats.jpg",
    "02-woman-childpose.jpg",
    "03-teen-downward.jpg",
    "04-woman-corpse.jpg",
    "05-man-pushup.jpg",
    "06-woman-yogaStanding.png",
    "07-man-openArms.jpeg",
    "08-man-standing.jpg",
  ];

  const handleImageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value === "")
    {
      onSourceSelected(null);
      return;
    }

    const imageSrc = basePath + e.target.value;
    onSourceSelected(imageSrc);
  };

  const selectedFilename = selectedSrc ? selectedSrc.replace(basePath, "") : "";

  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      {/* Selector */}

        <label
          htmlFor="poseImages"
          className="font-medium text-[color:var(--color-foreground)] dark:text-[color:var(--color-primary-foreground)]"
        >
          Select Reference Image:
        </label>
        <select
          name="poseImages"
          id="poseImages"
          value={selectedFilename}
          onChange={handleImageSelection}
          className="p-2 border rounded shadow-sm focus:outline-none focus:ring-2"
        >
          <option value="">-- Choose an image --</option>
          {poseImageCollection.map((item, key) => (
            <option key={key} value={item}>
              {item}
            </option>
          ))}
        </select>
        {imageStatus === "loading" && <p className="text-sm text-gray-500">Loading image…</p>}
        {imageStatus === "error" && <p className="text-sm text-red-500">Failed to load image</p>}
    </div>
  );
};

export default PoseSourceSelector;
