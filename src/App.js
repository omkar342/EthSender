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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// toast.configure();

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

  const triggerSuccessToast = () => {
    // Calling toast method by passing string
    toast.success("🦄 Ethers sent successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const triggerErrorToast = () => {
    toast.error("🦄 Ethers not sent!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const triggerConnectedToast = () => {
    toast.success("🦄 Connected to Metamask Wallet Successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleConnectToWallet = async () => {
    setLoadingUserAccountAndBalance(true);
    const provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(provider);
      setWeb3Api({ provider, web3 });
      triggerConnectedToast();
    }
    setLoadingUserAccountAndBalance(false);
  };

  const sendEtherToSmartContract = async () => {
    if (contract !== null) {
      try {
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

        triggerSuccessToast();
        setReload(!reload);
        setAmountToBeSendToSmartContract(0);
      } catch (e) {
        triggerErrorToast();
        setReload(!reload);
        console.log(e);
      }
    }
  };

  const sendEthersToGivenAddress = async (amount, receiverAccountAddress) => {
    if (contract !== null) {
      try {
        setLoadingContractBalance(true);
        const amountInWei = Web3.utils.toWei(amount, "ether");

        await contract.methods
          .sendEthers(amountInWei, receiverAccountAddress)
          .send({ from: userAccountAddress });

        triggerSuccessToast();
        setReload(!reload);
      } catch (e) {
        triggerErrorToast();
        setReload(!reload);
        console.log(e);
      }
    }
  };

  // Use this function to directly send ethers from User to the given address (But it's not working).

  const sendEthersToGivenAddressFromUsersAccount = async (
    amount,
    receiverAccountAddress
  ) => {
    const senderPrivateKey =
      "0x7d84045f68d2e75015fa724e5b9afb84e918ca72b704a3094eb56846668db2c9";

    const senderAccount =
      web3Api.web3.eth.accounts.privateKeyToAccount(senderPrivateKey);

    const amountInWei = Web3.utils.toWei(amount, "ether");

    const gasPrice = "20000000000";
    const gasLimit = "21000";

    const transactionObject = {
      from: senderAccount.address,
      to: receiverAccountAddress,
      value: amountInWei,
      gasPrice: gasPrice,
      gas: gasLimit,
      nonce: parseInt(
        await web3Api.web3.eth.getTransactionCount(senderAccount.address)
      ),
    };

    // Sign the transaction with the sender's private key
    const signedTransaction = await senderAccount.signTransaction(
      transactionObject
    );

    // Send the signed transaction
    web3Api.web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction)
      .on("transactionHash", (hash) => {
        console.log("Transaction hash:", hash);
      })
      .on("receipt", (receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .on("error", (error) => {
        console.error("Error sending ethers:", error);
      });
    setReload(!reload);
  };

  useEffect(() => {
    const detectProvider = async () => {
      setLoadingUserAccountAndBalance(true);
      const provider = await detectEthereumProvider();

      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(provider);
        setWeb3Api({ provider, web3 });
        triggerConnectedToast();
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
      <SendEtherForm handleSubmitForm={sendEthersToGivenAddress} />
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
