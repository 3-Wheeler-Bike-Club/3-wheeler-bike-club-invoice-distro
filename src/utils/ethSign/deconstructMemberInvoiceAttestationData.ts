import { Attestation, DataLocationOnChain } from "@ethsign/sp-sdk"
import { attester, memberInvoiceSchemaID } from "../constants/addresses.js"

export interface MemberInvoiceAttestationData {
    amount: number
    week: string
}

export async function deconstructMemberInvoiceAttestationData( recipients: string[], amount: number, week: string) {
    const memberInvoiceSchemaData: MemberInvoiceAttestationData = {
        amount: amount,
        week: week
    }
    
    const deconstructedAttestationData: Attestation= {
        schemaId: (memberInvoiceSchemaID), // The final number from our schema's ID.
        indexingValue: "0",
        linkedAttestationId: null, // We are not linking an attestation.
        attestTimestamp: 0, // Will be generated for us.
        revokeTimestamp: 0, // Attestation is not revoked.
        attester: attester, // Alice's address.
        validUntil: 0, // We are not setting an expiry date.
        dataLocation: DataLocationOnChain.ONCHAIN, // We are placing data on-chain.
        revoked: false, // The attestation is not revoked.
        recipients: recipients, // Bob is our recipient.
        data: memberInvoiceSchemaData // The encoded schema data.
    }

    return deconstructedAttestationData
}