import express, { Express, Request, Response } from 'express'

const app: Express = express();
const port = process.env.PORT || 8000;

//get all users smart wallets from privy
//send invoice attestation to all wallets...looped
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});
  
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
  