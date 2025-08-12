import React from "react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Navbar() {
  return (
    <nav className=" invoice-nav navbar  navbar-expand-lg ">
      <div className="container">
        <a className="navbar-brand " href="#">
          <img
            src="./src/assets/logo.png"
            alt=""
            width="50"
            height="50"
            className="d-inline-block align-text-top"
          />
        </a>
        <div
          className="collapse navbar-collapse nav justify-content-end"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav ">
            <li className="nav-item my-auto dropdown">
              <a
                className="nav-link active text-white dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                All Products
              </a>
              <ul
                className="dropdown-menu gap-3"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a className="dropdown-item py-2" href="#">
                    Invoice Generator
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-2" href="#">
                    GST Invoice Maker
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-2" href="#">
                    Quotation Generator
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item my-auto">
              <a className="nav-link text-white" href="#">
                <img
                  src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"
                  width="40"
                  height="40"
                  className="rounded-circle"
                />
              </a>
            </li>
            {/* <li class="nav-item">
              <a class="nav-link text-white" href="#">
                Pricing
              </a>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
