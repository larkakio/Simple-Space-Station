"use client";

import { useState } from "react";
import { base } from "wagmi/chains";
import { useAccount, useChainId, useDisconnect, useSwitchChain } from "wagmi";
import { ConnectSheet } from "./ConnectSheet";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletBar() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [sheetOpen, setSheetOpen] = useState(false);

  const wrongNetwork = isConnected && chainId !== base.id;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050810]/90 backdrop-blur-md safe-area-pt">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-3 py-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--neon-cyan)]">
            SSS
          </span>
          <div className="flex items-center gap-2">
            {isConnected && address ? (
              <>
                <span className="hidden max-w-[10rem] truncate rounded-lg border border-white/10 bg-black/30 px-2 py-1 font-mono text-xs text-zinc-300 sm:inline">
                  {truncateAddress(address)}
                </span>
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-400 hover:border-white/30 hover:text-white"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="rounded-xl border border-[var(--neon-magenta)]/60 bg-[var(--neon-magenta)]/10 px-4 py-2 text-sm font-medium text-[var(--neon-magenta)] shadow-[0_0_20px_rgba(255,0,170,0.15)] hover:bg-[var(--neon-magenta)]/20"
              >
                Connect wallet
              </button>
            )}
          </div>
        </div>
        {wrongNetwork ? (
          <div className="border-t border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <div className="mx-auto flex max-w-lg flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-amber-200/90">
                Wrong network — switch to Base to use check-in.
              </p>
              <button
                type="button"
                disabled={isSwitching}
                onClick={() => switchChain({ chainId: base.id })}
                className="shrink-0 rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-100 hover:bg-amber-500/30 disabled:opacity-50"
              >
                {isSwitching ? "Switching…" : "Switch to Base"}
              </button>
            </div>
          </div>
        ) : null}
      </header>
      <ConnectSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
