import { Routes, Route } from "react-router-dom";
import './App.css'
import Header from "./components/Header";
import AadhaarForm from "./screens/AadhaarForm";
import PANValidationForm from "./screens/PANValidation";

function App() {


  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<AadhaarForm />} />
        <Route path="/pan-validation" element={<PANValidationForm/>} />

      </Routes>
    </>


  )
}

export default App
