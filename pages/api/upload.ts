import { NextApiRequest, NextApiResponse } from "next"

export default async function handler (request: NextApiRequest, response: NextApiResponse) {
  // Check method
  if (request.method !== "POST")
    return response.status(405).end();
  // Get url
  const res = await fetch("https://www.fill3d.ai/api/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.FILL3D_API_KEY}` }
  });
  const { url, error } = await res.json();
  // Check error
  if (error)
    return response.status(400).json({ error });
  // Return
  return response.status(200).json({ url });
}