import Header from "./Header";
import Fixtures from "./fixtures";
import "../style.css";

const React = window.React;

function App2() {
  return (
    <div>
      <Header />
      <div className="container">
        <Fixtures />
      </div>
    </div>
  );
}
class App {
  render() {
    return <App2 />;
  }
}
export default App;
