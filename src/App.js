import logo from "./logo.svg";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import HomePage from "./component/HomePage";

function App() {
  // const ZOHO = Window.ZOHO;
  /*
   * Subscribe to the EmbeddedApp onPageLoad event before initializing
   */
  // console.log(window)

  return (
    <div className="App">
      <h1>Hello</h1>
      <HomePage />
    </div>
  );
}

export default App;
