import axios from "axios";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./Invoices.css";

const Invoice = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="container-fluid">
      <nav class=" invoice-nav navbar  navbar-expand-lg ">
        <div class="container-fluid ">
          <a class="navbar-brand text-white" href="#">
            Navbar
          </a>
        </div>
      </nav>
      {/* wellcome to invoices
      <button onClick={handleLogout}>logout</button> */}
      <div class="card" id="card-invoice">
        <div class="card-body">
          <a href="#" class="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
