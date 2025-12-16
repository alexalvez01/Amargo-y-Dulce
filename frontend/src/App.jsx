
import './App.css'
import MercadoPagoButton from "./MercadoPagoButton.jsx";
import GoogleLoginButton from "./GoogleLoginButton";

function App() {


  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h2>Login</h2>
        <GoogleLoginButton />
      </div>
      <hr />

       <h1>Finalizar compra</h1>
      <MercadoPagoButton idFactura={3} />
    </>
  )
}


export default App;
