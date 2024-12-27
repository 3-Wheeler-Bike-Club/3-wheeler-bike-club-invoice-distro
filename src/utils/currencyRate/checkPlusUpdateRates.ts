import { checkRates } from "./checkRates.js";
import { updateRates } from "./updateRates.js";

export async function checkPlusUpdateRates() {
    const rates = await checkRates()
    if (rates && rates.length > 0) {
        await updateRates(rates.map(rate => rate.toString()));
    }
}