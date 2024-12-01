import { PrivyClient } from "@privy-io/server-auth";

//get users list from privy servers
export async function getUsersFromPrivy() {
    try {
        const privy = new PrivyClient(process.env.PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!);
        const users = await privy.getUsers();
        console.log(users)
        return users
    } catch (error) {
        console.log(error)
    }
}