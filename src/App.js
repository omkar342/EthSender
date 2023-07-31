import "./App.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import SendEtherForm from "./Form Component/SendEtherForm";
import MainButton from "./Button Components/MainButton";
import ContractButton from "./Form Component/ContractForm";

function App() {
  const handleSubmitForm = (amount, receiverAccount) => {
    console.log(amount, receiverAccount, "ljlj");
  };

  return (
    <div className="App">
      <Header />
      <div style={{ margin: "30px 0px" }}>
        <MainButton title={"Connect to Wallet!"} />
      </div>
      <h3>Contract's Balance: {}</h3>
      <ContractButton />
      <SendEtherForm handleSubmitForm={handleSubmitForm} />
      <Footer />
    </div>
  );
}

export default App;
