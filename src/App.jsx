import Formulario from "./componentes/Formulario";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
   <div className='App'>
     <Formulario/>
     <ToastContainer theme={'colored'}/>
   </div>
  );
}

export default App;
