import { ArrowRightIcon, PhotoIcon, SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { OpenGraph } from "@/components/openGraph"
import { createScene, createRender, uploadImage, type Scene, type Render } from "@/lib/fill3d"

export default function Fill () {
  const [imageUrl, setImageUrl] = useState<string>(null);
  const [scene, setScene] = useState<Scene>(null);
  const [render, setRender] = useState<Render>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState<"image" | "scene" | "render">(null);
  // Dropzone
  const onDrop = useCallback(async (files: File[]) => {
    // Reset
    setImageUrl(null);
    setScene(null);
    setRender(null);
    setLoading("image");
    // Upload
    const image = files[0];
    const url = image ? await uploadImage(image) : null;
    // Update
    setImageUrl(url);
    setLoading(null);
  }, []);
  const { getInputProps, open: openDropZone } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"] },
    maxFiles: 1,
    noClick: true,
    disabled: !!loading
  });
  // Handlers
  const onCreateScene = async () => {
    if (!imageUrl)
      return;
    setLoading("scene");
    setScene(null);
    const scene = await createScene(imageUrl);
    setScene(scene);
    setLoading(null);
  };
  const onGenerateImage = async () => {
    if (!scene)
      return;
    setLoading("render");
    const render = await createRender(scene.id, prompt);
    setRender(render);
    setLoading(null);
  }
  // Render
  return (
    <div className="h-screen">

      {/* OG */}
      <OpenGraph title="Fill" />

      {/* Main */}
      <main className="flex flex-col px-12 py-12 gap-y-10">

        <h1 className="text-6xl">
          Fill 3D API Demo!
        </h1>
        
        {/* Image */}
        <div className="">

          {/* Upload button */}
          <button
            onClick={openDropZone}
            disabled={!!loading}
            className="flex flex-row items-center gap-x-2 group"
          >
            <h2 className="text-4xl">
              1.{" "}
              <span className={!loading ? "group-hover:underline" : ""}>
                First, upload an image
              </span>
              .
            </h2>
            <input {...getInputProps()} />
            {
              loading !== "image" &&
              <PhotoIcon className="w-12 h-auto px-2 py-2 inline" />
            }
            {
              loading === "image" &&
              <div className="">
                <Loader2 strokeWidth={2.5} className="w-12 h-12 py-2 text-gray-600 animate-spin" />
              </div>
            }
          </button>

          {/* Image */}
          {
            imageUrl &&
            <img src={imageUrl} className="w-full lg:w-1/2 h-auto rounded-lg" />
          }
        </div>
        
        {/* Create scene */}
        <div className="space-y-2">
          <button
            onClick={onCreateScene}
            disabled={!!loading}
            className="text-left group"
          >
            <div className="flex flex-row items-center">
              <h2 className="text-4xl">
                2.{" "}
                <span className={!loading ? "group-hover:underline" : ""}>
                  Next, create a scene
                </span>
                .
              </h2>
              {
                loading !== "scene" &&
                <ArrowRightIcon className="w-12 h-auto px-2 py-2 inline" />
              }
              {
                loading === "scene" &&
                <div className="">
                  <Loader2 strokeWidth={2.5} className="w-12 h-12 py-2 text-gray-600 animate-spin" />
                </div>
              }
            </div>
          </button>
          <p className="text-2xl max-w-3xl">
            Fill 3D creates rich metadata from your image.<br/> We call this a scene.
          </p>
          {
            scene &&
            <SyntaxHighlighter
              language="json"
              style={dracula}
              PreTag="div"
              className="!rounded-xl inline-block"
            >
              {JSON.stringify(scene, null, 2)}
            </SyntaxHighlighter>
          }
        </div>

        {/* Generate image */}
        <div className="space-y-2">
          <button
            onClick={onGenerateImage}
            disabled={!!loading}
            className="text-left group"
          >
            <div className="flex flex-row items-center">
              <h2 className="text-4xl">
                3.{" "}
                <span className={!loading ? "group-hover:underline" : ""}>
                  Generate an image
                </span>
                !
              </h2>
              {
                loading !== "render" &&
                <SparklesIcon className="w-12 h-auto px-2 py-2 inline visible group-hover:visible" />
              }
              {
                loading === "render" &&
                <div className="">
                  <Loader2 strokeWidth={2.5} className="w-12 h-12 py-2 text-gray-600 animate-spin" />
                </div>
              }
            </div>
          </button>
          {
            !render &&
            <textarea
              rows={3}
              className="block w-1/2 border-0 border-b border-transparent p-2 text-gray-900 placeholder:text-gray-700 focus:border-indigo-600 focus:ring-0 text-2xl leading-6"
              placeholder="Describe what objects you want placed where..."
              value={prompt}
              disabled={!!loading}
              onChange={e => setPrompt(e.target.value)}
            />
          }
          {
            render &&
            <div className="">
              <img
                src={render.image}
                className="w-full lg:w-1/2 h-auto rounded-lg mb-4"
              />
              <SyntaxHighlighter
                language="json"
                style={dracula}
                PreTag="div"
                className="!rounded-xl inline-block !mb-4"
              >
                {JSON.stringify(render, null, 2)}
              </SyntaxHighlighter>
              <button
                onClick={() => setRender(null)}
                className="inline group flex flex-row"
              >
                <p className="text-2xl group-hover:underline">
                  Clear
                </p>
                <XMarkIcon className="w-8 h-auto" />
              </button>
            </div>
          }
        </div>

      </main>
    </div>
  );
}