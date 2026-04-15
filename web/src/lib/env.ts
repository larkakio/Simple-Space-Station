export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const targetChainId = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? "8453",
);

export const baseAppId =
  process.env.NEXT_PUBLIC_BASE_APP_ID ?? "simple-space-station";

export const checkInContractAddress = (
  process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS ?? ""
) as `0x${string}`;

export const builderCode = process.env.NEXT_PUBLIC_BUILDER_CODE ?? "";

export const builderCodeSuffixOverride = process.env
  .NEXT_PUBLIC_BUILDER_CODE_SUFFIX as `0x${string}` | undefined;

export const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
