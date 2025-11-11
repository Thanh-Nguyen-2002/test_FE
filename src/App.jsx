import './App.css';
import ManagerUser from './User/ManagerUser';
import { ToastContainer } from 'react-toastify';
function App() {
  
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={2000} />
      <ManagerUser />
    </div>
  );
}

export default App;
