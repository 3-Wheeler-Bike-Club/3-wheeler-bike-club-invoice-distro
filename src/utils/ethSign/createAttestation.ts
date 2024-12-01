import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    Attestation
} from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
  
export async function createAttestation(attestation: Attestation) {
    try {
        const privateKey = process.env.PRIVATE_KEY as `0x${string}`; // account responsible for paying gas fees
  
        const client = new SignProtocolClient(SpMode.OnChain, {
            chain: EvmChains.sepolia,
            account: privateKeyToAccount(privateKey) // required in backend environments
        });

        client.createAttestation(attestation)
    } catch (error) {
        console.log(error)
    }
}