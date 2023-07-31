import React, { useState } from "react";
import "./ContractForm.css";

const MyComponent = () => {
  const [amountToBeSendToSmartContract, setAmountToBeSendToSmartContract] =
    useState();

  const sendEtherToSmartContract = (e) => {
    // Your button click logic here
    e.preventDefault();
    console.log(amountToBeSendToSmartContract);
  };

  return (
    <div className="contract_form">
      <form
        action=""
        onSubmit={(e) => {
          sendEtherToSmartContract(e);
        }}
      >
        <input
          type="number"
          placeholder="Enter Ethers (in ETH) to be sent to Smart Contract Address."
          onChange={(e) => {
            setAmountToBeSendToSmartContract(e.target.value);
          }}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default MyComponent;
