import { Language, getDictionary } from "@/dictionaries";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Nooc's Post";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function OGImage({
  params,
}: {
  params: {
    lang: Language;
  };
}) {
  const SHS = fetch(
    new URL("../../../../public/SHS.otf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const dictionary = await getDictionary(params.lang);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
        }}
      >
        <svg
          width="256"
          height="256"
          viewBox="0 0 256 256"
          fill="none"
          style={{
            borderRadius: 64,
            alignSelf: "center",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="256" height="256" fill="url(#paint0_linear_302_30)" />
          <g filter="url(#filter0_i_302_30)">
            <path
              d="M127.68 34.5601C179.109 34.5601 220.8 76.2513 220.8 127.68C220.8 153.437 210.342 176.752 193.441 193.61L127.36 127.53L61.5996 193.29C44.8861 176.458 34.56 153.275 34.56 127.68C34.56 76.2513 76.2512 34.5601 127.68 34.5601Z"
              fill="#FFCF43"
            />
          </g>
          <defs>
            <filter
              id="filter0_i_302_30"
              x="34.56"
              y="34.5601"
              width="186.24"
              height="159.05"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="37.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 0.968627 0 0 0 0 0.815686 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_302_30"
              />
            </filter>
            <linearGradient
              id="paint0_linear_302_30"
              x1="128"
              y1="0"
              x2="128"
              y2="256"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#3B82F6" stop-opacity="0.65" />
              <stop offset="1" stop-color="#3B82F6" stop-opacity="0.85" />
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            fontSize: 64,
            marginTop: 64,
          }}
        >
          {dictionary.meta.websiteName}
        </div>
        <div
          style={{
            fontSize: 48,
            opacity: 0.5,
            marginTop: 16,
          }}
        >
          {dictionary.meta.motto}
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "SHS",
          data: await SHS,
        },
      ],
    },
  );
}
