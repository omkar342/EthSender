import "./App.css";
import { useState, useEffect } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import SendEtherForm from "./Form Component/SendEtherForm";
import MainButton from "./Button Components/MainButton";
import ContractForm from "./Form Component/ContractForm";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./Config/SmartContractConfig";

function App() {
  const [myAccountAddress, setMyAccountAddress] = useState("");

  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null });

  const [contractBalance, setContractBalance] = useState("");

  const [contract, setContract] = useState(null);

  const [contractAddress, setContractAddress] = useState("");

  const [amountToBeSendToSmartContract, setAmountToBeSendToSmartContract] =
    useState();

  const [reload, setReload] = useState(false);

  const [loadingContractBalance, setLoadingContractBalance] = useState(false);

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

  console.log(web3Api);

  const sendEtherToSmartContract = async () => {
    if (contract !== null) {
      setLoadingContractBalance(true);
      const amountInWei = Web3.utils.toWei(
        amountToBeSendToSmartContract,
        "ether"
      );
      await contract.methods.receiveEthers(amountToBeSendToSmartContract).send({
        from: myAccountAddress,
        // to: contractAddress,
        value: amountInWei,
      });
      setReload(!reload);
      setAmountToBeSendToSmartContract(0);
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

  console.log(amountToBeSendToSmartContract);

  useEffect(() => {
    const getAndSetAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      console.log(accounts);
      setMyAccountAddress(accounts[0]);

      const sendEtherContract = new web3Api.web3.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );
      setContract(sendEtherContract);
      console.log(sendEtherContract.options.address);
      setContractAddress(sendEtherContract.options.address);

      const smartContractBalance = await web3Api.web3.eth.getBalance(
        CONTRACT_ADDRESS
      );
      const smartContractBalanceInEther = Web3.utils.fromWei(
        smartContractBalance,
        "ether"
      );
      console.log(smartContractBalanceInEther);
      setContractBalance(smartContractBalanceInEther);
      setLoadingContractBalance(false);
    };
    web3Api.web3 && getAndSetAccount();
  }, [web3Api.web3, reload]);

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
      <h3>
        Contract's Balance:{" "}
        {!loadingContractBalance || !contractBalance
          ? `${contractBalance}`
          : "Loading..."}
      </h3>
      <ContractForm
        setAmountToBeSendToSmartContract={setAmountToBeSendToSmartContract}
        sendEtherToSmartContract={sendEtherToSmartContract}
        amountToBeSendToSmartContract={amountToBeSendToSmartContract}
      />
      <SendEtherForm handleSubmitForm={handleSubmitForm} />
      <Footer />
    </div>
  );
}

export default App;
