interface OffchainMemberCreditScoreAttestation {
    _id: string
    address: string
    score: number
    paidWeeks: number
    invoicedWeeks: number
}

export async function getMembersCreditScoreAttestaions () {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/getMembersCreditScoreAttestaions`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
        }) 
        const data =  await res.json()
        console.log(data)
        return data as OffchainMemberCreditScoreAttestation[]
    } catch (error) {
        console.log(error)
    }
    
}