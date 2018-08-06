import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";

import registerServiceWorker from "./registerServiceWorker";
import './index.css';
import "@blueprintjs/core/lib/css/blueprint.css";

ReactDOM.render(<Routes />, document.getElementById("root"));
registerServiceWorker();
