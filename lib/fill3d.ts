/**
 * Scenes refer to an image along with useful metadata generated by Fill 3D.
 * Multiple generations can be created with a single scene.
 * See https://github.com/fill3d/fill/wiki/3.-API-Guide
 */
export interface Scene {
  /**
   * Scene identifier.
   */
  id: string;
  /**
   * Image URL.
   */
  image: string;
  /**
   * Generated renders.
   */
  renders: Render[];
  /**
   * Date created.
   */
  created: Date;
}

/**
 * Renders are generations created from a scene with a user-provided prompt.
 */
export interface Render {
  /**
   * Render identifier.
   */
  id: string;
  /**
   * Scene identifier.
   */
  scene: string;
  /**
   * Generation prompt.
   */
  prompt: string;
  /**
   * Generation image URL.
   */
  image: string;
  /**
   * Date created.
   */
  created: Date;
}

/**
 * Upload an image to Fill 3D for generation.
 * @param image Image file.
 * @returns Uploaded image URL.
 */
export async function uploadImage (image: File): Promise<string> {
  const response = await fetch("/api/upload", { method: "POST" });
  const { url, error } = await response.json();
  if (error)
    throw new Error(error);
  await fetch(url, {
    method: "PUT",
    body: await image.arrayBuffer(),
    headers: { "Content-Type": "image/jpeg" }
  });
  const result = new URL(url);
  result.hostname = "cdn.fill3d.ai";
  result.search = "";
  return result.toString();
}

/**
 * Create a scene.
 * This simply proxies to the `/api/scene` API route which issues the request to Fill 3D.
 * @param image Image URL.
 * @returns Scene.
 */
export async function createScene (image: string): Promise<Scene> {
  const response = await fetch("/api/scene", {
    method: "POST",
    body: JSON.stringify({ image }),
    headers: { "Content-Type": "application/json" }
  });
  const { error, ...payload } = await response.json();
  if (error)
    throw new Error(error);
  return payload;
}

/**
 * Generate a render.
 * This simply proxies to the `/api/render` API route which issues the request to Fill 3D.
 * @param sceneId Scene identifier.
 * @param prompt Generation prompt.
 * @returns Generated render.
 */
export async function createRender (sceneId: string, prompt: string): Promise<Render> {
  const response = await fetch("/api/render", {
    method: "POST",
    body: JSON.stringify({ sceneId, prompt }),
    headers: { "Content-Type": "application/json" }
  });
  const { error, ...payload } = await response.json();
  if (error)
    throw new Error(error);
  return payload;
}