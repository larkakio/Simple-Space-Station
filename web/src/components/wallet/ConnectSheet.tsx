"use client";

import { base } from "wagmi/chains";
import { useConnect, useConnectors } from "wagmi";

type ConnectSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function ConnectSheet({ open, onClose }: ConnectSheetProps) {
  const connectors = useConnectors();
  const { connectAsync, isPending, error } = useConnect();

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm safe-area-pb"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-t-2xl border border-[var(--neon-cyan)]/40 bg-[#070b12] p-4 shadow-[0_0_40px_rgba(0,255,209,0.12)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="connect-title" className="font-[family-name:var(--font-geist-sans)] text-lg tracking-wide text-white">
            Connect wallet
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            Close
          </button>
        </div>
        <p className="mb-4 text-sm text-zinc-500">
          Choose a wallet. You will be prompted for Base ({base.name}) when possible.
        </p>
        <ul className="flex flex-col gap-2">
          {connectors.map((c) => (
            <li key={c.uid}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  void connectAsync({ connector: c, chainId: base.id }).then(
                    () => onClose(),
                  );
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-white transition hover:border-[var(--neon-magenta)]/50 hover:bg-white/[0.06] disabled:opacity-40"
              >
                <span>{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
        {error ? (
          <p className="mt-3 text-sm text-amber-400/90">{error.message}</p>
        ) : null}
      </div>
    </div>
  );
}
