import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function App({ monto, descripcion, onSuccess }) {
  const initialOptions = {
    clientId:
      "AVsZ5REA3iu8MhNeOeugev2HjXdw3HYcaUIfb9YviIWou3TlEry-E0sm6vnNpQ_BkiR7NbBHAX7gxLOK",
    currency: "USD",
  };

  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: monto,
                    description: descripcion,
                  },
                },
              ],
            });
          }}
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
          }}
          onApprove={ (data, actions) => {
            return actions.order.capture().then((details) => {
              onSuccess(details);
            });
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
