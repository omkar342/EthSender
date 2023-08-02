export const CONTRACT_ADDRESS = "0xF17D326979649ac5312948364595Bd1b5410d574";

export const CONTRACT_ABI = [
  {
    inputs: [],
    name: "totalBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    stateMutability: "payable",
    type: "receive",
    payable: true,
  },
  {
    inputs: [],
    name: "receiveEthers",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "transferAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiverAddress",
        type: "address",
      },
    ],
    name: "sendEthers",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
];
