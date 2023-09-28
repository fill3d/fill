/**
 * We have to rename the `Function` import because Vercel doesn't allow 
 * the literal "new Function" to be used in their edge runtime.
 */
import { Function as Fxn, Value } from "fxnjs"
import { NextResponse, NextRequest } from "next/server"

export default async function handler (request: NextRequest) {
    const { method, headers } = request;
    // Check method
    if (method !== "POST")
        return NextResponse.json({}, { status: 400 });
    try {
        // Fill
        // See https://fxn.ai/@fill3d/fill for more info
        const { image: imageUrl, prompts } = await request.json();
        const fxn = new Fxn({ accessKey: process.env.FILL_3D_API_KEY });
        const prediction = await fxn.predictions.create({
            tag: "@fill3d/fill",
            inputs: {
                image: { data: imageUrl, type: "image" },
                prompts
            }
        });
        // Check error
        if (prediction.error)
            throw new Error(prediction.error);
        // Respond
        const image = prediction.results[0] as Value;
        return NextResponse.json({ result: image.data });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export const config = {
    runtime: "edge",
    maxDuration: 300, // requires Vercel Pro plan
};