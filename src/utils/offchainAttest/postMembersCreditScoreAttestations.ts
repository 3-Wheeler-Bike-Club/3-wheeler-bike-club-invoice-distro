import { MemberCreditScoreAttestationData } from "../ethSign/deconstructMemberCreditScoreAttestationData"

export async function postMembersCreditScoreAttestations (
    addresses: string[], 
    memberCreditScoreAttestationIDs: string[],
    memberCreditScoreAttestationsData: MemberCreditScoreAttestationData[]
) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postMembersCreditScoreAttestations`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                addresses: addresses,
                memberCreditScoreAttestationIDs: memberCreditScoreAttestationIDs,
                memberCreditScoreAttestationsData: memberCreditScoreAttestationsData

            })
        }) 
        const data =  await res.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
    
}