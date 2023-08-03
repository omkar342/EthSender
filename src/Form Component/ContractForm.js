import React, { useState } from "react";
import "./ContractForm.css";

const ContractForm = (props) => {
  console.log("value is", props.amountToBeSendToSmartContract);
  return (
    <div className="contract_form">
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          props.sendEtherToSmartContract();
        }}
      >
        <input
          type="number"
          value={props.amountToBeSendToSmartContract}
          placeholder="Enter Ethers (in ETH) to be sent to Smart Contract Address."
          onChange={(e) => {
            props.setAmountToBeSendToSmartContract(e.target.value);
          }}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default ContractForm;
