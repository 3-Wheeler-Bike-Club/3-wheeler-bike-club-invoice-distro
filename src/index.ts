import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { getSmartWalletsPlusEmailsFromPrivyUsers } from "./utils/privy/getSmartWalletsPlusEmailsFromPrivyUsers.js"
import { attestInvoice } from "./utils/ethSign/attestInvoice.js";
import { sendEmail } from "./utils/mail/sendEmail.js";
import { deconstructAttestationData } from "./utils/ethSign/deconstructAttestationData.js";
import schedule from "node-schedule"
import { postMembersInvoiceAttestations } from "./utils/offchainAttest/postMembersInvoiceAttestations.js";
import { checkPlusUpdateRates } from "./utils/currencyRate/checkPlusUpdateRates.js";
import { getWeekPlusYear } from "./utils/misc/getWeekPlusYear.js";
import { membershipDuesInUSD } from "./utils/constants/addresses.js";

dotenv.config()

const app: Express = express();
const port = process.env.PORT || 8000;


app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});
//////////////////////////////////////////////////////////////////////////////



//get all users smart wallets from privy
//send invoice attestation to all wallets...looped
//send email notifications to all emails...looped

async function attestInvoicePlusSendEmail() {
    try {    
        const members = await getSmartWalletsPlusEmailsFromPrivyUsers()
        // Extracting smart wallet addresses
        const membersSmartWallets: string[] = members.map(member => member.smartWallet);
        
        const weekPlusYear = await getWeekPlusYear(new Date())
        let invoices: string[] = []
        
        //send email loop
        for (let i = 0; i < members.length; i++) {
            const member = members[i]
            const membersSmartWallet = membersSmartWallets[i]
            
            //deconstruct attestation data
            let recipient = []
            recipient.push(membersSmartWallet)
            
            const attestationData = await deconstructAttestationData(recipient, membershipDuesInUSD, weekPlusYear)

            //create attestation
            const attestedInvoice = await attestInvoice(attestationData)
            invoices.push(attestedInvoice?.attestationId!)
            
            //send email
            await sendEmail(member.email)
        }  
        postMembersInvoiceAttestations(membersSmartWallets, invoices!, membershipDuesInUSD, weekPlusYear)
    } catch (error) {
        console.log(error)
    }
}

//run function once every week
// Schedule the task to run every Monday at 8:00 AM
/*
schedule.scheduleJob({ hour: 8, minute: 0, dayOfWeek: 3 }, function() {
    attestInvoicePlusSendEmail()
});
*/
schedule.scheduleJob("0 12 * * *", function() {
    attestInvoicePlusSendEmail()
    console.log('Invoice Job ran successfully at:', new Date());
});

schedule.scheduleJob("0 17 * * *", async function() {
    checkPlusUpdateRates()
    console.log('Currency Update Job ran successfully at:', new Date());
});


///////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
  