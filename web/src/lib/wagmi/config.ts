import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { baseAccount, injected, walletConnect } from "wagmi/connectors";
import { walletConnectProjectId } from "@/lib/env";

const transports = {
  [base.id]: http(),
  [mainnet.id]: http(),
} as const;

const connectors = [
  injected(),
  baseAccount({
    appName: "Simple Space Station",
  }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
