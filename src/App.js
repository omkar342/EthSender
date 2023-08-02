import "./App.css";
import { useState, useEffect } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import SendEtherForm from "./Form Component/SendEtherForm";
import MainButton from "./Button Components/MainButton";
import ContractForm from "./Form Component/ContractForm";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

function App() {
  const [myAccountAddress, setMyAccountAddress] = useState("");

  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null });

  const handleSubmitForm = (amount, receiverAccount) => {
    console.log(amount, receiverAccount, "ljlj");
  };

  const handleConnectToWallet = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(provider);
      setWeb3Api({ provider, web3 });
      console.log(`Provider is Detected ${provider}`);
    }
  };

  useEffect(() => {
    const detectProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(provider);
        setWeb3Api({ provider, web3 });
        console.log(`Provider is Detected ${provider}`);
      }
    };

    detectProvider();
  }, []);

  useEffect(() => {
    const getAndSetAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      console.log(accounts);
      setMyAccountAddress(accounts[0]);
    };
    web3Api.web3 && getAndSetAccount();
  }, [web3Api.web3]);

  return (
    <div className="App">
      <Header />
      <h2>Your Wallet Address: {myAccountAddress}</h2>
      <div style={{ margin: "30px 0px" }}>
        <MainButton
          title={"Connect to Wallet!"}
          handleOnClick={handleConnectToWallet}
        />
      </div>
      <h3>Contract's Balance: {}</h3>
      <ContractForm />
      <SendEtherForm handleSubmitForm={handleSubmitForm} />
      <Footer />
    </div>
  );
}

export default App;
