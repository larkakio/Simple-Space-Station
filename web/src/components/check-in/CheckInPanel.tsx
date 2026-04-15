"use client";

import { base } from "wagmi/chains";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { checkInAbi } from "@/lib/contracts/checkIn";
import { checkInContractAddress } from "@/lib/env";
import { getCheckInDataSuffix } from "@/lib/builder/dataSuffix";
import { isAddress } from "viem";

export function CheckInPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const contractReady =
    checkInContractAddress && isAddress(checkInContractAddress);

  const { data: streakOnChain, refetch } = useReadContract({
    chainId: base.id,
    address: contractReady ? checkInContractAddress : undefined,
    abi: checkInAbi,
    functionName: "streakOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contractReady && address) },
  });

  async function handleCheckIn() {
    if (!contractReady || !address) {
      return;
    }
    const baseId = base.id;
    if (chainId !== baseId) {
      await switchChainAsync({ chainId: baseId });
    }
    const dataSuffix = getCheckInDataSuffix();
    await writeContractAsync({
      address: checkInContractAddress,
      abi: checkInAbi,
      functionName: "checkIn",
      chainId: baseId,
      ...(dataSuffix ? { dataSuffix } : {}),
    });
    await refetch();
  }

  const busy = isSwitching || isWriting;
  const wrongNetwork = isConnected && chainId !== base.id;

  return (
    <section className="rounded-2xl border border-[var(--neon-lime)]/25 bg-black/40 p-4 shadow-[0_0_30px_rgba(180,255,0,0.06)]">
      <h3 className="mb-1 font-[family-name:var(--font-geist-sans)] text-sm font-semibold uppercase tracking-widest text-[var(--neon-lime)]">
        Daily check-in
      </h3>
      <p className="mb-3 text-xs leading-relaxed text-zinc-500">
        One check-in per UTC day on Base. You only pay L2 gas — no ETH sent to the
        contract.
      </p>
      {!contractReady ? (
        <p className="text-sm text-amber-400/90">
          Set <span className="font-mono">NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS</span>{" "}
          after deploying the contract.
        </p>
      ) : !isConnected ? (
        <p className="text-sm text-zinc-500">Connect a wallet to check in.</p>
      ) : (
        <>
          <div className="mb-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl text-white tabular-nums">
              {streakOnChain !== undefined ? String(streakOnChain) : "—"}
            </span>
            <span className="text-xs text-zinc-500">day streak</span>
          </div>
          <button
            type="button"
            disabled={busy || wrongNetwork}
            onClick={() => void handleCheckIn()}
            className="w-full rounded-xl border border-[var(--neon-cyan)]/50 bg-[var(--neon-cyan)]/10 py-3 text-sm font-medium text-[var(--neon-cyan)] shadow-[0_0_24px_rgba(0,255,209,0.12)] hover:bg-[var(--neon-cyan)]/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Confirm in wallet…" : "Check in on-chain"}
          </button>
          {wrongNetwork ? (
            <p className="mt-2 text-xs text-amber-400/90">
              Use the banner above to switch to Base first.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}
