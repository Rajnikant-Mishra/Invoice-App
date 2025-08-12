import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./InvoicesMain.css";
import Navbar from "./Layouts/Navbar";
import { BsTrash } from "react-icons/bs";
import { CiImageOn, CiSquarePlus } from "react-icons/ci";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import {
  MdDeleteForever,
  MdAdd,
  MdFileUpload,
  MdOutlineDiscount,
} from "react-icons/md";
import PhoneInput from "react-phone-input-2";
import { RiBankLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { LuPenLine } from "react-icons/lu";

import {
  FaAngleDown,
  FaAngleUp,
  FaArrowCircleLeft,
  FaArrowCircleRight,
} from "react-icons/fa";

import SignatureCanvas from "react-signature-canvas";
import { SettingsIcon } from "@chakra-ui/icons";

import {
  ChakraProvider,
  Input,
  InputGroup,
  InputLeftElement,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";

const InvoiceMain = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [formData, setFormData] = useState({
    invoiceNo: "",
    invoiceDate: "",
    dueDate: "",
    logoFile: null,
    currency: "INR",
    billedBy: {
      businessName: "",
      email: "",
      phoneNumber: "",
      gstin: "",
      countryCode: "in",
      pan: "",
      address: "",
      city: "",
      postalCode: "",
      state: "",
      country: "India",
    },
    billedTo: {
      businessName: "",
      email: "",
      phoneNumber: "",
      gstin: "",
      countryCode: "in",
      pan: "",
      address: "",
      city: "",
      postalCode: "",
      state: "",
      country: "India",
    },
    shipping: {
      showShipping: false,
      shippedFrom: {
        sameWithBilledBy: false,
        businessName: "",
        address: "",
        city: "",
        postalCode: "",
        state: "",
        country: "",
      },
      shippedTo: {
        sameWithBilledTo: false,
        businessName: "",
        address: "",
        city: "",
        postalCode: "",
        state: "",
        country: "",
      },
      transporterDetails: {
        transportType: "",
        distance: 0,
      },
      transport: {
        type: "",
        challan: {
          docNo: "",
          date: "",
        },
        vehicle: {
          type: "",
          number: "",
          docNo: "",
        },
        transaction: {
          type: "",
          subSupplyType: "",
        },
      },
    },
    items: [{ description: "", quantity: 0, unit: "", price: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    discount: 0,
    discountType: "%",
    discountShow: false,
    cgst: 0,
    sgst: 0,
    roundOn: 0,
    roundOff: 0,
    signature: {
      url: null,
      signatureData: "",
    },
    bankDetails: {
      country: "India",
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      bankAccountType: "Current",
      currency: "",
    },
  });

  const recalculateTotals = () => {
    const newItems = [...formData.items];
    const total = newItems.reduce((acc, item) => acc + item.amount, 0);

    const discountAmount =
      formData.discountType === "%"
        ? (total * formData.discount) / 100
        : formData.discount;
    const discountedtotal = total - discountAmount;
    const cgstAmount = (discountedtotal * formData.cgst) / 100;
    const sgstAmount = (discountedtotal * formData.sgst) / 100;
    const subtotal = discountedtotal + cgstAmount + sgstAmount;

    setFormData((prevData) => ({
      ...prevData,
      subtotal,

      total: total.toFixed(2),
    }));
  };

  const [fileInputVisible, setFileInputVisible] = useState(true);
  const [fileInputVisible1, setFileInputVisible1] = useState(true);

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState([]);

  const [filteredCountries, setFilteredCountries] = useState([]);

  const [showOptions, setShowOptions] = useState(false);
  const [showOptions1, setShowOptions1] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [showOptions3, setShowOptions3] = useState(false);
  const [showOptions4, setShowOptions4] = useState(false);

  const [showBankInputs, setShowBankInputs] = useState(false);

  const [tclicked, tsetClicked] = useState(false);
  const [tclicked1, tsetClicked1] = useState(false);
  const [tclicked2, tsetClicked2] = useState(false);
  const [tclicked3, tsetClicked3] = useState(false);
  const [tclicked4, tsetClicked4] = useState(false);
  const [tclicked5, tsetClicked5] = useState(false);
  const [tclicked6, tsetClicked6] = useState(false);

  const [signDiv, setSignDiv] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoFileInputRef = useRef(null);
  const signatureFileInputRef = useRef(null);

  const [discountShow, setDiscountShow] = useState(false);

  const [roundOnShow, setRoundOnShow] = useState(false);

  const [roundOffShow, setRoundOffShow] = useState(false);
  const [previousSubtotal, setPreviousSubtotal] = useState(formData.subtotal);

  const [toggleStates, setToggleStates] = useState({
    showOptions: false,
    showOptions1: false,
    showOptions2: false,
    showOptions3: false,
    showOptions4: false,
    showBankInputs: false,
    signDiv: false,
  });

  const toggleState = (key) => {
    setToggleStates((prevStates) => ({
      ...prevStates,
      [key]: !prevStates[key],
    }));
  };

  const steps = [
    "Invoice Details",
    "Add Banking Details (optional)",
    "Preview & Share (optional)",
  ];
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const [prefix, index, field] = name.split(/[\[\].]+/);
    setFormData((prevData) => {
      const nameParts = name.split(".");
      const updatedData = { ...prevData };
      const updateNestedProperty = (obj, path, value) => {
        if (path.length === 1) {
          obj[path[0]] = type === "checkbox" ? checked : value;
        } else {
          if (!obj[path[0]]) obj[path[0]] = {};
          updateNestedProperty(obj[path[0]], path.slice(1), value);
        }
      };
      updateNestedProperty(
        updatedData,
        nameParts,
        type === "checkbox" ? checked : value
      );

      if (prefix === "items") {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        if (field === "quantity" || field === "price") {
          newItems[index].amount =
            newItems[index].quantity * newItems[index].price;
        }
        setFormData((prevData) => ({
          ...prevData,
          items: newItems,
        }));
      }

      if (name === "shipping.shippedFrom.sameWithBilledBy") {
        updatedData.shipping.shippedFrom = checked
          ? { ...prevData.billedBy, countryCode: prevData.billedBy.countryCode }
          : {
              businessName: "",
              address: "",
              city: "",
              postalCode: "",
              state: "",
              country: "",
              countryCode: "",
            };
      } else if (name === "shipping.shippedTo.sameWithBilledTo") {
        updatedData.shipping.shippedTo = checked
          ? { ...prevData.billedTo, countryCode: prevData.billedTo.countryCode }
          : {
              businessName: "",
              address: "",
              city: "",
              postalCode: "",
              state: "",
              country: "",
              countryCode: "",
            };
      } else if (name === "shipping.showShipping") {
        updatedData.shipping.showShipping = checked;
      }

      if (name === "logoFile") {
        updatedData.logoFile = files[0];
      } else if (formData.signature.signatureData) {
        formData.append("signature", formData.signature.signatureData);
      }

      if (name === "bankDetails.country") {
        const selectedCountry = filteredCountries.find(
          (data) => data.name.common === value
        );
      }

      return updatedData;
    });
  };
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setFormData((prevData) => ({ ...prevData, invoiceDate: formattedDate }));

    const fetchCurrencies = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );

        const currencyData = sortedCountries.flatMap((country) =>
          Object.entries(country.currencies || {}).map(([code, details]) => ({
            countryName: country.name.common,
            currencyCode: code,
            currencySymbol: details.symbol,
            currencyName: details.name,
          }))
        );

        setCurrencies(
          [
            ...new Set(currencyData.map((currency) => currency.currencyCode)),
          ].map((code) =>
            currencyData.find((currency) => currency.currencyCode === code)
          )
        );
        const india = sortedCountries.find(
          (country) => country.name.common === "India"
        );
        const defaultCurrency = india
          ? Object.values(india.currencies || {})[0].name
          : "";

        setSelectedCurrency(defaultCurrency.symbol);
      } catch (error) {
        console.error("Error fetching currency data:", error);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        const india = sortedCountries.find(
          (country) => country.name.common === "India"
        );
        setFilteredCountries(sortedCountries);
        setFormData((prevData) => ({
          ...prevData,
          billedBy: {
            ...prevData.billedBy,
            country: india ? india.name.common : "",
            countryCode: india ? india.cca2.toLowerCase() : "",
          },
          billedTo: {
            ...prevData.billedTo,
            country: india ? india.name.common : "",
            countryCode: india ? india.cca2.toLowerCase() : "",
          },
        }));
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);
  useEffect(() => {
    recalculateTotals();
    setPreviousSubtotal(formData.subtotal);
  }, [
    formData.items,
    formData.discount,
    formData.cgst,
    formData.sgst,
    formData.discountType,
    formData.subtotal,
  ]);

  const calculateRoundedSubtotal = () => {
    let updatedSubtotal = formData.subtotal;

    if (roundOnShow) {
      updatedSubtotal =
        Math.ceil(updatedSubtotal + formData.roundOn) - formData.roundOn;
    } else if (roundOffShow) {
      updatedSubtotal =
        Math.floor(updatedSubtotal - formData.roundOff) + formData.roundOff;
    }

    return updatedSubtotal.toFixed(2);
  };

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };
  const handlePhoneNumberChange = (prefix) => (value) => {
    handleChange({
      target: {
        name: `${prefix}.phoneNumber`,
        value,
      },
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        logoFile: file,
      }));
      setFileInputVisible(false);
    }
  };
  const handleLogoChange1 = (e) => {
    const file1 = e.target.files[0];
    if (file1) {
      const url1 = URL.createObjectURL(file1);
      setFormData((prevData) => ({
        ...prevData,
        signature: { url: url1, signatureData: file1 },
      }));
      e.target.value = null;
    }
  };
  const handleSignatureClick = () => {
    if (signatureFileInputRef.current) {
      signatureFileInputRef.current.click();
    }
  };

  const handleLogoClick = () => {
    if (logoFileInputRef.current) {
      logoFileInputRef.current.click();
    }
  };

  const handleDeleteLogo = () => {
    if (formData.logoFile) {
      URL.revokeObjectURL(URL.createObjectURL(formData.logoFile));
    }
    setFormData((prevData) => ({
      ...prevData,
      logoFile: null,
    }));
    setFileInputVisible(true);
  };

  const handleDeleteLogo1 = () => {
    if (formData.signature.url) {
      URL.revokeObjectURL(formData.signature.url);
    }
    setFormData((prevData) => ({
      ...prevData,
      signature: {
        ...prevData.signature,
        url: null,
        signatureData: null,
      },
    }));
  };

  const getCurrencySymbol = (code) => {
    const currency = currencies.find((curr) => curr.currencyCode === code);
    return currency ? currency.currencySymbol : "";
  };
  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  const handleAddRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 0, unit: "", price: 0, amount: 0 },
      ],
    });
  };

  const handleDeleteRow = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, row) => sum + row.amount, 0).toFixed(2);
  };

  const handleCountrySelect = (path, name, code, setShowOptions) => {
    const fields = path.split(".");
    let data = formData;

    for (let i = 0; i < fields.length - 1; i++) {
      data = data[fields[i]];
    }

    const lastField = fields[fields.length - 1];
    data[lastField] = {
      ...data[lastField],
      country: name,
      countryCode: code.toLowerCase(),
    };
    if (setShowOptions) setShowOptions(false);
  };

  // Example usage

  const totalAmount = parseFloat(calculateTotal());

  const finalSubtotal = calculateRoundedSubtotal();
  const signatureRef = useRef(null);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    } else {
      console.error("Signature ref is not set.");
    }
  };

  const saveSignature = () => {
    const dataUrl = signatureRef.current.toDataURL();
    setFormData((prevData) => ({
      ...prevData,
      signature: {
        ...prevData.signature,
        signatureData: dataUrl,
        url: dataUrl,
      },
    }));
    onClose();
  };

  const handleDiscountTypeChange = (e) => {
    setFormData(
      (prevData) => ({
        ...prevData,
        discountType: e.target.value,
      }),
      recalculateTotals
    );
  };
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  return (
    <>
      <Navbar />
      <h1 className="mt-5 text-center">Create Online Invoice</h1>
      <div className="container">
        <Box sx={{ width: "100%" }} className="mt-5">
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
              <React.Fragment>{alert("sarita")}</React.Fragment>
            ) : (
              <React.Fragment>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} variant="plain" />

                  {activeStep !== steps.length &&
                    (completed[activeStep] ? null : (
                      <a onClick={handleComplete} variant="plain">
                        {completedSteps() === totalSteps() - 1
                          ? "Finish"
                          : null}
                      </a>
                    ))}
                </Box>
              </React.Fragment>
            )}
          </div>
        </Box>
      </div>

      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <form
            // onSubmit={handleSubmit}
            >
              {activeStep === 0 && (
                <>
                  <div className="text-center mt-3">
                    <h3>Invoice</h3>
                  </div>
                  <div className="form-group row">
                    <div className="col-lg-6">
                      <div className="d-flex my-2">
                        <label
                          htmlFor="invoiceNo"
                          className="col-sm-3 col-form-label"
                        >
                          Invoice Number <span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="invoiceNo"
                            id="invoiceNo"
                            placeholder="Enter Invoice Number"
                            value={formData.invoiceNo}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex my-2">
                        <label
                          htmlFor="invoiceDate"
                          className="col-sm-3 col-form-label"
                        >
                          Invoice Date <span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="date"
                            className="form-control"
                            name="invoiceDate"
                            id="invoiceDate"
                            value={formData.invoiceDate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex my-2">
                        <label
                          htmlFor="dueDate"
                          className="col-sm-3 col-form-label"
                        >
                          Due Date <span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="date"
                            className="form-control"
                            name="dueDate"
                            id="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-end">
                      <div
                        className="logoUpload text-center"
                        onClick={handleLogoClick}
                      >
                        {formData.logoFile ? (
                          <div className="logoPreview">
                            <img
                              src={URL.createObjectURL(formData.logoFile)}
                              alt="Logo Preview"
                              className="img-fluid"
                            />
                            <div className="overlay">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={handleDeleteLogo}
                              >
                                <BsTrash />
                              </button>
                            </div>
                          </div>
                        ) : (
                          fileInputVisible && (
                            <label htmlFor="logoFile" className="uploadLogo">
                              <CiImageOn size={30} />
                              <br />
                              Upload Logo
                              <input
                                type="file"
                                id="logoFile"
                                accept="image/*"
                                name="logoFile"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  handleLogoChange(e);
                                  handleChange(e);
                                }}
                              />
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row justify-content-between formBox pt-5 pb-0">
                    <div className="col-lg-6 col-sm-12">
                      <div className="col-lg-12  border rounded-4 px-5 py-5 mb-4 mb-lg-0">
                        <div className="form-group row">
                          <div className="col-auto pe-0 me-0">
                            <h3 className="mb-0 pe-0">Billed By</h3>
                          </div>
                          <div className="col-auto my-auto ms-0">
                            <h6 className="mb-0 ps-0 me-0">(Your Details)</h6>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-11">
                            <div
                              className="input-group"
                              onClick={() => setShowOptions(!showOptions)}
                            >
                              <select
                                className="form-control"
                                id="country"
                                value={formData.billedBy.country}
                                onChange={(e) => {
                                  formData.billedBy.country =
                                    filteredCountries.find(
                                      (data) =>
                                        data.name.common === e.target.value
                                    );
                                  handleCountrySelect(
                                    "billedBy",
                                    formData.billedBy.country.name.common,
                                    formData.billedBy.country.cca2,
                                    setShowOptions
                                  );
                                }}
                              >
                                {filteredCountries.map((data) => (
                                  <option
                                    key={data.cca2}
                                    value={data.name.common}
                                  >
                                    {data.name.common}
                                  </option>
                                ))}
                              </select>
                              <div className="password-icon">
                                {showOptions ? <FaAngleUp /> : <FaAngleDown />}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-11">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Your Business Name (Required)"
                              name="billedBy.businessName"
                              value={formData.billedBy.businessName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              name="billedBy.email"
                              id="billedByEmail"
                              placeholder="Your email (optional)"
                              value={formData.billedBy.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <div className="input-group">
                              <PhoneInput
                                name="billedBy.phoneNumber"
                                country={formData.billedBy.countryCode}
                                value={formData.billedBy.phoneNumber}
                                onChange={handlePhoneNumberChange("billedBy")}
                                containerClassName="react-phone-input"
                                inputClassName="form-control"
                                inputProps={{ required: true }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              name="billedBy.gstin"
                              placeholder="Your GSTIN (Optional)"
                              value={formData.billedBy.gstin}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control"
                              name="billedBy.pan"
                              placeholder="Your PAN (Optional)"
                              value={formData.billedBy.pan}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-11">
                            <input
                              type="text"
                              className="form-control"
                              name="billedBy.address"
                              id="billedByBusinessAddress"
                              placeholder="Address (Optional)"
                              value={formData.billedBy.address}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              name="billedBy.city"
                              placeholder="Enter Your City"
                              value={formData.billedBy.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control"
                              name="billedBy.postalCode"
                              placeholder="Postal Code/Zip Code"
                              value={formData.billedBy.postalCode}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-11">
                            <input
                              type="text"
                              className="form-control"
                              name="billedBy.state"
                              placeholder="State(Optional)"
                              value={formData.billedBy.state}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6 col-sm-12">
                      <div className="col-lg-12 border rounded-4 px-5 py-5">
                        <div className="form-group row">
                          <div className="col-auto pe-0 me-0">
                            <h3 className="mb-0 pe-0">Billed To</h3>
                          </div>
                          <div className="col-auto my-auto ms-0">
                            <h6 className="mb-0 ps-0 me-0">(Client Details)</h6>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-11">
                            <div
                              className="input-group"
                              onClick={() => setShowOptions1(!showOptions1)}
                            >
                              <select
                                className="form-control"
                                id="country"
                                value={formData.billedTo.country}
                                onChange={(e) => {
                                  formData.billedTo.country =
                                    filteredCountries.find(
                                      (data) =>
                                        data.name.common === e.target.value
                                    );
                                  handleCountrySelect(
                                    "billedTo",
                                    formData.billedTo.country.name.common,
                                    formData.billedTo.country.cca2,
                                    setShowOptions1
                                  );
                                }}
                              >
                                {filteredCountries.map((data) => (
                                  <option
                                    key={data.cca2}
                                    value={data.name.common}
                                  >
                                    {data.name.common}
                                  </option>
                                ))}
                              </select>
                              <div className="password-icon">
                                {showOptions1 ? <FaAngleUp /> : <FaAngleDown />}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-11">
                            <input
                              type="text"
                              className="form-control"
                              name="billedTo.businessName"
                              placeholder="Client's Business Name (Required)"
                              value={formData.billedTo.businessName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              name="billedTo.email"
                              placeholder="Client's email (optional)"
                              value={formData.billedTo.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <div className="input-group">
                              <PhoneInput
                                name="billedTo.phoneNumber"
                                country={formData.billedTo.countryCode}
                                value={formData.billedTo.phoneNumber}
                                onChange={handlePhoneNumberChange("billedTo")}
                                containerClassName="react-phone-input"
                                inputClassName="form-control"
                                inputProps={{ required: true }}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              name="billedTo.gstin"
                              placeholder="Client's GSTIN (Optional)"
                              value={formData.billedTo.gstin}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control"
                              name="billedTo.pan"
                              placeholder="Client's PAN (Optional)"
                              value={formData.billedTo.pan}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-11">
                            <input
                              type="text"
                              className="form-control"
                              name="billedTo.address"
                              placeholder="Address (Optional)"
                              value={formData.billedTo.address}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              name="billedTo.city"
                              placeholder="Enter Client's City"
                              value={formData.billedTo.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control"
                              name="billedTo.postalCode"
                              placeholder="Postal Code/Zip Code"
                              value={formData.billedTo.postalCode}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-11">
                            <input
                              type="text"
                              className="form-control"
                              name="billedTo.state"
                              placeholder="State(Optional)"
                              value={formData.billedTo.state}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row jstify-content-between pt-3 pb-3 ps-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        name="shipping.showShipping"
                        type="checkbox"
                        checked={formData.shipping.showShipping}
                        id="flexCheckDefault"
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label fs-5 ps-1"
                        htmlFor="flexCheckDefault"
                      >
                        Add Shipping Details
                      </label>
                    </div>
                  </div>
                  {formData.shipping.showShipping && (
                    <div className="container-fluid">
                      <div className="form-group row justify-content-between formBox1 pt-0 pb-5">
                        <div className="col-lg-6 col-sm-12">
                          <div className="col-lg-12  border rounded-4 px-5 py-5 mb-4 mb-lg-0">
                            <div className="form-group row">
                              <div className="col-auto pe-0 me-0">
                                <h3 className="mb-0 pe-0">Shipped From</h3>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="shipping.shippedFrom.sameWithBilledBy"
                                    checked={
                                      formData.shipping.shippedFrom
                                        .sameWithBilledBy
                                    }
                                    value={
                                      formData.shipping.shippedFrom
                                        .sameWithBilledBy
                                    }
                                    id="flexCheckDefault"
                                    onChange={handleChange}
                                  />
                                  <label
                                    className="form-check-label fs-6 ps-1"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Same as your business address
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedFrom.businessName"
                                  placeholder="Your Business Name (Required)"
                                  value={
                                    formData.shipping.shippedFrom.businessName
                                  }
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <div
                                  className="input-group"
                                  onClick={() => setShowOptions2(!showOptions2)}
                                >
                                  <select
                                    className="form-control"
                                    // id="country"
                                    name="shipping.shippedFrom.country"
                                    value={
                                      formData.shipping.shippedFrom.country
                                    }
                                    onChange={(e) => {
                                      formData.shipping.shippedFrom.country =
                                        filteredCountries.find(
                                          (data) =>
                                            data.name.common === e.target.value
                                        );

                                      handleCountrySelect(
                                        "shipping.shippedFrom",
                                        formData.shipping.shippedFrom.country
                                          .name.common,
                                        formData.shipping.shippedFrom.country
                                          .cca2,
                                        setShowOptions2
                                      );
                                    }}
                                  >
                                    {filteredCountries.map((data) => (
                                      <option
                                        key={data.cca2}
                                        value={data.name.common}
                                      >
                                        {data.name.common}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="password-icon">
                                    {showOptions2 ? (
                                      <FaAngleUp />
                                    ) : (
                                      <FaAngleDown />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedFrom.address"
                                  placeholder="Address (Optional)"
                                  value={formData.shipping.shippedFrom.address}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedFrom.city"
                                  placeholder="Enter Your City"
                                  value={formData.shipping.shippedFrom.city}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="col-sm-6">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedFrom.postalCode"
                                  placeholder="Postal Code/Zip Code"
                                  value={
                                    formData.shipping.shippedFrom.postalCode
                                  }
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedFrom.state"
                                  placeholder="State(Optional)"
                                  value={formData.shipping.shippedFrom.state}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-12">
                          <div className="col-lg-12 border rounded-4 px-5 py-5">
                            <div className="form-group row">
                              <div className="col-auto pe-0 me-0">
                                <h3 className="mb-0 pe-0">Shipped To</h3>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="shipping.shippedTo.sameWithBilledTo"
                                    checked={
                                      formData.shipping.shippedTo
                                        .sameWithBilledTo
                                    }
                                    id="flexCheckDefault"
                                    onChange={handleChange}
                                  />
                                  <label
                                    className="form-check-label fs-6 ps-1"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Same as Client's business address
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedTo.businessName"
                                  placeholder="Client's Business Name (Required)"
                                  value={
                                    formData.shipping.shippedTo.businessName
                                  }
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11 position-relative">
                                <div className="col-sm-11 position-relative">
                                  <div
                                    className="input-group"
                                    onClick={() =>
                                      setShowOptions3(!showOptions3)
                                    }
                                  >
                                    <select
                                      className="form-control"
                                      value={
                                        formData.shipping.shippedTo.country
                                      }
                                      onChange={(e) => {
                                        formData.shipping.shippedTo.country =
                                          filteredCountries.find(
                                            (data) =>
                                              data.name.common ===
                                              e.target.value
                                          );
                                        handleCountrySelect(
                                          "shipping.shippedTo",
                                          formData.shipping.shippedTo.country
                                            .name.common,
                                          formData.shipping.shippedTo.country
                                            .cca2,
                                          setShowOptions3
                                        );
                                      }}
                                    >
                                      {filteredCountries.map((data) => (
                                        <option
                                          key={data.cca2}
                                          value={data.name.common}
                                        >
                                          {data.name.common}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="password-icon">
                                      {showOptions3 ? (
                                        <FaAngleUp />
                                      ) : (
                                        <FaAngleDown />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedTo.address"
                                  placeholder="Address (Optional)"
                                  value={formData.shipping.shippedTo.address}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedTo.city"
                                  placeholder="Enter Client's City"
                                  value={formData.shipping.shippedTo.city}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="col-sm-6">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedTo.postalCode"
                                  placeholder="Postal Code/Zip Code"
                                  value={formData.shipping.shippedTo.postalCode}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-11">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shipping.shippedTo.state"
                                  placeholder="State(Optional)"
                                  value={formData.shipping.shippedTo.state}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row justify-content-between-formBox border rounded-4 px-5 py-5 pt-5 pb-5">
                        <h3>Transport Details</h3>
                        <div className="form-group row justify-content-between fromBox">
                          <label
                            htmlFor="transporterDetails"
                            className="col-sm-3 col-form-label"
                          >
                            Transporter Details
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-sm-12 pe-3">
                            <select
                              className="form-control"
                              id="transporterDetails"
                              name="shipping.transporterDetails.transportType"
                              value={
                                formData.shipping.transporterDetails
                                  .transportType
                              }
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select Transport Type</option>
                              {/* {transportTypes.map((transportType) => (
                            <option
                              key={transportType.id}
                              value={transportType.id}
                            >
                              {transportType.transportTypeName}
                            </option>
                          ))} */}
                            </select>
                          </div>
                        </div>
                        <div className="form-group row justify-content-between fromBox">
                          <label
                            htmlFor="transportDistance"
                            className="col-sm-3 col-form-label"
                          >
                            Distance (in km)
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-sm-4"></div>
                          <div className="">
                            <input
                              type="number"
                              name="shipping.transporterDetails.distance"
                              id=""
                              value={
                                formData.shipping.transporterDetails.distance
                              }
                              onChange={handleChange}
                              className="col-sm-12 form-control"
                            />
                          </div>
                        </div>
                        <div className="form-group row justify-content-between fromBox">
                          {tclicked ? (
                            <>
                              <label
                                htmlFor="transportMode"
                                className="col-sm-3 col-form-label"
                              >
                                Mode of Transport
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-sm-3  d-flex justify-content-end pe-4">
                                <RxCross2
                                  size={25}
                                  className="transportCross"
                                  onClick={() => {
                                    tsetClicked(!tclicked);
                                  }}
                                />
                              </div>
                              <div className="col-sm-12 pe-3">
                                <select
                                  className="form-control"
                                  name="shipping.transport.type"
                                  id="transportMode"
                                  value={formData.shipping.transport.type}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">
                                    Select Transport Type
                                  </option>
                                  <option value="road">Road</option>
                                  <option value="rail">Rail</option>
                                  <option value="ship">Ship</option>
                                  <option value="air">Air</option>
                                </select>
                              </div>
                            </>
                          ) : (
                            <p
                              className="d-flex"
                              onClick={() => {
                                tsetClicked(!tclicked);
                              }}
                            >
                              <CiSquarePlus size={30} />
                              Add Mode of Transport
                            </p>
                          )}
                        </div>
                        <div className="form-group row justify-content-between formBox">
                          <div className="col-lg-6 col-sm-12">
                            {tclicked1 ? (
                              <div className="form-group row justify-content-between fromBox">
                                <div className="row">
                                  <div className="col-sm-6">
                                    <label
                                      htmlFor="transportNumber"
                                      className="col-sm-12 col-form-label"
                                    >
                                      Challan
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                  <div className="col-sm-6  d-flex justify-content-end">
                                    <RxCross2
                                      size={25}
                                      className="transportCross"
                                      onClick={() => {
                                        tsetClicked1(!tclicked1);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-12">
                                  <input
                                    type="text"
                                    name="shipping.transport.challan.docNo"
                                    id="transportNumber"
                                    value={
                                      formData.shipping.transport.challan.docNo
                                    }
                                    onChange={handleChange}
                                    placeholder="Add Transport Doc No."
                                    className="col-sm-12 form-control"
                                  />
                                </div>
                              </div>
                            ) : (
                              <p
                                onClick={() => {
                                  tsetClicked1(!tclicked1);
                                }}
                              >
                                <CiSquarePlus size={30} />
                                Add Transport Doc No.
                              </p>
                            )}
                          </div>
                          <div className="col-lg-6 col-sm-12">
                            {tclicked2 ? (
                              <div className="form-group row justify-content-between fromBox">
                                <div className="row">
                                  <div className="col-sm-6">
                                    <label
                                      htmlFor="transportDate"
                                      className="col-sm-12 col-form-label"
                                    >
                                      Challan Date
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                  <div className="col-sm-6  d-flex justify-content-end">
                                    <RxCross2
                                      size={25}
                                      className="transportCross"
                                      onClick={() => {
                                        tsetClicked2(!tclicked2);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-12">
                                  <input
                                    type="date"
                                    name="shipping.transport.challan.date"
                                    id="transportDate"
                                    value={
                                      formData.shipping.transport.challan.date
                                    }
                                    onChange={handleChange}
                                    className="col-sm-12 form-control"
                                  />
                                </div>
                              </div>
                            ) : (
                              <p
                                onClick={() => {
                                  tsetClicked2(!tclicked2);
                                }}
                              >
                                <CiSquarePlus size={30} />
                                Add Transport Doc Date
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="form-group row justify-content-between formBox">
                          <div className="col-lg-6 col-sm-12">
                            {tclicked3 ? (
                              <div className="form-group row justify-content-between fromBox">
                                <div className="row">
                                  <div className="col-sm-6">
                                    <label
                                      htmlFor="VeichleType"
                                      className="col-sm-12 col-form-label"
                                    >
                                      Vehicle Type
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                  <div className="col-sm-6  d-flex justify-content-end">
                                    <RxCross2
                                      size={25}
                                      className="transportCross"
                                      onClick={() => {
                                        tsetClicked3(!tclicked3);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 pe-3">
                                  <select
                                    className="form-control"
                                    id="vehicleType"
                                    name="shipping.transport.vehicle.type"
                                    value={
                                      formData.shipping.transport.vehicle.type
                                    }
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value="">
                                      Select Transport Type
                                    </option>
                                    <option value="regular">Regular</option>
                                    <option value="cargo">
                                      Over Dimensional Cargo
                                    </option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <p
                                onClick={() => {
                                  tsetClicked3(!tclicked3);
                                }}
                              >
                                <CiSquarePlus size={30} />
                                Vehicle Type
                              </p>
                            )}
                          </div>
                          <div className="col-lg-6 col-sm-12">
                            {tclicked4 ? (
                              <div className="form-group row justify-content-between fromBox">
                                <div className="row">
                                  <div className="col-sm-6">
                                    {" "}
                                    <label
                                      htmlFor="vehicleNumber"
                                      className="col-sm-12 col-form-label"
                                    >
                                      Vehicle Number
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                  <div className="col-sm-6  d-flex justify-content-end">
                                    <RxCross2
                                      size={25}
                                      className="transportCross"
                                      onClick={() => {
                                        tsetClicked4(!tclicked4);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12">
                                  <input
                                    type="text"
                                    name="shipping.transport.vehicle.number"
                                    id="vehicleNumber"
                                    value={
                                      formData.shipping.transport.vehicle.number
                                    }
                                    onChange={handleChange}
                                    placeholder="  Add Transport Doc No."
                                    className="col-sm-12 form-control"
                                  />
                                </div>
                              </div>
                            ) : (
                              <p
                                onClick={() => {
                                  tsetClicked4(!tclicked4);
                                }}
                              >
                                <CiSquarePlus size={30} />
                                Vehicle Number
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="form-group row justify-content-between fromBox">
                          <div className="col-lg-6 col-sm-6">
                            {tclicked5 ? (
                              <div className="form-group row justify-content-between fromBox">
                                <div className="row">
                                  <div className="col-sm-6">
                                    <label
                                      htmlFor="transportType"
                                      className="col-sm-12 col-form-label"
                                    >
                                      Mode of Transaction
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                  <div className="col-sm-6  d-flex justify-content-end">
                                    <RxCross2
                                      size={25}
                                      className="transportCross"
                                      onClick={() => {
                                        tsetClicked5(!tclicked5);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-12 pe-3">
                                  <select
                                    className="form-control"
                                    id="transactionType"
                                    name="shipping.transport.transaction.type"
                                    value={
                                      formData.shipping.transport.transaction
                                        .type
                                    }
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value="">
                                      Select Transaction Type
                                    </option>
                                    <option value="road">Regular</option>
                                    <option value="rail">
                                      Bill From - Bill To
                                    </option>
                                    <option value="ship">
                                      Ship From - Ship To
                                    </option>
                                    <option value="air">
                                      Combination of Both
                                    </option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <p
                                className="d-flex"
                                onClick={() => {
                                  tsetClicked5(!tclicked5);
                                }}
                              >
                                <CiSquarePlus size={30} />
                                Add Transaction Type
                              </p>
                            )}
                          </div>
                          <div className="col-lg-6 col-sm-6">
                            {tclicked6 ? (
                              <div className="form-group row justify-content-between fromBox">
                                <div className="row">
                                  <div className="col-sm-6 ">
                                    <label
                                      htmlFor="subSupplyFor"
                                      className="col-sm-12 col-form-label"
                                    >
                                      Sub Supply Type
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                  <div className="col-sm-6  d-flex justify-content-end">
                                    <RxCross2
                                      size={25}
                                      className="transportCross"
                                      onClick={() => {
                                        tsetClicked6(!tclicked6);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 pe-3">
                                  <select
                                    className="form-control"
                                    id="subSupplyFor"
                                    name="shipping.transport.transaction.subSupplyType"
                                    value={
                                      formData.shipping.transport.transaction
                                        .subSupplyType
                                    }
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value="">Sub Supply Type</option>
                                    <option value="import">Import</option>
                                    <option value="export">Export</option>
                                    <option value="own">For Own Use</option>
                                    <option value="other">Others</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <p
                                className="d-flex"
                                onClick={() => {
                                  tsetClicked6(!tclicked6);
                                }}
                              >
                                <CiSquarePlus size={30} />
                                Sub Supply Type
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-group row">
                    <div className="col-lg-6"></div>
                    <div className="col-lg-6  my-2">
                      <div className="col-lg-12 d-flex">
                        <label
                          htmlFor="currency"
                          className="col-sm-3 col-form-label"
                        >
                          Currency<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-9 pe-3">
                          <select
                            className="form-control"
                            id="currency"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                          >
                            <option value="">Select Currency</option>
                            {currencies.map((currency) => (
                              <option
                                key={currency.currencyCode}
                                value={currency.currencyCode}
                              >
                                {currency.currencyName} ({currency.currencyCode}
                                , {currency.currencySymbol})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row table-responsive mb-3 mt-5">
                    <div>
                      <TableContainer
                        className="table-container"
                        style={{ width: "100%" }}
                      >
                        <Table
                          variant="simple"
                          size="lg"
                          style={{ width: "100%" }}
                        >
                          <Thead>
                            <Tr className="table-header-row">
                              <Th>Items</Th>
                              <Th>Quantity</Th>
                              <Th>Units</Th>
                              <Th>Rate</Th>
                              <Th>Amount</Th>
                              <Th>Action</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {formData.items.map((item, index) => (
                              <Tr key={index}>
                                <Td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Item Name"
                                    name={`items[${index}].description`}
                                    value={item.description || ""}
                                    onChange={handleChange}
                                  />
                                </Td>
                                <Td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name={`items[${index}].quantity`}
                                    placeholder="Qty"
                                    value={item.quantity || ""}
                                    onChange={handleChange}
                                  />
                                </Td>
                                <Td>
                                  <select
                                    className="form-control"
                                    name={`items[${index}].unit`}
                                    value={item.unit || ""}
                                    onChange={handleChange}
                                  >
                                    <option value="">Select Unit</option>
                                    <option value="pcs">pcs</option>
                                    <option value="kg">kg</option>
                                    <option value="litre">litre</option>
                                  </select>
                                </Td>
                                <Td>
                                  <InputGroup className="currency-symbol">
                                    <InputLeftElement pointerEvents="none">
                                      {getCurrencySymbol(formData.currency)}
                                    </InputLeftElement>
                                    <Input
                                      name={`items.[${index}].price`}
                                      placeholder={`Price`}
                                      value={item.price || ""}
                                      className="ps-3"
                                      onChange={handleChange}
                                    />
                                  </InputGroup>
                                </Td>
                                <Td>
                                  <InputGroup className="currency-symbol">
                                    <InputLeftElement pointerEvents="none">
                                      {getCurrencySymbol(formData.currency)}
                                    </InputLeftElement>
                                    <Input
                                      name={`items.[${index}].amount`}
                                      placeholder={`Amount`}
                                      value={item.amount || ""}
                                      className="ps-3"
                                      onChange={handleChange}
                                      readOnly
                                    />
                                  </InputGroup>
                                </Td>
                                <Td>
                                  {formData.items.length > 1 && (
                                    <MdDeleteForever
                                      size={30}
                                      className="delete-icon"
                                      onClick={() => handleDeleteRow(index)}
                                    />
                                  )}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-lg-6">
                      <button
                        type="button"
                        className="btn addbtn mx-auto"
                        onClick={handleAddRow}
                      >
                        <MdAdd size={20} />
                      </button>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group row">
                        <div className="col-sm-8 text-end">Total</div>
                        <div className="col-sm-4 text-center">
                          <ChakraProvider>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                {getCurrencySymbol(formData.currency)}
                              </InputLeftElement>
                              <Input
                                placeholder={`0.00`}
                                name="total"
                                value={formData.total}
                                readOnly
                              />
                            </InputGroup>
                          </ChakraProvider>
                        </div>
                      </div>
                      {discountShow ? (
                        <div className="form-group row">
                          <div className="col-sm-8 text-end">Discount</div>
                          <div className="col-sm-4 d-flex discountInput">
                            <input
                              type="number"
                              name="discountShow"
                              className="col-lg-6 border"
                              value={formData.discount}
                              onChange={(e) =>
                                setFormData((prevData) => ({
                                  ...prevData,
                                  discount: parseFloat(e.target.value) || 0.0,
                                }))
                              }
                            />
                            <select
                              name=""
                              id=""
                              value={formData.discountType}
                              onChange={handleDiscountTypeChange}
                              className="col-lg-4 border"
                            >
                              <option value="%">%</option>
                              <option
                                value={getCurrencySymbol(formData.currency)}
                              >
                                {getCurrencySymbol(formData.currency)}
                              </option>
                            </select>
                            <RxCross2
                              size={20}
                              className="col-lg-2 my-auto"
                              onClick={() => {
                                setDiscountShow(!discountShow);
                              }}
                            />
                          </div>
                        </div>
                      ) : null}
                      <div className="form-group row">
                        <div className="col-sm-8 text-end">CGST</div>
                        <div className="col-sm-4 text-center">
                          <ChakraProvider>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                %
                              </InputLeftElement>
                              <Input
                                type="number"
                                name="cgst"
                                placeholder={`0.00`}
                                value={formData.cgst}
                                onChange={handleChange}
                              />
                            </InputGroup>
                          </ChakraProvider>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-8 text-end">SGST</div>
                        <div className="col-sm-4 text-center ">
                          <ChakraProvider>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                %
                              </InputLeftElement>
                              <Input
                                type="number"
                                name="sgst"
                                placeholder={`0.00`}
                                value={formData.sgst}
                                onChange={handleChange}
                              />
                            </InputGroup>
                          </ChakraProvider>
                        </div>
                      </div>
                      {roundOnShow ? (
                        <div className="form-group row">
                          <div className="col-sm-8 text-end">Round On</div>
                          <div className="col-sm-4 d-flex ">
                            <input
                              type="number"
                              name="roundOn"
                              value={(
                                Math.ceil(formData.subtotal) - formData.subtotal
                              ).toFixed(2)}
                              className="col-lg-10 border roundOn"
                              onChange={handleChange}
                              readOnly
                            />

                            <RxCross2
                              size={20}
                              className="col-lg-2 my-auto"
                              onClick={() => {
                                setRoundOnShow(!roundOnShow);
                                if (roundOnShow) {
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    roundOn: 0.0,
                                    subtotal: prevData.subtotal,
                                  }));
                                }
                              }}
                            />
                          </div>
                        </div>
                      ) : null}
                      {roundOffShow ? (
                        <div className="form-group row">
                          <div className="col-sm-8 text-end">Round Off</div>
                          <div className="col-sm-4 d-flex ">
                            <input
                              type="number"
                              name="roundOff"
                              id=""
                              value={(
                                formData.subtotal -
                                Math.floor(formData.subtotal)
                              ).toFixed(2)}
                              onChange={handleChange}
                              className="col-lg-10 border roundOff"
                              readOnly
                            />

                            <RxCross2
                              size={20}
                              className="col-lg-2 my-auto"
                              onClick={() => {
                                setRoundOffShow(!roundOffShow);
                                if (roundOffShow) {
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    roundOff: 0,
                                    subtotal: prevData.subtotal,
                                  }));
                                }
                              }}
                            />
                          </div>
                        </div>
                      ) : null}
                      <div className="form-group row justify-content-end pt-3 pb-3 calculationDiv">
                        <div className="col-sm-6 ">
                          {!discountShow ? (
                            <p
                              className="d-flex flex-row gap-2"
                              onClick={() => {
                                setDiscountShow(!discountShow);
                              }}
                            >
                              <MdOutlineDiscount size={25} />
                              Discount On Total
                            </p>
                          ) : null}

                          {!roundOnShow && !roundOffShow ? (
                            <div className="roundDiv">
                              <p
                                className="d-flex flex-row gap-2"
                                onClick={() => {
                                  setRoundOnShow(!roundOnShow);
                                }}
                              >
                                <FaArrowRotateLeft />
                                Round Up
                              </p>
                              <p
                                className="d-flex flex-row gap-2"
                                onClick={() => {
                                  setRoundOffShow(!roundOffShow);
                                }}
                              >
                                <FaArrowRotateRight />
                                Round Down
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-8 text-end">Sub Total</div>
                        <div className="col-sm-4 text-center">
                          <ChakraProvider>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                {getCurrencySymbol(formData.currency)}
                              </InputLeftElement>
                              <Input
                                placeholder={`0.00`}
                                value={finalSubtotal}
                                readOnly
                              />
                            </InputGroup>
                          </ChakraProvider>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group row d-flex flex-column ">
                    <div className="col-lg-4 ">
                      {!signDiv ? (
                        <div
                          className="d-flex  border justify-content-center ps-5 pe-5 pt-3 pb-3"
                          onClick={() => {
                            setSignDiv(!signDiv);
                          }}
                        >
                          <Button
                            leftIcon={<LuPenLine size={20} />}
                            colorScheme="blue"
                            variant="outline"
                          >
                            Add Signature
                          </Button>
                        </div>
                      ) : (
                        <div className="col-lg-12 p-3 border rounded-4 shadow">
                          <div className="row">
                            <div className="col-sm-6">
                              <h3 className=" col-form-label fs-4">
                                Signature
                              </h3>
                            </div>
                            <div className="col-sm-6 ">
                              <RxCross2
                                size={25}
                                className="transportCross float-end"
                                onClick={() => {
                                  setSignDiv(!signDiv);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="logoUpload signatureup text-center">
                              {formData.signature.url ? (
                                <div className="logoPreview">
                                  <img
                                    src={formData.signature.url}
                                    alt="Logo Preview"
                                    className="img-fluid"
                                    onClick={handleSignatureClick}
                                  />
                                  <div className="overlay">
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={handleDeleteLogo1}
                                    >
                                      <BsTrash />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                fileInputVisible1 && (
                                  <label
                                    htmlFor="logoFile1"
                                    className="uploadLogo upsignature"
                                  >
                                    <MdFileUpload size={50} />
                                    <br />
                                    <p className="my-auto fs-6"> Upload</p>
                                    <input
                                      type="file"
                                      id="logoFile1"
                                      accept="image/*"
                                      name="signature"
                                      style={{ display: "none" }}
                                      ref={signatureFileInputRef}
                                      onChange={handleLogoChange1}
                                    />
                                  </label>
                                )
                              )}
                            </div>
                            <Button
                              leftIcon={<LuPenLine size={20} />}
                              colorScheme="blue"
                              variant="outline"
                              className="border uploadSignatureBtn ps-5 pe-5 pt-3 pb-3 mb-3"
                              onClick={handleSignatureClick}
                            >
                              Upload Signature
                            </Button>
                            <Button
                              leftIcon={<LuPenLine size={20} />}
                              className="border uploadSignatureBtn ps-5 pe-5 pt-3 pb-3 "
                              colorScheme="blue"
                              variant="outline"
                              onClick={onOpen}
                            >
                              Use Signature Pad
                            </Button>
                            <div className="modalContainer d-flex justify-content-center">
                              <Modal
                                blockScrollOnMount={false}
                                isOpen={isOpen}
                                onClose={onClose}
                              >
                                <ModalOverlay />
                                <ModalContent>
                                  <ModalHeader className="Title  col-sm-6">
                                    Draw Signature
                                  </ModalHeader>
                                  <ModalCloseButton className="ModalCloseIcon col-sm-6" />
                                  <ModalBody className="modalBody">
                                    <div className="signature-pad my-2">
                                      <SignatureCanvas
                                        penColor="black"
                                        canvasProps={{
                                          className: "signature-canvas",
                                        }}
                                        ref={signatureRef}
                                      />
                                    </div>
                                    <p
                                      className="  mt-2 resetSignature d-flex flex-row justify-content-center mt-4"
                                      onClick={clearSignature}
                                    >
                                      <BsTrash /> Reset
                                    </p>
                                  </ModalBody>

                                  <ModalFooter className="modalFooter">
                                    <Button
                                      className="modalCloseBtn"
                                      size="xs"
                                      mr={3}
                                      onClick={onClose}
                                    >
                                      Close
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="ModalUploadBtn"
                                      onClick={saveSignature}
                                    >
                                      Upload Signature
                                    </Button>
                                  </ModalFooter>
                                </ModalContent>
                              </Modal>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <Button
                      onClick={handleNext}
                      sx={{ mr: 1 }}
                      className="btn submitbtn mx-auto"
                    >
                      Save & Continue
                    </Button>
                  </div>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <div className="text-center mt-3">
                    <h3>Add Banking Details</h3>
                  </div>
                  <div className="form-group row ">
                    <div className="col-lg-4 text-center mx-auto my-4 py-4 bankContainer">
                      <div className="iconBox mx-auto rounded-circle text-center">
                        <RiBankLine size={40} className="pig " />
                      </div>
                      <h5>Add Bank Account Detail</h5>
                      <p>
                        Add Your Bank Account to Your invoices to make it easier
                        your clients to pay
                      </p>

                      <Button
                        leftIcon={<SettingsIcon />}
                        variant="solid"
                        sx={{ mr: 1 }}
                        className="btn submitbtn mx-auto"
                        onClick={() => {
                          setShowBankInputs(!showBankInputs);
                        }}
                      >
                        Add Bank Account
                      </Button>
                    </div>
                  </div>
                  {showBankInputs && (
                    <>
                      <div className="form-group row justify-content-between fromBox">
                        <div className="col-lg-6 col-sm-6">
                          <div className="form-group row justify-content-between fromBox">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  htmlFor="transportType"
                                  className="col-sm-12 col-form-label"
                                >
                                  Country
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-12 pe-3">
                              <div
                                className="input-group"
                                onClick={() => setShowOptions4(!showOptions4)}
                              >
                                <select
                                  className="form-control"
                                  id="country"
                                  value={formData.bankDetails.country}
                                  onChange={(e) => {
                                    formData.bankDetails.country =
                                      filteredCountries.find(
                                        (data) =>
                                          data.name.common === e.target.value
                                      );
                                    handleCountrySelect(
                                      "bankDetails",
                                      formData.bankDetails.country.name.common,
                                      formData.bankDetails.country.cca2,
                                      setShowOptions4
                                    );
                                  }}
                                >
                                  {filteredCountries.map((data) => (
                                    <option
                                      key={data.cca2}
                                      value={data.name.common}
                                    >
                                      {data.name.common}
                                    </option>
                                  ))}
                                </select>
                                <div className="password-icon">
                                  {showOptions ? (
                                    <FaAngleUp />
                                  ) : (
                                    <FaAngleDown />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                          <div className="form-group row justify-content-between fromBox">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  htmlFor="transportType"
                                  className="col-sm-12 col-form-label"
                                >
                                  Bank Name
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-12 pe-3">
                              <input
                                name="bankDetails.bankName"
                                value={formData.bankDetails.BankName}
                                type="text"
                                className="col-sm-12 form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row justify-content-between fromBox">
                        <div className="col-lg-6 col-sm-6">
                          <div className="form-group row justify-content-between fromBox">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  htmlFor="transportType"
                                  className="col-sm-12 col-form-label"
                                >
                                  Account Number
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-12 pe-3">
                              <input
                                name="bankDetails.accountNumber"
                                value={formData.bankDetails.accountNumber}
                                type="text"
                                className="col-sm-12 form-control"
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                          <div className="form-group row justify-content-between fromBox">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  htmlFor="transportType"
                                  className="col-sm-12 col-form-label"
                                >
                                  Confirm Account Number
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-12 pe-3">
                              <input
                                name="bankDetails.confirmAccountNumber"
                                value={
                                  formData.bankDetails.confirmAccountNumber
                                }
                                type="text"
                                className="col-sm-12 form-control"
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row justify-content-between fromBox">
                        <div className="col-lg-6 col-sm-6">
                          <div className="form-group row justify-content-between fromBox">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  htmlFor="transportType"
                                  className="col-sm-12 col-form-label"
                                >
                                  IFSC Code
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-12 pe-3">
                              <input
                                name="bankDetails.ifscCode"
                                value={formData.bankDetails.ifscCode}
                                type="text"
                                onChange={handleChange}
                                className="col-sm-12 form-control"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                          <div className="form-group row justify-content-between fromBox">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  htmlFor="transportType"
                                  className="col-sm-12 col-form-label"
                                >
                                  Account Holder Name
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-12 pe-3">
                              <input
                                name="bankDetails.accountHolderName"
                                value={formData.bankDetails.accountHolderName}
                                type="text"
                                onChange={handleChange}
                                className="col-sm-12 form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row justify-content-between fromBox">
                        <div className="col-lg-6 col-sm-6">
                          <div className="form-group row justify-content-between fromBox">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  htmlFor="transportType"
                                  className="col-sm-12 col-form-label"
                                >
                                  Bank Account Type
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-12 pe-3">
                              <select
                                name="bankDetails.bankAccountType"
                                value={formData.bankDetails.bankAccountType}
                                type="text"
                                onChange={handleChange}
                                className="col-sm-12 form-control"
                              >
                                <option value="saving">Saving</option>
                                <option value="current">Current</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                          <div className="form-group row justify-content-between fromBox">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  htmlFor="transportType"
                                  className="col-sm-12 col-form-label"
                                >
                                  Currency
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-12 pe-3">
                              <select
                                className="form-control"
                                name="bankDetails.currency"
                                value={formData.bankDetails.currency}
                                onChange={handleChange}
                              >
                                <option value="">Select Currency</option>
                                {currencies.map((currency) => (
                                  <option
                                    key={currency.currencyCode}
                                    value={currency.currencyCode}
                                  >
                                    {currency.currencyName} (
                                    {currency.currencyCode},
                                    {currency.currencySymbol})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="form-group row justify-content-between fromBox">
                    {" "}
                    <button type="submit" className="btn submitbtn mx-auto">
                      Generate
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
      {activeStep !== 0 && (
        <div className="container d-flex justify-content-between mt-3">
          <a
            variant="plain"
            disabled={activeStep === 0}
            onClick={handleBack}
            className="backBtn"
          >
            <FaArrowCircleLeft className="me-2" />
            Back
          </a>
          {activeStep !== 2 && (
            <a variant="plain" onClick={handleNext} className="nextBtn">
              Next <FaArrowCircleRight className="ms-2" />
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default InvoiceMain;
