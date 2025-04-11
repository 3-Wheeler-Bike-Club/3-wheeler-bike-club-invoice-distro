export async function postMemberCreditScoreAttestation (
    address: string,
    memberCreditScoreAttestationID: string,
    score: number,
    paidWeeks: number,
    invoicedWeeks: number,
) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postNewMemberCreditScoreAttestation`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                address: address,
                memberCreditScoreAttestationID: memberCreditScoreAttestationID,
                score: score,
                paidWeeks: paidWeeks,
                invoicedWeeks: invoicedWeeks
            })
        }) 
        const data =  await res.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
