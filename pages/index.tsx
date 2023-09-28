import clsx from "clsx"
import { saveAs } from "file-saver"
import { SparklesIcon } from "@heroicons/react/24/outline"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import ReactBeforeSliderComponent from "react-before-after-slider-component"
import { useStopwatch } from "react-timer-hook"
import { OpenGraph } from "../components/openGraph"
import { NavBar } from "../components/navbar"
import { Notification } from "../components/notification"
import { ImageUpload } from "../components/imageUpload"
import type { RoiRendererProps } from "../components/renderer"
import { PromptForm, Prompt } from "../components/promptForm"
import { ResultMenu } from "../components/resultMenu"
import { useSearch } from "../hooks/search"
import { useFill3d, Prompt as FillPrompt } from "../hooks/fill3d"
import { useSample } from "../hooks/sample"

const RoiRenderer = dynamic<RoiRendererProps>(() => import("../components/renderer"), { ssr: false });

export default function Fill () {  
  // Loading and error state
  const { imageUrl: sampleImageUrl, prompts: samplePrompts } = useSample();
  const { totalSeconds: loadingTime, start: startWatch, reset: resetWatch } = useStopwatch({ autoStart: false });
  const [error, setError] = useState<string>(null);
  // Prompts
  const [image, setImage] = useState<File>(undefined);
  const [imageUrl, setImageUrl] = useState<string>(sampleImageUrl);
  const [prompts, setPrompts] = useState<Record<string, Prompt>>(samplePrompts ?? { });
  const [activePromptId, setActivePromptId] = useState<string>(Object.keys(prompts)[0]);
  useEffect(() => {
    if (image === undefined)
      return;
    const url = image ? URL.createObjectURL(image) : null;
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);
  // Search
  const { search, id: searchId, results: searchResults, loading: searching, error: searchError } = useSearch({ });
  useEffect(() => {
    const prompt = prompts[searchId];
    if (prompt)
      setPrompts({ ...prompts, [prompt.uid]: { ...prompt, choices: searchResults, choiceIdx: 0 } });
  }, [searchId, searchResults]);
  useEffect(() => setError(searchError), [searchError]);
  // Generate
  const { fill, loading, resultUrl, error: renderError } = useFill3d({ });
  const fillPrompts = useMemo<FillPrompt[]>(
    () => Object.values(prompts).map(({ uid, choices, choiceIdx, prompt, ...rest }) => ({ ...rest, id: choices?.[choiceIdx]?.id })),
    [prompts]
  );
  useEffect(() => setError(renderError), [renderError]);
  useEffect(() => loading ? startWatch() : resetWatch(null, false), [loading]);
  // Reset
  const reset = () => {
    setImage(null);
    fill(null);
    setPrompts({ });
    setActivePromptId(null);
  };
  // Render
  return (
    <div className="h-screen">

      {/* OG */}
      <OpenGraph title="Fill" />

      {/* Main */}
      <main className="h-screen bg-black text-gray-200 flex flex-col">

        <NavBar />

        <Notification
          title="An error occurred"
          description={error}
          show={!!error}
          error
          timeout={6_000}
          onClose={() => setError(null)}
        />

        <div className="px-8 gap-x-8 flex-grow grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 overflow-y-auto">

          {/* Result */}
          <div className="py-8 col-span-3 md:row-span-full">

            {/* Image area */}
            <div className={clsx("w-full h-full rounded-lg overflow-hidden", imageUrl ? "" : "bg-gray-800")}>

              {/* Image upload */}
              {
                !imageUrl &&
                <ImageUpload
                  onUpload={setImage}
                  className="w-full h-full"
                />
              }

              {/* ROI renderer */}
              {
                imageUrl && !resultUrl &&
                <RoiRenderer
                  image={imageUrl}
                  rois={Object.values(prompts)}
                  loading={loading ? loadingTime / 60 : undefined}
                  activeRoiId={activePromptId}
                  onUpdateRoi={roi => setPrompts({ ...prompts, [roi.uid]: roi })}
                  onSelectRoi={setActivePromptId}
                  className="w-full ring-1 ring-inset ring-gray-700 rounded-lg overflow-hidden"
                />
              }

              {/* Result renderer */}
              {
                imageUrl && resultUrl &&
                <ReactBeforeSliderComponent
                  firstImage={{ imageUrl: imageUrl, alt: "Original image" }}
                  secondImage={{ imageUrl: resultUrl, alt: "Result image" }}
                  className={clsx("object-contain")}
                />
              }
            </div>
          </div>

          {/* Controls */}
          <div className="px-4 py-8 md:row-span-full overflow-y-auto">
            
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 pb-8 md:grid-cols-3">

                {/* Generate button */}
                {
                  imageUrl && !resultUrl &&
                  <div className="flex flex-row justify-between md:col-span-3">
                    <button
                      type="button"
                      onClick={reset}
                      className="flex flex-row justify-center items-center gap-x-2 rounded-md ring-1 ring-gray-500 ring-inset px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => fill({ image: image ?? imageUrl, prompts: fillPrompts })}
                      className="flex flex-row justify-center items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <SparklesIcon className="w-5 h-5"/>
                      <span>
                        Generate
                      </span>
                    </button>
                  </div>
                }

                {/* Completion form */}
                {
                  imageUrl && resultUrl &&
                  <ResultMenu
                    onSave={() => saveAs(resultUrl, "fill3d.png")}
                    onEdit={() => fill(null)}
                    onReset={reset}
                    className="md:col-span-3"
                  />
                }

                {/* Prompt form */}
                {
                  imageUrl && !resultUrl && !loading && activePromptId &&
                  <PromptForm
                    prompt={prompts[activePromptId]}
                    onUpdate={prompt => setPrompts({ ...prompts, [prompt.uid]: prompt })}
                    onSearch={prompt => search({ id: prompt.uid, query: prompt.prompt })}
                    onDelete={() => {
                      setPrompts(Object.fromEntries(Object.entries(prompts).filter(e => e[0] !== activePromptId)));
                      setActivePromptId(null);
                    }}
                    loading={searching}
                    className="sm:col-span-3 overflow-y-auto"
                  />
                }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}