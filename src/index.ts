import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import schedule from "node-schedule"
import { getSmartWalletsPlusEmailsFromPrivyUsers } from "./utils/privy/getSmartWalletsPlusEmailsFromPrivyUsers.js"
import { attest } from "./utils/ethSign/attest.js";
import { revoke } from "./utils/ethSign/revoke.js";
import { sendEmail } from "./utils/mail/sendEmail.js";
import { postMembersInvoiceAttestations } from "./utils/offchainAttest/postMembersInvoiceAttestations.js";
import { checkPlusUpdateRates } from "./utils/currencyRate/checkPlusUpdateRates.js";
import { getWeekPlusYear } from "./utils/misc/getWeekPlusYear.js";
import { membershipDuesInUSD } from "./utils/constants/addresses.js";
import { deconstructMemberInvoiceAttestationData } from "./utils/ethSign/deconstructMemberInvoiceAttestationData.js";
import { deconstructMemberCreditScoreAttestationData, MemberCreditScoreAttestationData } from "./utils/ethSign/deconstructMemberCreditScoreAttestationData.js";
import { getMembersCreditScoreAttestaions } from "./utils/offchainAttest/getMembersCreditScoreAttestaions.js";
import { postMembersCreditScoreAttestations } from "./utils/offchainAttest/postMembersCreditScoreAttestations.js";
import { postMemberInvoiceAttestation } from "./utils/offchainAttest/postMemberInvoiceAttestation.js";
import { postMemberCreditScoreAttestation } from "./utils/offchainAttest/postMemberCreditScoreAttestation.js";


dotenv.config()

const app: Express = express();
const port = process.env.PORT || 8000;


app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});
//////////////////////////////////////////////////////////////////////////////


async function attestSingleInvoice(wallet: string, email: string) {
    const weekPlusYear = await getWeekPlusYear(new Date())

    //deconstruct member invoice attestation data
    let recipient = []
    recipient.push(wallet)

    const memberInvoiceAttestationData = await deconstructMemberInvoiceAttestationData(recipient, membershipDuesInUSD, weekPlusYear)
    const attestedMemberInvoice = await attest(memberInvoiceAttestationData)
    postMemberInvoiceAttestation(wallet, attestedMemberInvoice?.attestationId!, membershipDuesInUSD, weekPlusYear)


    // deconstruct credit score attestation data
    const creditScoreAttestationData = await deconstructMemberCreditScoreAttestationData(recipient, 0, 0, 1)
    //create credit score attestation
    const attestedMemberCreditScore = await attest(creditScoreAttestationData)
    postMemberCreditScoreAttestation(wallet, attestedMemberCreditScore?.attestationId!, 0, 0, 1)
    //send email
    await sendEmail(email)

}


//get all users smart wallets from privy
//send invoice attestation to all wallets...looped
//send email notifications to all emails...looped

async function attestInvoicePlusSendEmail() {
    try {    
        const members = await getSmartWalletsPlusEmailsFromPrivyUsers()
        // Extracting smart wallet addresses
        const membersSmartWallets: string[] = members.map(member => member.smartWallet);

        //get credit score attestations from db
        
        const memberCreditScoreAttestations = await getMembersCreditScoreAttestaions()

        
        const weekPlusYear = await getWeekPlusYear(new Date())
        let memberInvoiceAttestationsIDs: string[] = []
        let memberCreditScoreAttestationsIDs: string[] = []
        let memberCreditScoreAttestationsData: MemberCreditScoreAttestationData[] = []
        
        //send email loop
        for (let i = 0; i < members.length; i++) {
            const member = members[i]
            const membersSmartWallet = membersSmartWallets[i]
            
            //deconstruct member invoice attestation data
            let recipient = []
            recipient.push(membersSmartWallet)
            
            const memberInvoiceAttestationData = await deconstructMemberInvoiceAttestationData(recipient, membershipDuesInUSD, weekPlusYear)

            //create member invoice attestation
            const attestedMemberInvoice = await attest(memberInvoiceAttestationData)
            memberInvoiceAttestationsIDs.push(attestedMemberInvoice?.attestationId!)
            

            const memberCreditScoreAttestation = memberCreditScoreAttestations?.find(
                memberCreditScoreAttestation => memberCreditScoreAttestation.address.toLowerCase() === membersSmartWallet.toLowerCase()
            );


            //revoke + attest or  attest credit core invoice sent count on chain
            
            //check credit scores attestations from db
            if (memberCreditScoreAttestation) {
                // if exists, revoke 
                const revokedCreditScoreAttestation = await revoke(memberCreditScoreAttestation.memberCreditScoreAttestationID)
                console.log(revokedCreditScoreAttestation)
                if (revokedCreditScoreAttestation) {
                    //+ credit score attest
                    const oldMemberNewCreditScoreAttestationData: MemberCreditScoreAttestationData = {
                        score: memberCreditScoreAttestation.score,
                        paidWeeks: memberCreditScoreAttestation.paidWeeks,
                        invoicedWeeks: (memberCreditScoreAttestation.invoicedWeeks + 1)
                    }
                    // deconstruct credit score attestation data
                    const creditScoreAttestationData = await deconstructMemberCreditScoreAttestationData(recipient, oldMemberNewCreditScoreAttestationData.score, oldMemberNewCreditScoreAttestationData.paidWeeks, oldMemberNewCreditScoreAttestationData.invoicedWeeks)
                    //create credit score attestation
                    const attestedCreditScore = await attest(creditScoreAttestationData)
                    memberCreditScoreAttestationsIDs.push(attestedCreditScore?.attestationId!)
                    memberCreditScoreAttestationsData.push(oldMemberNewCreditScoreAttestationData)
                }
                
            } else {
                // if null, create new credit score attestation
                //static template for new credit score attestation
                const newMemberCreditScoreAttestations: MemberCreditScoreAttestationData = {
                    score: 0, // Default starting score
                    paidWeeks: 0, // No payments made yet
                    invoicedWeeks: 1 // First invoice being sent
                }
                
                // deconstruct credit score attestation data
                const creditScoreAttestationData = await deconstructMemberCreditScoreAttestationData(recipient, newMemberCreditScoreAttestations.score, newMemberCreditScoreAttestations.paidWeeks, newMemberCreditScoreAttestations.invoicedWeeks)
                //create credit score attestation
                const attestedMemberCreditScore = await attest(creditScoreAttestationData)
                memberCreditScoreAttestationsIDs.push(attestedMemberCreditScore?.attestationId!)
                memberCreditScoreAttestationsData.push(newMemberCreditScoreAttestations)
            }
            
            
            
            
            
            
            //send email
            await sendEmail(member.email)
        }  
        postMembersInvoiceAttestations(membersSmartWallets, memberInvoiceAttestationsIDs!, membershipDuesInUSD, weekPlusYear)
        //update or create credit core invoice sent count off chain
        postMembersCreditScoreAttestations(membersSmartWallets, memberCreditScoreAttestationsIDs!, memberCreditScoreAttestationsData)
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
schedule.scheduleJob("0 0 * * 1", function() {
    attestInvoicePlusSendEmail()
    console.log('Invoice Job ran successfully at:', new Date());
});

schedule.scheduleJob("0 17 * * *", async function() {
    checkPlusUpdateRates()
    console.log('Currency Update Job ran successfully at:', new Date());
});


///////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    //attestSingleInvoice("0x803B021b9177F2ECDfE1818FAa8E5dce4A1CE574", "9090mustaphaibrahim@gmail.com")

    //checkPlusUpdateRates()
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
  