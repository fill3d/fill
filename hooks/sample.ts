import { Prompt } from "../components/promptForm"

export interface UseSampleReturn {
  imageUrl: string;
  prompts: Record<string, Prompt>;
}

export function useSample (): UseSampleReturn {
  return {
    imageUrl: "/sample.jpg",
    prompts: {
      "InDipQTHVnnmDBK8cW3Ii": {
        uid: "InDipQTHVnnmDBK8cW3Ii",
        x: -0.0166015625,
        y: 0.38945827232796487,
        width: 0.8427734375,
        height: 0.6325036603221084,
        anchor: {
          x: 0.27294921875,
          y: 0.6032210834553442
        },
        prompt: "pink bed",
        choiceIdx: 1,
        choices: [
          {
            id: "1755a6fa-6e64-441a-bc4e-8cbe38343879",
            preview: "https://public.blenderkit.com/thumbnails/assets/1755a6fa6e64441abc4e8cbe38343879/files/thumbnail_70e3e49b-5326-4728-8514-a68620853b52.jpg.1024x1024_q85_crop-%2C.jpg"
          },
          {
            id: "21eadbf0-db80-4b5c-9ec9-2dae46109776",
            preview: "https://public.blenderkit.com/thumbnails/assets/21eadbf0db804b5c9ec92dae46109776/files/thumbnail_1b48d752-a482-4a2a-9f76-0ffd9fdaa196.jpg.1024x1024_q85_crop-%2C.jpg"
          },
          {
            id: "f5d42e12-db07-40ce-92bc-02e1072fb650",
            preview: "https://public.blenderkit.com/thumbnails/assets/f5d42e12db0740ce92bc02e1072fb650/files/thumbnail_671a367f-0888-4c55-98ab-365955944dd4.jpg.1024x1024_q85_crop-%2C.jpg"
          },
          {
            id: "328c4c2b-c395-49ec-b6e4-1960b5730374",
            preview: "https://public.blenderkit.com/thumbnails/assets/328c4c2bc39549ecb6e41960b5730374/files/thumbnail_4ac68b94-e393-4b44-9348-80575998b638.png.1024x1024_q85_crop-%2C.png"
          }
        ]
      }
    },
  }
}