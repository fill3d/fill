import clsx from "clsx"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

export interface ImageUploadProps {
  onUpload: (image: File) => void;
  className?: string;
}

export function ImageUpload ({ onUpload, className }: ImageUploadProps) {
  const onDrop = useCallback((files: File[]) => onUpload?.(files[0]), [onUpload]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
    onDrop
  });
  // Render
  return (
    <div {...getRootProps()} className={clsx("cursor-pointer flex flex-row justify-center items-center", className)}>
      <input {...getInputProps()} />
      <p className="max-w-xs text-center text-lg">
        {
          isDragActive &&
          <span>
            Drop your empty room photo here...
          </span>
        }
        {
          !isDragActive &&
          <span>
            Drag and drop a photo of an <br/><b className="text-pink-500">empty room</b> here, or click to upload.
          </span>
        }
      </p>
    </div>
  );
}