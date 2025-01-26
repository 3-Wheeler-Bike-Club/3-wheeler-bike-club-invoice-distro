
export async function postMembersInvoiceAttestations (
    addresses: string[], 
    memberInvoiceAttestationIDs: string[],
    amount: number,
    week: string
) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postMembersInvoiceAttestations`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                addresses: addresses,
                memberInvoiceAttestationIDs: memberInvoiceAttestationIDs,
                amount: amount,
                week: week
            })
        }) 
        const data =  await res.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
    
}