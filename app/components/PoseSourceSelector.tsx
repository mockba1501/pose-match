'use client';
import { useState } from "react";
import Image from "next/image";

const PoseSourceSelector = () => {
  const [selectedSrc, setSelectedSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const basePath = "/reference-poses/v1/";
  const poseImageCollection = [
    "01-man-squats.jpg",
    "02-woman-childpose.jpg",
    "06-woman-yogaStanding.png",
    "08-man-standing.jpg",
  ];

  const handleImageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const imageSrc = basePath + e.target.value;
    setSelectedSrc(imageSrc);
    setIsLoading(true);
    setError(false);
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      {/* Selector */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="poseImages"
          className="font-medium text-[color:var(--color-foreground)] dark:text-[color:var(--color-primary-foreground)]"
        >
          Select Reference Image:
        </label>
        <select
          name="poseImages"
          id="poseImages"
          onChange={handleImageSelection}
          className="p-2 border border-[color:var(--color-border)] rounded shadow-sm
                     bg-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)]
                     focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
        >
          <option value="">-- Choose an image --</option>
          {poseImageCollection.map((item, key) => (
            <option key={key} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Image Display */}
      <div className="relative w-full h-96 bg-[color:var(--color-muted)] rounded shadow flex items-center justify-center overflow-hidden">
        {isLoading && (
          <p className="absolute text-[color:var(--color-foreground)] dark:text-[color:var(--color-primary-foreground)]">
            Loading image...
          </p>
        )}
        {error && (
          <p className="absolute text-[color:var(--color-destructive-foreground)]">
            Failed to load image.
          </p>
        )}
        {selectedSrc && !error && (
          <Image
            src={selectedSrc}
            alt="selected reference pose"
            fill
            style={{ objectFit: "contain" }}
            onLoad={() => setIsLoading(false)}
            onError={() => setError(true)}
          />
        )}
      </div>
    </div>
  );
};

export default PoseSourceSelector;
