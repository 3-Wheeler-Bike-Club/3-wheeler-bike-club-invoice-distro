export async function postMemberInvoiceAttestation (
    address: string,
    memberInvoiceAttestationID: string,
    amount: number,
    week: string,
) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postMemberInvoiceAttestation`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                address: address,
                memberInvoiceAttestationID: memberInvoiceAttestationID,
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
