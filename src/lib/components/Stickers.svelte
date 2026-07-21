<script lang="ts">
  import { onMount } from "svelte";

  /**
   * Draggable decorative stickers on the printer shell. Layout and stacking
   * order persist in localStorage.
   */

  type StickerId =
    | "github"
    | "docker"
    | "cloudflare"
    | "codex"
    | "claude"
    | "typescript"
    | "swift";

  interface StickerDefinition {
    id: StickerId;
    label: string;
    width: number;
    height: number;
    rotation: number;
    color: string;
    /** SVG path d attribute in a 0 0 24 24 viewBox. */
    svgPath: string;
    /** Optional path for the sticker backing when it should differ from the icon path. */
    bgPath?: string;
    /** SVG fill rule for compound paths with cutouts. */
    fillRule?: "nonzero" | "evenodd";
    /**
     * How the white sticker backing is drawn:
     *  - "circle"       — a simple <circle> behind the icon (GitHub)
     *  - "rounded-rect" — a <rect rx> behind the icon (TypeScript, Swift)
     *  - "silhouette"   — paint-order stroke expansion of the icon path
     */
    bgShape: "circle" | "rounded-rect" | "silhouette";
    bgRadius?: number;
    /** Hide the subtle outline around the sticker backing. */
    hideBgBorder?: boolean;
    /** Padding between backing and icon path (SVG units in 0-24 viewBox). */
    innerPadding?: number;
    /** Optional optical centering offset for icon path (SVG units). */
    iconOffsetX?: number;
    iconOffsetY?: number;
  }

  // SVG paths normalized to viewBox 0 0 24 24.
  const SI_PATHS: Record<StickerId, string> = {
    github:
      "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    docker:
      "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z",
    cloudflare:
      "M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727",
    codex:
      "M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z",
    claude:
      "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
    typescript:
      "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z",
    swift:
      "M7.508 0c-.287 0-.573 0-.86.002-.241.002-.483.003-.724.01-.132.003-.263.009-.395.015A9.154 9.154 0 0 0 4.348.15 5.492 5.492 0 0 0 2.85.645 5.04 5.04 0 0 0 .645 2.848c-.245.48-.4.972-.495 1.5-.093.52-.122 1.05-.136 1.576a35.2 35.2 0 0 0-.012.724C0 6.935 0 7.221 0 7.508v8.984c0 .287 0 .575.002.862.002.24.005.481.012.722.014.526.043 1.057.136 1.576.095.528.25 1.02.495 1.5a5.03 5.03 0 0 0 2.205 2.203c.48.244.97.4 1.498.495.52.093 1.05.124 1.576.138.241.007.483.009.724.01.287.002.573.002.86.002h8.984c.287 0 .573 0 .86-.002.241-.001.483-.003.724-.01a10.523 10.523 0 0 0 1.578-.138 5.322 5.322 0 0 0 1.498-.495 5.035 5.035 0 0 0 2.203-2.203c.245-.48.4-.972.495-1.5.093-.52.124-1.05.138-1.576.007-.241.009-.481.01-.722.002-.287.002-.575.002-.862V7.508c0-.287 0-.573-.002-.86a33.662 33.662 0 0 0-.01-.724 10.5 10.5 0 0 0-.138-1.576 5.328 5.328 0 0 0-.495-1.5A5.039 5.039 0 0 0 21.152.645 5.32 5.32 0 0 0 19.654.15a10.493 10.493 0 0 0-1.578-.138 34.98 34.98 0 0 0-.722-.01C17.067 0 16.779 0 16.492 0H7.508zm6.035 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z",
  };

  const STICKERS: StickerDefinition[] = [
    {
      id: "github",
      label: "GitHub",
      width: 42,
      height: 42,
      rotation: -6,
      color: "#181717",
      svgPath: SI_PATHS.github,
      bgShape: "circle",
      hideBgBorder: true,
      innerPadding: 1.6,
      iconOffsetY: -0.35,
    },
    {
      id: "docker",
      label: "Docker",
      width: 48,
      height: 38,
      rotation: 2,
      color: "#2496ED",
      svgPath: SI_PATHS.docker,
      bgShape: "silhouette",
    },
    {
      id: "cloudflare",
      label: "Cloudflare",
      width: 50,
      height: 38,
      rotation: 8,
      color: "#F38020",
      svgPath: SI_PATHS.cloudflare,
      bgShape: "silhouette",
    },
    {
      id: "codex",
      label: "Codex",
      width: 39,
      height: 39,
      rotation: -4,
      color: "#7A9DFF",
      svgPath: SI_PATHS.codex,
      // Outer hull only (no cutouts), used for the backing silhouette.
      bgPath:
        "M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457z",
      fillRule: "evenodd",
      bgShape: "silhouette",
      hideBgBorder: true,
      innerPadding: 1.6,
    },
    {
      id: "claude",
      label: "Claude",
      width: 42,
      height: 42,
      rotation: 6,
      color: "#D97757",
      svgPath: SI_PATHS.claude,
      bgShape: "silhouette",
      hideBgBorder: true,
      innerPadding: 1.6,
    },
    {
      id: "typescript",
      label: "TypeScript",
      width: 38,
      height: 38,
      rotation: 4,
      color: "#3178C6",
      svgPath: SI_PATHS.typescript,
      bgShape: "rounded-rect",
      bgRadius: 2,
      hideBgBorder: true,
      innerPadding: 1.6,
    },
    {
      id: "swift",
      label: "Swift",
      width: 38,
      height: 38,
      rotation: -5,
      color: "#F05138",
      svgPath: SI_PATHS.swift,
      bgShape: "rounded-rect",
      bgRadius: 5.5,
      hideBgBorder: true,
      innerPadding: 1.6,
    },
  ];

  type StickerLayout = Record<StickerId, { x: number; y: number }>;
  type StickerOrder = StickerId[];

  const DEFAULT_ORDER: StickerOrder = STICKERS.map((sticker) => sticker.id);
  const LAYOUT_KEY = "__printer_sticker_layout_v6__";
  const ORDER_KEY = "__printer_sticker_order_v2__";
  const NORMALIZE_EPSILON_PX = 4;
  const SHELL_BOTTOM_SECTION_HEIGHT_PX = 20;
  const SHELL_BOTTOM_SAFE_GAP_PX = 2;

  const ANCHORS = [
    { x: 0.08, y: 0.14 },
    { x: 0.36, y: 0.1 },
    { x: 0.64, y: 0.1 },
    { x: 0.92, y: 0.14 },
    { x: 0.18, y: 0.4 },
    { x: 0.5, y: 0.38 },
    { x: 0.82, y: 0.4 },
  ];

  const STICKER_BY_ID = Object.fromEntries(
    STICKERS.map((sticker) => [sticker.id, sticker]),
  ) as Record<StickerId, StickerDefinition>;

  let container: HTMLDivElement;
  let layout = $state<StickerLayout | null>(null);
  let order = $state<StickerOrder>([...DEFAULT_ORDER]);
  let draggingId = $state<StickerId | null>(null);

  let dragState: {
    id: StickerId;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null = null;

  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  function boundsFor(sticker: StickerDefinition, width: number, height: number) {
    const minCenterX = sticker.width / 2;
    const maxCenterX = Math.max(minCenterX, width - sticker.width / 2);
    const minCenterY = sticker.height / 2;
    const maxCenterY = Math.max(
      minCenterY,
      height -
        SHELL_BOTTOM_SECTION_HEIGHT_PX -
        SHELL_BOTTOM_SAFE_GAP_PX -
        sticker.height / 2,
    );
    return { minCenterX, maxCenterX, minCenterY, maxCenterY };
  }

  function randomLayout(rect: DOMRect): StickerLayout {
    const anchors = [...ANCHORS];
    for (let i = anchors.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [anchors[i], anchors[j]] = [anchors[j], anchors[i]];
    }

    const result = {} as StickerLayout;
    STICKERS.forEach((sticker, index) => {
      const anchor = anchors[index] ?? { x: 0.5, y: 0.5 };
      const bounds = boundsFor(sticker, rect.width, rect.height);
      result[sticker.id] = {
        x: clamp(
          (anchor.x + (Math.random() - 0.5) * 0.05) * rect.width,
          bounds.minCenterX,
          bounds.maxCenterX,
        ),
        y: clamp(
          (anchor.y + (Math.random() - 0.5) * 0.04) * rect.height,
          bounds.minCenterY,
          bounds.maxCenterY,
        ),
      };
    });
    return result;
  }

  function parseLayout(raw: string | null): StickerLayout | null {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<
        Record<StickerId, { x: unknown; y: unknown }>
      >;
      const result = {} as StickerLayout;
      for (const sticker of STICKERS) {
        const position = parsed[sticker.id];
        if (
          !position ||
          typeof position.x !== "number" ||
          typeof position.y !== "number"
        ) {
          return null;
        }
        result[sticker.id] = { x: position.x, y: position.y };
      }
      return result;
    } catch {
      return null;
    }
  }

  function parseOrder(raw: string | null): StickerOrder | null {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length !== STICKERS.length)
        return null;
      const seen = new Set<StickerId>();
      const result: StickerOrder = [];
      for (const value of parsed) {
        if (typeof value !== "string" || !(value in STICKER_BY_ID)) return null;
        const id = value as StickerId;
        if (seen.has(id)) return null;
        seen.add(id);
        result.push(id);
      }
      return result;
    } catch {
      return null;
    }
  }

  /** Clamp all stickers back into the shell (e.g. after a resize). */
  function normalize(current: StickerLayout): StickerLayout {
    const rect = container?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return current;

    const result = {} as StickerLayout;
    let changed = false;
    for (const sticker of STICKERS) {
      const position = current[sticker.id];
      const bounds = boundsFor(sticker, rect.width, rect.height);
      const clampedX = clamp(position.x, bounds.minCenterX, bounds.maxCenterX);
      const clampedY = clamp(position.y, bounds.minCenterY, bounds.maxCenterY);
      const x =
        Math.abs(clampedX - position.x) <= NORMALIZE_EPSILON_PX
          ? position.x
          : clampedX;
      const y =
        Math.abs(clampedY - position.y) <= NORMALIZE_EPSILON_PX
          ? position.y
          : clampedY;
      result[sticker.id] = { x, y };
      changed ||= x !== position.x || y !== position.y;
    }
    return changed ? result : current;
  }

  function persistLayout(value: StickerLayout) {
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(value));
    } catch {}
  }

  function persistOrder(value: StickerOrder) {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(value));
    } catch {}
  }

  onMount(() => {
    try {
      const storedOrder = parseOrder(localStorage.getItem(ORDER_KEY));
      if (storedOrder) order = storedOrder;
    } catch {}

    try {
      const stored = parseLayout(localStorage.getItem(LAYOUT_KEY));
      if (stored) layout = stored;
    } catch {}

    // The container can still be zero-sized when onMount fires; create (or
    // re-clamp) the layout once the shell actually has dimensions.
    const observer = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const next = layout ? normalize(layout) : randomLayout(rect);
      if (next !== layout) {
        layout = next;
        persistLayout(next);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  });

  function onPointerDown(event: PointerEvent, id: StickerId) {
    if (!layout) return;
    const rect = container.getBoundingClientRect();
    const position = layout[id];

    dragState = {
      id,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left - position.x,
      offsetY: event.clientY - rect.top - position.y,
    };

    if (order[order.length - 1] !== id) {
      order = [...order.filter((item) => item !== id), id];
      persistOrder(order);
    }
    draggingId = id;
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent, id: StickerId) {
    if (
      !dragState ||
      dragState.id !== id ||
      dragState.pointerId !== event.pointerId ||
      !layout
    ) {
      return;
    }

    event.preventDefault();
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const bounds = boundsFor(STICKER_BY_ID[id], rect.width, rect.height);
    layout = {
      ...layout,
      [id]: {
        x: clamp(
          event.clientX - rect.left - dragState.offsetX,
          bounds.minCenterX,
          bounds.maxCenterX,
        ),
        y: clamp(
          event.clientY - rect.top - dragState.offsetY,
          bounds.minCenterY,
          bounds.maxCenterY,
        ),
      },
    };
  }

  function finishDrag(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture?.(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    dragState = null;
    draggingId = null;
    if (layout) persistLayout(layout);
  }
</script>

<div
  bind:this={container}
  class="absolute inset-0 z-30 pointer-events-none"
  aria-label="shell stickers"
>
  {#if layout}
    {#each order as stickerId (stickerId)}
      {@const sticker = STICKER_BY_ID[stickerId]}
      {@const position = layout[stickerId]}
      {@const dragging = draggingId === stickerId}
      {@const iconScale = sticker.innerPadding
        ? (24 - sticker.innerPadding * 2) / 24
        : 1}
      {@const pathTransform = `translate(${sticker.iconOffsetX ?? 0} ${sticker.iconOffsetY ?? 0}) translate(12 12) scale(${iconScale}) translate(-12 -12)`}
      {@const bgPath = sticker.bgPath ?? sticker.svgPath}
      <button
        type="button"
        aria-label="{sticker.label} sticker"
        onpointerdown={(event) => onPointerDown(event, stickerId)}
        onpointermove={(event) => onPointerMove(event, stickerId)}
        onpointerup={finishDrag}
        onpointercancel={finishDrag}
        onlostpointercapture={finishDrag}
        class={[
          "shell-sticker absolute pointer-events-auto touch-none select-none",
          dragging ? "dragging z-50 cursor-grabbing" : "z-20 cursor-grab",
        ]}
        style:width="{sticker.width}px"
        style:height="{sticker.height}px"
        style:left="{position.x}px"
        style:top="{position.y}px"
        style:transform="translate3d(-50%, -50%, 0) rotate({sticker.rotation}deg)"
      >
        <svg
          class="sticker-art block h-full w-full"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <!-- White sticker backing -->
          {#if sticker.bgShape === "circle"}
            <circle cx="12" cy="12" r="12" fill="#ffffff" />
            {#if !sticker.hideBgBorder}
              <circle
                cx="12"
                cy="12"
                r="12"
                fill="none"
                class="stroke-black/13 dark:stroke-white/22"
                stroke-width="0.5"
                vector-effect="non-scaling-stroke"
              />
            {/if}
          {:else if sticker.bgShape === "rounded-rect"}
            <rect
              x="0"
              y="0"
              width="24"
              height="24"
              rx={sticker.bgRadius ?? 2}
              ry={sticker.bgRadius ?? 2}
              fill="#ffffff"
            />
            {#if !sticker.hideBgBorder}
              <rect
                x="0"
                y="0"
                width="24"
                height="24"
                rx={sticker.bgRadius ?? 2}
                ry={sticker.bgRadius ?? 2}
                fill="none"
                class="stroke-black/13 dark:stroke-white/22"
                stroke-width="0.5"
                vector-effect="non-scaling-stroke"
              />
            {/if}
          {:else}
            <!-- "silhouette" — paint-order stroke expansion around organic logo shapes -->
            <g transform={pathTransform}>
              <path
                d={bgPath}
                fill="#ffffff"
                fill-rule="nonzero"
                clip-rule="nonzero"
                stroke="#ffffff"
                stroke-width="3.2"
                stroke-linejoin="round"
                stroke-linecap="round"
                paint-order="stroke fill"
              />
            </g>
            {#if !sticker.hideBgBorder}
              <g transform={pathTransform}>
                <path
                  d={bgPath}
                  fill="none"
                  class="stroke-black/13 dark:stroke-white/22"
                  stroke-width="0.5"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  vector-effect="non-scaling-stroke"
                  paint-order="stroke fill"
                />
              </g>
            {/if}
          {/if}
          <!-- Icon -->
          <g transform={pathTransform}>
            <path
              d={sticker.svgPath}
              fill={sticker.color}
              fill-rule={sticker.fillRule ?? "nonzero"}
              clip-rule={sticker.fillRule ?? "nonzero"}
            />
          </g>
        </svg>
      </button>
    {/each}
  {/if}
</div>

<style>
  /* Resting stickers get a faint contact shadow so they read as stuck to the
     shell; dragging lifts them with a bigger, softer one. */
  .shell-sticker {
    filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.16));
    transition: filter 140ms ease-out;
  }
  .shell-sticker.dragging {
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2))
      drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
    transition: none;
    will-change: transform, filter;
  }
  :global(.dark) .shell-sticker {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.55));
  }
  :global(.dark) .shell-sticker.dragging {
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6))
      drop-shadow(0 2px 5px rgba(0, 0, 0, 0.45));
  }

  /* In dark mode the shell sits in dim ambient light — tone the whole
     sticker down uniformly (white backing included) instead of leaving the
     backings glaring at full #fff. */
  :global(.dark) .sticker-art {
    filter: saturate(0.9) brightness(0.82);
  }
</style>
