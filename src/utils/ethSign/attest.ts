import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    Attestation
} from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
  
export async function attest(attestation: Attestation) {
    try {
        const privateKey = process.env.PRIVATE_KEY as `0x${string}`; // account responsible for paying gas fees
  
        const client = new SignProtocolClient(SpMode.OnChain, {
            chain: EvmChains.celo,
            account: privateKeyToAccount(privateKey) // required in backend environments
        });

        const data = await client.createAttestation(attestation)
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
    }
}