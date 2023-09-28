import { Spinner } from "@blueprintjs/core"
import clsx from "clsx"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { Toggle } from "./toggle"
import type { Anchor, Roi } from "./renderer"

export interface SearchResult {
  id: string;
  preview: string;
}

export interface Prompt extends Roi {
  prompt?: string;
  choices?: SearchResult[];
  choiceIdx?: number;
}

export interface PromptFormProps {
  prompt: Prompt;
  onUpdate?: (value: Prompt) => void;
  onSearch?: (value: Prompt) => void;
  onDelete?: () => void;
  loading?: boolean;
  className?: string;
}

export function PromptForm ({ prompt, onUpdate, onSearch, onDelete, loading, className }: PromptFormProps) {
  const [query, setQuery] = useState(prompt.prompt ?? "");
  const [choiceIdx, setChoiceIdx] = useState(prompt.choiceIdx ?? 0);
  const [sticky, setSticky] = useState(!!prompt.anchor);
  // Prompt change effect
  useEffect(() => {
    setQuery(prompt.prompt ?? "");
    setChoiceIdx(prompt.choiceIdx ?? 0);
    setSticky(!!prompt.anchor);
  }, [prompt.uid]);
  // Choices change effect
  useEffect(() => {
    setChoiceIdx(prompt.choiceIdx ?? 0);
  }, [prompt.choices]);
  // Query and choice effect
  useEffect(() => {
    onUpdate?.({ ...prompt, prompt: query, choiceIdx });
  }, [query, choiceIdx]);
  // Sticky effect
  useEffect(() => {
    const anchor = sticky ? (prompt.anchor ?? createAnchor(prompt)) : null;
    onUpdate?.({ ...prompt, anchor });
  }, [sticky]);
  // Render
  return (
    <form className={clsx("space-y-8", className)}>

      {/* Prompt */}
      <div className="w-full">
        <label htmlFor="prompt" className="block text-sm font-normal leading-6 text-gray-200">
          Object
        </label>
        <div className="mt-2 space-y-2">
          {/* Preview */}
          <div className="relative w-full aspect-[16/9] bg-gray-900/50 ring-gray-600 ring-1 ring-inset py-0.5 rounded-lg overflow-hidden">
            {
              prompt.choices &&
              <>
                <img
                  src={prompt.choices[choiceIdx]?.preview}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-between px-2">
                  <div>
                    {
                      choiceIdx > 0 &&
                      <button
                        type="button"
                        onClick={() => setChoiceIdx(choiceIdx - 1)}
                        className="group rounded-md px-1 py-1 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <ChevronLeftIcon className="w-6 h-6 group-hover:scale-125 transition" />
                      </button>
                    }
                  </div>
                  <div>
                    {
                      choiceIdx < prompt.choices.length - 1 &&
                      <button
                        type="button"
                        onClick={() => setChoiceIdx(choiceIdx + 1)}
                        className="group rounded-md px-1 py-1 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <ChevronRightIcon className="w-6 h-6 group-hover:scale-125 transition" />
                      </button>
                    }
                  </div>
                </div>
              </>
            }
            {
              loading &&
              <div className="backdrop-brightness-50 backdrop-blur absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center">
                <Spinner size={60} />
              </div>
            }
            {
              !loading && !prompt.choices &&
              <div className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center">
                <img
                  src="icon_transparent.png"
                  className="w-1/2 h-1/2 object-contain opacity-10"
                />
              </div>
            }
          </div>
          <textarea
            name="prompt"
            id="prompt"
            placeholder="Grey bed with large pillows"
            value={query}
            onChange={e => setQuery(e.target.value)}
            rows={2}
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
          <button
            type="button"
            onClick={() => onSearch?.(prompt)}
            className="rounded-md bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Search
          </button>
          <p className="text-gray-500 text-sm">
            Describe the object you would like to place here.
          </p>
        </div>
      </div>

      <div className="w-full">
        <label htmlFor="prompt" className="block text-sm font-normal leading-6 text-gray-200">
          Sticky
        </label>
        <div className="mt-2 space-y-2">
          <Toggle
            value={sticky}
            onChange={setSticky}
          />
          <p className="text-gray-500 text-sm">
            Ensure that the object is placed against a wall by placing a pin on the wall.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Remove
        </button>
        <p className="text-gray-500 text-sm">
          Delete the region.
        </p>
      </div>
    </form>
  );
}

function createAnchor (prompt: Prompt): Anchor {
  const x = prompt.x + 0.5 * prompt.width;
  const y = prompt.y + 0.5 * prompt.height;
  return { x, y };
}