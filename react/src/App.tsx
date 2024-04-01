import React from "react";
import { to } from "../.storybook/default-args";
import { PayButton } from "../lib/main";

function App() {
  return (
    <div>
      <h1>Paybutton Demo</h1>
      <PayButton
      to={to}
      />
    </ div>
  );
}

export default App;
