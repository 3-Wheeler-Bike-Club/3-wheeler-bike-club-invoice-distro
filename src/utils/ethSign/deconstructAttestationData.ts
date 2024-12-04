import { Attestation, DataLocationOnChain } from "@ethsign/sp-sdk"
import { attester, invoiceSchemaID, membershipDuesInUSD } from "../constants/addresses.js"
import { getWeekPlusYear } from "../misc/getWeekPlusYear.js"

export async function deconstructAttestationData( recipients: string[]) {
    const weekPlusYear = await getWeekPlusYear(new Date())
    const schemaData = {
        Amount: membershipDuesInUSD,
        Week: weekPlusYear
    }
    const deconstructedAttestationData: Attestation= {
        schemaId: (invoiceSchemaID), // The final number from our schema's ID.
        indexingValue: "0",
        linkedAttestationId: null, // We are not linking an attestation.
        attestTimestamp: 0, // Will be generated for us.
        revokeTimestamp: 0, // Attestation is not revoked.
        attester: attester, // Alice's address.
        validUntil: 0, // We are not setting an expiry date.
        dataLocation: DataLocationOnChain.ONCHAIN, // We are placing data on-chain.
        revoked: false, // The attestation is not revoked.
        recipients: recipients, // Bob is our recipient.
        data: schemaData // The encoded schema data.
    }

    return deconstructedAttestationData
}