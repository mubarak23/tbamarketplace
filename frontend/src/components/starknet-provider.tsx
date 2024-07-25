"use client";
import { ReactNode } from "react";

import { mainnet } from "@starknet-react/chains";
import {
	StarknetConfig,
	argent,
	braavos,
	jsonRpcProvider,
	publicProvider,
	useInjectedConnectors,
	voyager,
} from "@starknet-react/core";
import { RpcProviderOptions } from "starknet";

export function StarknetProvider({ children }: { children: ReactNode }) {
	const testnetOptions: RpcProviderOptions = {
		// nodeUrl: apiUrl("call", { network: "testnet" }),
		nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
		// chainId: SN_SEPOLIA_CHAINID,
	};

	const provider = jsonRpcProvider({
		rpc: () => testnetOptions,
	});

	const { connectors } = useInjectedConnectors({
		// Show these connectors if the user has no connector installed.
		recommended: [argent(), braavos()],
		// Hide recommended connectors if the user has any connector installed.
		includeRecommended: "onlyIfNoConnectors",
		// Randomize the order of the connectors.
		order: "random",
	});

	return (
		<StarknetConfig
			chains={[mainnet]}
			provider={provider}
			connectors={connectors}
			explorer={voyager}
		>
			{children}
		</StarknetConfig>
	);
}
