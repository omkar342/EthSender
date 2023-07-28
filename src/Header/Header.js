import React from "react";
import "./Header.css";
import ethLogo from "../assets/ethLogo.png";

const Header = () => {
  return (
    <div className="header">
      <h2>EthSender </h2>
      <img src={ethLogo} alt="ethLogo" className="ethLogo" />
    </div>
  );
};

export default Header;
