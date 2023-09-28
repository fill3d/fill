import { useEffect, useState } from "react"
import type { Roi } from "../components/renderer"

export interface Prompt extends Omit<Roi, "uid"> {
  /**
   * Object ID.
   * This is gotten from a `SearchResult`.
   */
  id?: string;
  /**
   * Object prompt.
   * This will perform a search and use the first returned object.
   */
  prompt?: string;
}

export interface UseFill3dInput {
  /**
   * API route endpoint.
   * Defaults to `/api/fill`.
   */
  url?: string;
}

export interface FillInput {
  /**
   * Input image file or URL.
   */
  image: File | string;
  /**
   * Fill prompts.
   */
  prompts: Prompt[];
}

export interface UseFill3dReturn {
  /**
   * Run 3D generative fill on an image with a set of fill prompts.
   */
  fill: (input: FillInput) => void;
  /**
   * Result URL.
   */
  resultUrl: string | null;
  /**
   * Whether a generation is currently loading.
   */
  loading: boolean;
  /**
   * Generation error.
   */
  error?: string;
}

export function useFill3d ({ url = "/api/fill" }: UseFill3dInput): UseFill3dReturn {
  // State
  const [inputs, setInputs] = useState<FillInput>(null);
  const [resultUrl, setResultUrl] = useState<string>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>(null);
  // Effect
  useEffect(() => {
    // Define handler
    const handler = async () => {
      setLoading(true);
      // Get image URL
      const { image, prompts } = inputs;
      const imageUrl = await createDataUrl(image);
      // Fill
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl, prompts })
      });
      // Extract
      const { result, error } = await response.json();
      setLoading(false);
      if (response.status >= 400)
        setError(error);
      else
        setResultUrl(result);    
    };
    // Reset state
    setError(null);
    // Invoke
    if (inputs)
      handler();
    else
      setResultUrl(null);
  }, [inputs]);
  // Return
  return { fill: setInputs, resultUrl, loading, error };
}

async function createDataUrl (image: string | File) {
  const blob = typeof(image) === "string" ? await downloadBlob(image) : image;
  const url = await new Promise<string>(res => {
    const reader = new FileReader();
    reader.onloadend = () => res(reader.result as string);
    reader.readAsDataURL(blob);
  });
  return url;
}

async function downloadBlob (url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
}