import { getUsersFromPrivy } from "./getUsersFromPrivy.js";

export interface Member {
    smartWallet: `0x${string}`
    email: string
}


// Extract smart account addresses and emails from user details
export async function getSmartWalletsPlusEmailsFromPrivyUsers(): Promise<Member[]> {
    try {
        const users = await getUsersFromPrivy();
        console.log(users);

        if (users && users.length > 0) {
            // Map over users to extract smart wallet addresses and emails
            const members: Member[] = users.map(user => {
                const smartWalletAddress = user.smartWallet?.address || null;
                const email = user.email?.address || "";

                return smartWalletAddress
                    ? { smartWallet: smartWalletAddress as `0x${string}`, email }
                    : null;
            }).filter((member): member is Member => member !== null); // Filter out null values

            console.log(members);
            return members;
        } else {
            console.log("No users found.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}