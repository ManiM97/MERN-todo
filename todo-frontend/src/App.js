import logo from "./logo.svg";
import "./App.css";
import Todo from "./Todo";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className="container">
      <Todo />
      <ToastContainer/>
    </div>
  );
}

export default App;
