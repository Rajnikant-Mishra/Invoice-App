import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
// import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Axios from "axios";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/", {
      username,
      email,
      password,
    })
      .then((response) => {
        if (response.data.status) {
          setRegistrationSuccess(true);
          setErrorMessage("");
          setTimeout(() => {
            navigate("/");
          }, 3000); // Redirect after 3 seconds
        } else {
          setRegistrationSuccess(false);
          setErrorMessage(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const TogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="registerdiv container-fluid d-flex flex-wrap">
      <div className="leftdiv px-5 col-lg-5 col-md-5 col-sm-12">
        <h1 className="pb-2">Tools you need to run your business.</h1>
        <h5 className="fw-normal pb-5">
          Accounting. Inventory. Leads and more.
        </h5>
        <img
          src="https://fiverr-res.cloudinary.com/videos/t_main1,q_auto,f_auto/igfaz60zse4f0t0t6f2z/do-web-banner-and-lottie-json-animation-gifs.png"
          alt="Business tools"
          className="img-fluid"
        />
        <h6 className="fw-normal pt-5">
          Join thousands of freelancers and businesses to grow your business
        </h6>
      </div>
      <div className="rightdiv col-lg-7 col-md-7 col-sm-12 ">
        <header className="p-3 text-white">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <a
                href="https://img.freepik.com/free-vector/leaf-maple-icon-logo-design_474888-2154.jpg?size=338&ext=jpg"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
              >
                <svg
                  className="bi me-2"
                  width="40"
                  height="32"
                  role="img"
                  aria-label="Bootstrap"
                >
                  <use xlinkHref="#bootstrap"></use>
                </svg>
              </a>
              <div className="text-end">
                <Link to="/login" type="button" className="btn loginbtn">
                  <FaUser /> Login
                </Link>
              </div>
            </div>
          </div>
        </header>
        <div className="align-middle mt-5 formdiv px-4 px-md-5 mx-auto">
          {registrationSuccess && (
            <div className="alert alert-success mt-3" role="alert">
              Account Created successful! Go to login page...
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="d-flex justify-content-center">
            <h3>Sign Up on Refrens</h3>
          </div>
          <form onSubmit={handleSubmit} className="my-auto">
            <button type="button" className="btn google">
              <FcGoogle /> Continue with Google
            </button>
            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" />
              <span className="px-2">OR</span>
              <hr className="flex-grow-1" />
            </div>

            <div className="mb-3 row">
              <label
                htmlFor="yournameInput"
                className="col-sm-4 col-form-label"
              >
                Your Name <sup>*</sup>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="yournameInput"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="email" className="col-sm-4 col-form-label">
                Your Email <sup>*</sup>
              </label>
              <div className="col-sm-8">
                <input
                  type="email"
                  className="form-control"
                  required
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row position-relative">
              <label
                htmlFor="exampleInputPassword1"
                className="col-sm-4 col-form-label"
              >
                Set Password <sup>*</sup>
              </label>
              <div className="col-sm-8">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  id="exampleInputPassword1"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="password-icon" onClick={TogglePassword}>
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
            <div className="mb-3 form-check d-flex align-items-start w-100">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label ms-2" htmlFor="exampleCheck1">
                I agree to the Refrens{" "}
                <span className="pageLink">Terms of Service</span> and{" "}
                <span className="pageLink">Privacy Policy</span>
              </label>
            </div>
            <button className="submit btn">Create Account</button>
          </form>

          <p className="formLinkSentence mt-3">
            Have an account ?{" "}
            <Link to="/login" id="pageLink">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
