import { Attestation, DataLocationOnChain } from "@ethsign/sp-sdk"
import { attester, memberCreditScoreSchemaID } from "../constants/addresses.js"


export interface MemberCreditScoreAttestationData {
    score: number
    paidWeeks: number
    invoicedWeeks: number
}
export async function deconstructMemberCreditScoreAttestationData( recipients: string[], score: number, paidWeeks: number, invoicedWeeks: number ) {
    const memberCreditScoreSchemaData: MemberCreditScoreAttestationData = {
        score: score,
        paidWeeks: paidWeeks,
        invoicedWeeks: invoicedWeeks
    }
    const deconstructedMemberCreditScoreAttestationData: Attestation= {
        schemaId: (memberCreditScoreSchemaID), // The final number from our schema's ID.
        indexingValue: "0",
        linkedAttestationId: null, // We are not linking an attestation.
        attestTimestamp: 0, // Will be generated for us.
        revokeTimestamp: 0, // Attestation is not revoked.
        attester: attester, // Alice's address.
        validUntil: 0, // We are not setting an expiry date.
        dataLocation: DataLocationOnChain.ONCHAIN, // We are placing data on-chain.
        revoked: false, // The attestation is not revoked.
        recipients: recipients, // Bob is our recipient.
        data: memberCreditScoreSchemaData // The encoded schema data.
    }   
    return deconstructedMemberCreditScoreAttestationData
}