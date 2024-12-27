import { currencies } from "../constants/addresses.js";


export async function checkRates() {
  try {
    const appId = process.env.OPENEXCHANGE_APP_ID
    const url = `https://openexchangerates.org/api/latest.json?app_id=${appId}&base=USD&symbols=GHS%2CNGN%2CKES%2CEGP&prettyprint=false&show_alternative=false`;
        
   
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }) 
    const data = await res.json()
    const rates = data.rates
    
    // Extract rates and add 5% markup
    const extractedRates = currencies.map(currency => {
      const rate = rates[currency];
      // Adds 5% to each rate
      return Number((rate * 1.05).toFixed(2)); // Rounds to 2 decimal places
    });

    console.log('Extracted rates:', extractedRates);
    return extractedRates;
  } catch (error) {
    console.log(error)
  } 
}