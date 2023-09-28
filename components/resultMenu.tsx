import clsx from "clsx";

export interface ResultMenuProps {
  onSave?: () => void;
  onEdit?: () => void;
  onReset?: () => void;
  className?: string;
}

export function ResultMenu ({ onSave, onEdit, onReset, className }: ResultMenuProps) {
  return (
    <div className={clsx("space-y-8", className)}>
      <div className="space-y-2 w-full">
        <button
          type="button"
          onClick={onSave}
          className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Download Result
        </button>
        <p className="text-gray-500 text-sm">
          Download the result image.
        </p>
      </div>

      <div className="space-y-2 w-full">
        <button
          type="button"
          onClick={onEdit}
          className="w-full rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Edit Prompts
        </button>
        <p className="text-gray-500 text-sm">
          Edit your prompts and regenerate the image. No credits will be used.
        </p>
      </div>

      <div className="space-y-2 w-full">
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          New Image
        </button>
        <p className="text-gray-500 text-sm">
          Upload a new image to fill.
        </p>
      </div>
    </div>
  );
}