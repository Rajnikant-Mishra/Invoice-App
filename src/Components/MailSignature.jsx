import React, { useState, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MailSignature.css";
import styles from "./Detail.module.css";
import { BiSolidUserDetail } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { IoShareSocialOutline, IoLogoGooglePlaystore } from "react-icons/io5";
import { GrTemplate } from "react-icons/gr";
import { CiYoutube } from "react-icons/ci";
import { MdOutlineDraw, MdOutlineDashboardCustomize } from "react-icons/md";
import Cropper from "react-easy-crop";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { RiAddBoxFill } from "react-icons/ri";
import { Delete } from "@mui/icons-material";
import { RxCross2 } from "react-icons/rx";
import {
  FaRegImage,
  FaLinkedinIn,
  FaMeetup,
  FaYelp,
  FaMapMarkerAlt,
  FaStackOverflow,
  FaBehance,
  FaEbay,
  FaEtsy,
  FaPinterestP,
  FaApple,
  FaBloggerB,
  FaWhatsapp,
  FaSoundcloud,
  FaFlickr,
  FaDeviantart,
  FaReddit,
  FaAmazon,
  FaSlack,
  FaTelegram,
  FaPatreon,
  FaSnapchatGhost,
  FaTumblr,
  FaWordpress,
  FaRss,
  FaVimeoV,
  FaFacebookF,
} from "react-icons/fa";
import { FaUpwork, FaThreads, FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { SiZillow, SiNetlify } from "react-icons/si";
import { TbBrandGithubFilled } from "react-icons/tb";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  FormLabel,
  Text,
  Tooltip,
  Box,
  Grid,
  Card,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { LiaImdb } from "react-icons/lia";

const MailSignature = () => {
  const [formData, setFormData] = useState({
    name: "Sarita Gochhayat",
    designation: "Web Developer",
    company: "Evoquesys",
    selected: "Director",
  });
  const [showOptions, setShowOptions] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Detail");
  const [extraFields, setExtraFields] = useState([]);
  const [customFieldLabel, setCustomFieldLabel] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageShape, setImageShape] = useState("circle");
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState(
    "https://w7.pngwing.com/pngs/945/606/png-transparent-baby-boss-illustration-infant-youtube-animation-sticker-youtube-family-glasses-film.png"
  );
  const [fileInputVisible, setFileInputVisible] = useState(true);
  const signatureFileInputRef = useRef(null);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [availableFields, setAvailableFields] = useState([
    "Phone",
    "Address",
    "Email",
    "Website",
    "Zoom",
    "Skype",
    "WhatsApp",
  ]);

  const socialMediaIcons = [
    { icon: <FaFacebookF />, color: "#1877F2", name: "Facebook" },
    { icon: <FaLinkedinIn />, color: "#0077B5", name: "LinkedIn" },
    { icon: <FaXTwitter />, color: "#1DA1F2", name: "Twitter" },
    { icon: <FaMeetup />, color: "#F96060", name: "Meetup" },
    { icon: <FaYelp />, color: "#D32323", name: "Yelp" },
    { icon: <FaMapMarkerAlt />, color: "#FF5A5F", name: "Map" },
    { icon: <IoLogoGooglePlaystore />, color: "#3DDC84", name: "Google Play" },
    { icon: <FaStackOverflow />, color: "#FE7A16", name: "Stack Overflow" },
    { icon: <FaBehance />, color: "#1769FF", name: "Behance" },
    { icon: <AiFillInstagram />, color: "#C13584", name: "Instagram" },
    { icon: <FaUpwork />, color: "#6FDA44", name: "Upwork" },
    { icon: <FaEbay />, color: "#0064A4", name: "eBay" },
    { icon: <FaThreads />, color: "#6D28D9", name: "Threads" },
    { icon: <FaEtsy />, color: "#D5642F", name: "Etsy" },
    { icon: <FaPinterestP />, color: "#E60023", name: "Pinterest" },
    { icon: <CiYoutube />, color: "#FF0000", name: "YouTube" },
    { icon: <FaApple />, color: "#000000", name: "Apple" },
    { icon: <FaBloggerB />, color: "#FF5722", name: "Blogger" },
    { icon: <FaSoundcloud />, color: "#FF7700", name: "SoundCloud" },
    { icon: <FaFlickr />, color: "#FF0084", name: "Flickr" },
    { icon: <FaDeviantart />, color: "#05CC47", name: "DeviantArt" },
    { icon: <FaReddit />, color: "#FF4500", name: "Reddit" },
    { icon: <FaWhatsapp />, color: "#25D366", name: "WhatsApp" },
    { icon: <FaAmazon />, color: "#FF9900", name: "Amazon Prime" },
    { icon: <FaSlack />, color: "#4A154B", name: "Slack" },
    { icon: <FaTelegram />, color: "#0088CC", name: "Telegram" },
    { icon: <FaPatreon />, color: "#FF424D", name: "Patreon" },
    { icon: <FaTumblr />, color: "#35465C", name: "Tumblr" },
    { icon: <FaWordpress />, color: "#21759B", name: "WordPress" },
    { icon: <FaRss />, color: "#FF6600", name: "RSS" },
    { icon: <SiZillow />, color: "#0072CE", name: "Zillow" },
    { icon: <LiaImdb />, color: "#F5C518", name: "IMDb" },
    { icon: <FaSnapchatGhost />, color: "#FFFC00", name: "Snapchat" },
    { icon: <TbBrandGithubFilled />, color: "#181717", name: "GitHub" },
    { icon: <FaVimeoV />, color: "#1AB7EA", name: "Vimeo" },
    { icon: <SiNetlify />, color: "#00C7B7", name: "Netlify" },
  ];

  const tabIcons = {
    Detail: <BiSolidUserDetail size={20} />,
    Images: <FaRegImage size={20} />,
    Social: <IoShareSocialOutline size={20} />,
    Template: <GrTemplate size={20} />,
    Design: <MdOutlineDashboardCustomize size={20} />,
    Apps: <MdOutlineDraw size={20} />,
  };

  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [designOptions, setDesignOptions] = useState({
    primaryColor: "#000",
    fontFamily: "Poppins",
    fontSize: 14,
    boldName: true,
    includeDivider: true,
  });
  const [apps, setApps] = useState({
    disclaimer: "",
    bannerUrl: "",
    videoUrl: "",
    customButton: { text: "", url: "" },
  });

  const templates = [
    { id: "default", name: "Default", layout: "horizontal" },
    { id: "modern", name: "Modern", layout: "vertical" },
    { id: "minimal", name: "Minimal", layout: "compact" },
    { id: "video", name: "Video", layout: "horizontal-with-video" },
  ];

  const handleAddField = (field) => {
    setExtraFields([...extraFields, field]);
    setAvailableFields(availableFields.filter((f) => f !== field));
    setShowOptions(false);
  };

  const handleRemoveField = (index) => {
    const fieldToRemove = extraFields[index];
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setExtraFields(extraFields.filter((_, i) => i !== index));
        setAvailableFields([...availableFields, fieldToRemove]);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleCustomFieldSubmit = () => {
    if (customFieldLabel.trim()) {
      setExtraFields([...extraFields, customFieldLabel]);
      setCustomFieldLabel("");
      onClose();
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setModalIsOpen(true);
        setCroppedArea(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
      setFileInputVisible(false);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (croppedArea) {
      const croppedImage = await getCroppedImg(imageSrc, croppedArea);
      setSignaturePreviewUrl(croppedImage);
      setModalIsOpen(false);
    }
  };

  const handleSignatureClick = () => {
    if (signatureFileInputRef.current) {
      signatureFileInputRef.current.value = null;
      signatureFileInputRef.current.click();
    }
  };

  const handleDeleteSignature = () => {
    if (signaturePreviewUrl) {
      URL.revokeObjectURL(signaturePreviewUrl);
    }
    setSignaturePreviewUrl(null);
    setFileInputVisible(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Image selected:", file);
    }
  };

  const handleIconClick = (iconData) => {
    setSelectedIcons((prev) => [...prev, { ...iconData, inputValue: "" }]);
  };

  const handleInputChange = (index, e) => {
    const updatedIcons = selectedIcons.map((item, idx) =>
      idx === index ? { ...item, inputValue: e.target.value } : item
    );
    setSelectedIcons(updatedIcons);
  };

  const handleIconRemove = (index) => {
    const deleteIcon = selectedIcons.filter((_, ind) => ind !== index);
    setSelectedIcons(deleteIcon);
  };

  const handleDesignChange = (key, value) => {
    setDesignOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleAppChange = (key, value) => {
    setApps((prev) => ({ ...prev, [key]: value }));
  };

  const handleCustomButtonChange = (field, value) => {
    setApps((prev) => ({
      ...prev,
      customButton: { ...prev.customButton, [field]: value },
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setApps((prev) => ({ ...prev, bannerUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPreview = () => {
    const style = {
      fontFamily: designOptions.fontFamily,
      fontSize: `${designOptions.fontSize}px`,
      color: designOptions.primaryColor,
      textAlign: selectedTemplate === "modern" ? "center" : "left",
    };

    const nameStyle = designOptions.boldName ? { fontWeight: "bold" } : {};

    let layoutClass = "";
    switch (selectedTemplate) {
      case "modern":
        layoutClass = "d-flex flex-column align-items-center text-center gap-2";
        break;
      case "minimal":
        layoutClass = "d-flex justify-content-between gap-2";
        break;
      case "video":
        layoutClass = "d-flex gap-3 flex-row ";
        break;
      default:
        layoutClass = "d-flex gap-3 align-items-start";
    }

    return (
      <div className={`card carddiv`} style={style}>
        <div className={`card-content ${layoutClass} `} style={{ width: "100%" }}>
          {signaturePreviewUrl && (
            <div className={selectedTemplate === "modern" ? "mb-3" : "col-md-3"} style={{ textAlign: selectedTemplate === "modern" ? "center" : "left" }}>
              <img
                src={signaturePreviewUrl}
                alt="Signature Preview"
                className="img-fluid"
                style={{
                  borderRadius: imageShape === "circle" ? "50%" : "0",
                  height: "150px",
                  width: "150px",
                  margin: selectedTemplate === "modern" ? "0 auto" : "0",
                }}
              />
            </div>
          )}
          <div className={`${selectedTemplate === "modern" ? "" : "col-md-8"} my-auto`} style={{ width: selectedTemplate === "modern" ? "100%" : "auto" }}>
            <h3 className="mb-2" style={{ ...nameStyle, textAlign: selectedTemplate === "modern" ? "center" : "left" }}>
              {formData.name}
            </h3>
            <h5 className="mb-2" style={{ textAlign: selectedTemplate === "modern" ? "center" : "left" }}>
              {formData.designation}
            </h5>
            <div
              className={selectedTemplate === "modern" ? "d-flex flex-column align-items-center gap-1" : "d-flex gap-2"}
            >
              <h6>
                {formData.company !== "" ? `${formData.company}, ` : formData.company}
                {formData.selected && (
                  <span className="writenBy">{formData.selected}</span>
                )}
              </h6>
            </div>
            <div
              className={selectedTemplate === "modern" ? "d-flex flex-column align-items-center gap-1" : "grid"}
            >
              {extraFields.map((field, index) => (
                <div key={index} className={selectedTemplate === "modern" ? "d-flex align-items-center gap-2" : "grid-item"}>
                  {designOptions.includeDivider && index !== 0 && <span className="divider">|</span>}
                  <span>{formData[field] || field}</span>
                </div>
              ))}
            </div>
            <div
              className={`social-icons d-flex ${selectedTemplate === "modern" ? "justify-content-center" : "gap-2"} mt-2`}
            >
              {selectedIcons.map((icon, idx) => (
                <a key={idx} href={icon.inputValue} target="_blank" rel="noopener noreferrer">
                  <div style={{ backgroundColor: icon.color }} className="social-icon">
                    {icon.icon}
                  </div>
                </a>
              ))}
            </div>
            {apps.bannerUrl && (
              <img
                src={apps.bannerUrl}
                alt="Banner"
                className="mt-2"
                style={{
                  maxWidth: selectedTemplate === "modern" ? "100%" : "100%",
                  margin: selectedTemplate === "modern" ? "0 auto" : "0",
                }}
              />
            )}
            {apps.videoUrl && (
              <iframe
                src={apps.videoUrl}
                title="Video"
                className="mt-2"
                style={{
                  width: selectedTemplate === "modern" ? "100%" : "100%",
                  maxWidth: selectedTemplate === "modern" ? "400px" : "100%",
                  height: "200px",
                  margin: selectedTemplate === "modern" ? "0 auto" : "0",
                }}
              />
            )}
            {apps.customButton.text && (
              <div style={{ textAlign: selectedTemplate === "modern" ? "center" : "left" }}>
                <a href={apps.customButton.url} target="_blank" rel="noopener noreferrer">
                  <Button colorScheme="blue" className="mt-2">
                    {apps.customButton.text}
                  </Button>
                </a>
              </div>
            )}
            {apps.disclaimer && (
              <Text
                fontSize="sm"
                color="gray"
                className="mt-2"
                style={{ textAlign: selectedTemplate === "modern" ? "center" : "left" }}
              >
                {apps.disclaimer}
              </Text>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="signature-main-container d-flex">
      <nav className="sidebar close">
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              {["Detail", "Images", "Social", "Template", "Design", "Apps"].map((tab) => (
                <li
                  key={tab}
                  className={`nav-link ${selectedTab === tab ? "active" : ""}`}
                  onClick={() => setSelectedTab(tab)}
                >
                  <a>
                    <span className="icon">{tabIcons[tab]}</span>
                    <span className="text nav-text">{tab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <nav className="sidebar1 close">
        <div className="menu-bar">
          {selectedTab === "Detail" && (
            <>
              <h5>Signature Details</h5>
              <form className={styles.form} action="" method="post">
                <div className={styles.inputContainer}>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    id="name"
                    label="Name"
                    variant="outlined"
                    className={styles.textField}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <div className="iconContainer pe-4"></div>
                </div>
                <div className={styles.inputContainer}>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    id="designation"
                    label="Designation"
                    variant="outlined"
                    className={styles.textField}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                  <div className="iconContainer pe-4"></div>
                </div>
                <div className={styles.inputContainer}>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    id="company"
                    label="Company Name"
                    value={formData.company}
                    variant="outlined"
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={styles.textField}
                  />
                  <div className="iconContainer pe-4"></div>
                </div>
                <div className={styles.inputContainer}>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel id="select-label">Select an Option</InputLabel>
                    <Select
                      labelId="select-label"
                      id="select"
                      value={formData.selected}
                      onChange={(e) => setFormData({ ...formData, selected: e.target.value })}
                      label="Select an Option"
                      className={styles.select}
                    >
                      <MenuItem value="">
                        <em>---Select---</em>
                      </MenuItem>
                      <MenuItem value="Director">Director</MenuItem>
                      <MenuItem value="ByOffice">By Office Staff</MenuItem>
                    </Select>
                  </FormControl>
                  <div className="iconContainer pe-4"></div>
                </div>
                {extraFields.map((field, index) => (
                  <div className={styles.inputContainer} key={index}>
                    <TextField
                      fullWidth
                      sx={{ m: 1 }}
                      id={`extra-field-${index}`}
                      label={field}
                      variant="outlined"
                      value={formData[field] || ""}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className={styles.textField}
                    />
                    <div>
                      <Delete className="icon" onClick={() => handleRemoveField(index)} />
                    </div>
                  </div>
                ))}
                <div className={styles.inputContainer}>
                  <p className={styles.addMoreP} onClick={() => setShowOptions(!showOptions)}>
                    Add More Field <RiAddBoxFill size={30} className={styles.addMoreIcon} />
                  </p>
                  {showOptions && (
                    <div className={styles.dropdownContainer}>
                      <div className={styles.crossIconContainer}>
                        <RxCross2
                          size={30}
                          className={styles.crossIcon}
                          onClick={() => setShowOptions(false)}
                        />
                      </div>
                      <div>
                        {availableFields.map((field, index) => (
                          <div
                            key={index}
                            className={styles.dropdownItem}
                            onClick={() => handleAddField(field)}
                          >
                            <p className="my-auto dropdownItem">{field}</p>
                          </div>
                        ))}
                        <div
                          className={styles.dropdownItem}
                          onClick={() => {
                            setShowOptions(false);
                            onOpen();
                          }}
                        >
                          <p className="my-auto dropdownItem fw-bold">Custom</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </>
          )}
          {selectedTab === "Images" && (
            <>
              <h5>Images</h5>
              <div className="mail-signature-upload mt-2">
                <div className="signature-upload-container text-center d-flex my-auto px-3">
                  <div
                    className="signature-preview position-relative"
                    onClick={handleSignatureClick}
                    style={{ cursor: "pointer", width: "250px", height: "150px" }}
                  >
                    <img
                      src={
                        signaturePreviewUrl ||
                        "https://w7.pngwing.com/pngs/945/606/png-transparent-baby-boss-illustration-infant-youtube-animation-sticker-youtube-family-glasses-film.png"
                      }
                      alt="Signature Preview"
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {signaturePreviewUrl && (
                      <div className="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSignature();
                          }}
                        >
                          <BsTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="signatureFile"
                    accept="image/*"
                    name="signatureFile"
                    style={{ display: "none" }}
                    ref={signatureFileInputRef}
                    onChange={handleSignatureChange}
                  />
                </div>
                {modalIsOpen && (
                  <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} size="full" isCentered>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalCloseButton />
                      <ModalBody>
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                          showGrid={false}
                          style={{
                            containerStyle: { height: "100%", width: "100%" },
                            mediaStyle: { objectFit: "contain" },
                          }}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme="blue" onClick={handleCropSave}>
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setModalIsOpen(false)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                )}
              </div>
              <h5 className="mt-5">Select Shape</h5>
              <div className="shape-container d-flex gap-3">
                <div className="text-center">
                  <div
                    className="circle shape my-2 mx-auto"
                    onClick={() => setImageShape("circle")}
                    style={{ borderRadius: "50%" }}
                  ></div>
                  <div className="shapep px-2">
                    <p>Circle</p>
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="rectangle shape my-2 mx-auto"
                    onClick={() => setImageShape("rectangle")}
                  ></div>
                  <div className="shapep px-2">
                    <p>Square</p>
                  </div>
                </div>
              </div>
            </>
          )}
          {selectedTab === "Social" && (
            <>
              <h5>Add Social Media Links</h5>
              <div className="socialMediaLink mt-5">
                {selectedIcons.length > 0 && (
                  <>
                    {selectedIcons.map((iconData, index) => (
                      <div className={styles.inputContainer} key={index}>
                        <div
                          style={{
                            backgroundColor: iconData.color,
                            border: `1px solid ${iconData.color}`,
                            transition: "transform 0.3s ease",
                          }}
                          className="social-icon"
                        >
                          {iconData.icon}
                        </div>
                        <TextField
                          fullWidth
                          sx={{ m: 1 }}
                          id={`${index}${iconData.name}`}
                          label={iconData.name}
                          variant="outlined"
                          value={iconData.inputValue}
                          onChange={(e) => handleInputChange(index, e)}
                          className={styles.textField}
                        />
                        <div>
                          <Delete className="icon" onClick={() => handleIconRemove(index)} />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="allSocialMediaIcon mt-5 px-3" style={{ display: "flex", flexWrap: "wrap" }}>
                {socialMediaIcons.map((iconData, index) => (
                  <Tooltip
                    label={iconData.name}
                    placement="top"
                    bg="black"
                    color="white"
                    key={index}
                    className="px-2 rounded"
                  >
                    <div
                      style={{
                        backgroundColor: iconData.color,
                        border: `1px solid ${iconData.color}`,
                        transition: "transform 0.3s ease",
                      }}
                      className="social-icon"
                      onClick={() => handleIconClick(iconData)}
                    >
                      {iconData.icon}
                    </div>
                  </Tooltip>
                ))}
              </div>
            </>
          )}
          {selectedTab === "Template" && (
            <>
              <h5>Select Template</h5>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} className="mt-5">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    cursor="pointer"
                    border={selectedTemplate === template.id ? "2px solid blue" : "1px solid gray"}
                  >
                    <Card>
                      <p variant="h6">{template.name}</p>
                      <p variant="body2">Layout: {template.layout}</p>
                    </Card>
                  </Card>
                ))}
              </Grid>
            </>
          )}
          {selectedTab === "Design" && (
            <>
              <h5>Design Options</h5>
              <div className={styles.inputContainer}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel id="font-family-label">Font Family</InputLabel>
                  <Select
                    labelId="font-family-label"
                    id="font-family"
                    value={designOptions.fontFamily}
                    onChange={(e) => handleDesignChange("fontFamily", e.target.value)}
                    label="Font Family"
                    className={styles.select}
                  >
                    <MenuItem value="Poppins">Poppins</MenuItem>
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                  </Select>
                </FormControl>
                <div className="iconContainer pe-4"></div>
              </div>
              <div className={styles.inputContainer}>
                <Box sx={{ mx: 3 }} style={{ width: "93%" }}>
                  <p>Font Size: {designOptions.fontSize}px</p>
                  <Slider
                    value={designOptions.fontSize}
                    onChange={(e, val) => handleDesignChange("fontSize", val)}
                    min={10}
                    max={24}
                    step={1}
                  />
                </Box>
              </div>
              <div className={styles.inputContainer}>
                <TextField
                  fullWidth
                  sx={{ m: 1 }}
                  label="Primary Color"
                  type="color"
                  value={designOptions.primaryColor}
                  onChange={(e) => handleDesignChange("primaryColor", e.target.value)}
                />
              </div>
              <div className={styles.inputContainer}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={designOptions.boldName}
                      onChange={(e) => handleDesignChange("boldName", e.target.checked)}
                    />
                  }
                  label="Bold Name"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={designOptions.includeDivider}
                      onChange={(e) => handleDesignChange("includeDivider", e.target.checked)}
                    />
                  }
                  label="Include Dividers"
                />
              </div>
            </>
          )}
          {selectedTab === "Apps" && (
            <>
              <h5>Add Apps & Components</h5>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                label="Disclaimer Text"
                multiline
                rows={3}
                value={apps.disclaimer}
                onChange={(e) => handleAppChange("disclaimer", e.target.value)}
              />
              <Box sx={{ m: 1 }}>
                <FormLabel>Banner Image</FormLabel>
                <Input type="file" accept="image/*" onChange={handleBannerChange} />
                {apps.bannerUrl && <img src={apps.bannerUrl} alt="Banner Preview" className="mt-2 w-50" />}
              </Box>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                label="Video URL (Embed)"
                value={apps.videoUrl}
                onChange={(e) => handleAppChange("videoUrl", e.target.value)}
              />
              <h6>Custom Button</h6>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                label="Button Text"
                value={apps.customButton.text}
                onChange={(e) => handleCustomButtonChange("text", e.target.value)}
              />
              <TextField
                fullWidth
                sx={{ m: 1 }}
                label="Button URL"
                value={apps.customButton.url}
                onChange={(e) => handleCustomButtonChange("url", e.target.value)}
              />
            </>
          )}
        </div>
      </nav>
      <div className="card-conainer text-center">
        <h1 className="my-2">Create Your Own Email Signature</h1>
        {renderPreview()}
      </div>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        preserveScrollBarGap={true}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent className="custom-modal">
          <ModalHeader className="mx-auto mb-2">Add Custom Field</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="custom-label"
                label="Custom Label"
                value={customFieldLabel}
                onChange={(e) => setCustomFieldLabel(e.target.value)}
                variant="outlined"
                className={styles.textField}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-between">
            <Button size="sm" onClick={onClose} className="cancel">
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCustomFieldSubmit} className="okay">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 100;
  canvas.height = 100;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    100,
    100
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
  });
};

const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });
};

export default MailSignature;