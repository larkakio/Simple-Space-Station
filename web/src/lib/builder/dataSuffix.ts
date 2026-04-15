import { Attribution } from "ox/erc8021";
import type { Hex } from "viem";
import { builderCode, builderCodeSuffixOverride } from "@/lib/env";

/** ERC-8021 suffix for Builder Code attribution on check-in transactions. */
export function getCheckInDataSuffix(): Hex | undefined {
  if (builderCodeSuffixOverride) {
    return builderCodeSuffixOverride;
  }
  if (!builderCode) {
    return undefined;
  }
  return Attribution.toDataSuffix({
    codes: [builderCode],
  }) as Hex;
}
