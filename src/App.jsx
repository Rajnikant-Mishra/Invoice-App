import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/Login";
import Register from "./Components/Register";
import InvoicesMain from "./Components/InvoicesMain";
import MailSignature from "./Components/MailSignature";
// import "@syncfusion/ej2-base/styles/material.css";
// import "@syncfusion/ej2-buttons/styles/material.css";
// import "@syncfusion/ej2-calendars/styles/material.css";
// Create an Invoices component to display invoices

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
        <Route path="/invoices" element={<InvoicesMain />} />
        <Route path="/MailSignature" element={<MailSignature />} />
      </Routes>
    </Router>
  );
}

export default App;
