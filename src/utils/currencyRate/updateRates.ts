import { currencies } from "../constants/addresses.js"

export async function updateRates (
    rates: string[]
) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/updateCurrencyRates`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                currencies: currencies,
                rates: rates
            })
        }) 
        const data =  await res.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}


