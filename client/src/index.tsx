import App from "./App";
// import ReactDOM from "react-dom";
// // import TestComponent from "./TestComponent";

// ReactDOM.render(<App />, document.getElementById("root"));
// // ReactDOM.render(<TestComponent />, document.getElementById("root"));

// After
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);
