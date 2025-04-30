# Solana On-Chain Investigation Tool

This tool provides real-time interactive visualization and analysis of Solana wallet transactions.

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
    <source src="/public/demo.mp4" type="video/mp4">
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

1. Graphical Representation.
   An interactive representation of all transactions for every wallet ID, in real time, for real wallet IDs.
   Developed using  `react-vis-network-graph`
2. Flagging Malicious Wallet IDs.
   On flagging, this service will register the wallet ID to a webhook that will notify the investigators of any activity on that account, via an Email.
3. Support for Ethereum and Bitcoin.
4. Downloading all transactions in the form of a CSV file.
   This feature opens doors for various others in the form of data analytics and machine learning for predictive study.
5. Chatbot features.
   The bot permits scouting transactions and wallets by just conversing with it!
   Can speak in Kannada, Hindi, Telugu and various other languages.
6. Token Traders Bubble Map UI.
   Visualizes the activity and relationships of token traders using an interactive bubble map, making it easy to identify key players and trading clusters.
7. Token Holder Bubble Map UI.
   Provides a graphical bubble map representation of token holders, allowing users to quickly assess distribution and concentration of tokens among holders.

---

## Other Technologies Used 
1. React.js with Vite
2. Node.js
3. Aceternity UI

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
