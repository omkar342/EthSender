import React from "react";
import { useState } from "react";
import "./SendEtherForm.css";
import MainButton from "../Button Components/MainButton";

function SendEtherForm(props) {
  const [amount, setAmount] = useState();
  const [receiverAccount, setReceiverAccount] = useState("");

  console.log(amount);

  return (
    <div>
      <form
        className="send_ether_form"
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          props.handleSubmitForm(amount, receiverAccount);

          setAmount();
          setReceiverAccount("");
        }}
      >
        <label htmlFor="">Enter the recipient's Ethereum wallet address</label>
        <input
          value={receiverAccount}
          type="text"
          className="recipientAddress"
          onChange={(e) => {
            setReceiverAccount(e.target.value);
          }}
          placeholder="For e.g. 0x4ecaA68a07BA449C612292D758A7C30024260BE9"
        />
        <label htmlFor="">
          Enter the amount of Ethers (in ETH) you want to send
        </label>
        <input
          value={amount}
          type="number"
          className="etherAmount"
          placeholder="For e.g. 5"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <MainButton title={"Send"} />
      </form>
    </div>
  );
}

export default SendEtherForm;
