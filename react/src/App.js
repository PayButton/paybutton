"use strict";
exports.__esModule = true;
var react_1 = require("react");
var default_args_1 = require("../.storybook/default-args");
var components_1 = require("../lib/components");
function App() {
    return (<div>
      <h1>Paybutton Demo</h1>
      <components_1.PayButton to={default_args_1.to}/>
    </div>);
}
exports["default"] = App;
