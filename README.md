# Solana On-Chain Investigation Tool

This tool provides real-time interactive visualization and deep analysis of Solana blockchain activity, focusing on wallet transactions, token flows, and holder/trader interactions. It leverages data from Helius, Moralis, and Solana RPCs to offer comprehensive insights.

**Live Application:** [https://solana-onchain-fe.vercel.app/](https://solana-onchain-fe.vercel.app/)

## Application Preview

<div align="center">
  <img width="400" alt="App Preview 1" src="/public/one.png">
  <img width="400" alt="App Preview 2" src="/public/two.png">
  <img width="400" alt="App Preview 3" src="/public/three.png">
  <img width="400" alt="App Preview 4" src="/public/four.png">
  <img width="400" alt="App Preview 5" src="/public/five.png">
  <img width="400" alt="App Preview 6" src="/public/six.png">
  <br/>
  <video width="800" controls>
    <source src="/public/spectra.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

---

## How to run

This will utilize local redis in dev mode and vercel kv in production mode, the cache used is dynamically switched.

- To run the ReactJS App

```shell
npm run start 
```

- To run the NodeJS Server (that connects to local Redis)

```shell
node .\redis\node-server.cjs
```

- To run a script that dynamically determines Local or Vercel Redis as well as ReactJS App

```shell
node .\start-servers.cjs  
```

---

## Features Provided by Spectra 

1.  **Deep Transaction Visualization & Analysis:**
    *   Interactive graphical representation of transactions for any Solana wallet.
    *   Track token flow in and out of wallets.
    *   Explore transaction history up to 5 levels deep (stream).
    *   View individual wallet balances.
    *   Developed using `react-vis-network-graph`.
2.  **Token Holder Bubble Map:**
    *   Visualizes the distribution and concentration of specific tokens among holders.
    *   Quickly identify major holders.
3.  **Token Trader Bubble Map:**
    *   Maps the activity and relationships of token traders.
    *   Identify key players, trading clusters, and interactions between traders and holders.
4.  **Malicious Wallet Flagging:**
    *   Flag suspicious wallets to register them for activity monitoring.
    *   Receive email notifications via webhook for any subsequent activity.
5.  **Multi-Chain Support (Planned/Partial):**
    *   Initial framework includes considerations for Ethereum and Bitcoin analysis (Functionality may vary).
6.  **Data Export:**
    *   Download transaction data as a CSV file for offline analysis, data analytics, or machine learning tasks.
7.  **Conversational AI Chatbot:**
    *   Scout transactions and wallets through natural language conversation.
    *   Supports multiple languages including Kannada, Hindi, Telugu.

---

## Other Technologies Used 
1. React.js with Vite
2. Node.js
3. Aceternity UI
4. Data Sources: Helius APIs, Moralis APIs, Solana RPC

## Upcoming Features. 
1. API caching using Redis.
2. LLM support for beginners.



## Endpoints
### wallet address
``` 
https://onchainanalysis.udaykiranreddy.online//api/${chain}/address/${address}
```
``` 
https://onchainanalysis.udaykiranreddy.online//api/${chain}/txhash/${txhash}
```
``` 
https://onchainanalysis.udaykiranreddy.online//api/${chain}
```
``` 
https://onchainanalysis.udaykiranreddy.online//api/${chain}
```
``` 
https://onchainanalysis.udaykiranreddy.online//api/${chain}
```
``` 
https://onchainanalysis.udaykiranreddy.online//api/${chain}
```
