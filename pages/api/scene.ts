import { NextApiRequest, NextApiResponse } from "next"

export default async function handler (request: NextApiRequest, response: NextApiResponse) {
  const { method, body: { image } } = request;
  // Check method
  if (method !== "POST")
    return response.status(405).end();
  // Create scene
  const res = await fetch("https://www.fill3d.ai/api/v1/scenes", {
    method: "POST",
    body: JSON.stringify({ image }),
    headers: {
      "Authorization": `Bearer ${process.env.FILL3D_API_KEY}`,
      "Content-Type": "application/json"
    }
  });
  const { error, ...payload } = await res.json();
  // Check error
  if (error)
    return response.status(400).json({ error });
  // Respond
  return response.status(200).json(payload);
}

export const config = {
  maxDuration: 300,
};