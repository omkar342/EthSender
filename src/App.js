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
  const [userAccountAddress, setUserAccountAddress] = useState("");

  const [userAccountBalance, setUserAccountBalance] = useState("");

  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null });

  const [contractBalance, setContractBalance] = useState("");

  const [contract, setContract] = useState(null);

  const [contractAddress, setContractAddress] = useState("");

  const [amountToBeSendToSmartContract, setAmountToBeSendToSmartContract] =
    useState();

  const [reload, setReload] = useState(false);

  const [loadingContractBalance, setLoadingContractBalance] = useState(false);

  const [loadingUserAccountAndBalance, setLoadingUserAccountAndBalance] =
    useState(false);

  const handleSubmitForm = (amount, receiverAccount) => {
    console.log(amount, receiverAccount);
  };

  const handleConnectToWallet = async () => {
    setLoadingUserAccountAndBalance(true);
    const provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(provider);
      setWeb3Api({ provider, web3 });
      console.log(`Provider is Detected ${provider}`);
    }
    setLoadingUserAccountAndBalance(true);
  };

  const sendEtherToSmartContract = async () => {
    if (contract !== null) {
      setLoadingContractBalance(true);
      const amountInWei = Web3.utils.toWei(
        amountToBeSendToSmartContract,
        "ether"
      );
      await contract.methods.receiveEthers().send({
        from: userAccountAddress,
        to: contractAddress,
        value: amountInWei,
      });
      setReload(!reload);
      setAmountToBeSendToSmartContract(0);
    }
  };

  useEffect(() => {
    const detectProvider = async () => {
      setLoadingUserAccountAndBalance(true);
      const provider = await detectEthereumProvider();

      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(provider);
        setWeb3Api({ provider, web3 });
        console.log(`Provider is Detected ${provider}`);
      }
      setLoadingUserAccountAndBalance(false);
    };

    detectProvider();
  }, []);

  useEffect(() => {
    const getAndSetAccount = async () => {
      setLoadingContractBalance(true);
      const accounts = await web3Api.web3.eth.getAccounts();
      setUserAccountAddress(accounts[0]);

      const balance = await web3Api.web3.eth.getBalance(accounts[0]);
      const userBalanceInEth = Web3.utils.fromWei(balance, "ether");
      setUserAccountBalance(userBalanceInEth);

      const sendEtherContract = new web3Api.web3.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );
      setContract(sendEtherContract);
      setContractAddress(sendEtherContract.options.address);

      const smartContractBalance = await web3Api.web3.eth.getBalance(
        CONTRACT_ADDRESS
      );
      const smartContractBalanceInEther = Web3.utils.fromWei(
        smartContractBalance,
        "ether"
      );
      setContractBalance(smartContractBalanceInEther);
      setLoadingContractBalance(false);
    };
    web3Api.web3 && getAndSetAccount();
  }, [web3Api.web3, reload]);

  return (
    <div className="App">
      <Header />
      <h2>
        Your Wallet Address:{" "}
        {loadingUserAccountAndBalance || userAccountAddress === ""
          ? "Loading..."
          : userAccountAddress}
      </h2>
      <h2>
        Your Wallet Balance:{" "}
        {loadingUserAccountAndBalance || userAccountBalance === ""
          ? "Loading..."
          : userAccountBalance}
      </h2>
      <div style={{ margin: "30px 0px" }}>
        <MainButton
          title={"Connect to Wallet!"}
          handleOnClick={handleConnectToWallet}
        />
      </div>
      <h3>
        Contract's Balance:{" "}
        {loadingContractBalance || contractBalance === ""
          ? "Loading..."
          : `${contractBalance}`}
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
