
export async function postInvoiceAttestations (
    addresses: string[], 
    invoiceSchemaIDs: string[]
) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postInvoiceAttestations`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                addresses: addresses,
                invoiceSchemaIDs: invoiceSchemaIDs
            })
        }) 
        const data =  await res.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
    
}