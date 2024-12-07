"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FaFacebook } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Dashboard = () => {
  const [carModel, setCarModel] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [maxPictures, setMaxPictures] = useState(1);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > maxPictures) {
      setMessage(`You can only upload up to ${maxPictures} images.`);
      return;
    }
    setImages(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("carModel", carModel);
    formData.append("price", price);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("maxPictures", maxPictures);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/createCarForm",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Vehicle entry submitted successfully!");
      setCarModel("");
      setPrice("");
      setPhone("");
      setCity("Lahore");
      setMaxPictures(1);
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <div className="vehicle-form-container">
      <div className="logout-icon" onClick={handleLogout}>
        <Button>
          {" "}
          <FiLogOut className="h-5 w-5" />
          <i className="fas fa-sign-out-alt"></i>
        </Button>
      </div>

      <div className="vehicle-form">
        <h1>Submit Vehicle Information</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="carModel">Car Model</label>
            <input
              type="text"
              id="carModel"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              minLength={3}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="\d{11}"
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <div className="radio-group">
              <label className="radio">
                <input
                  type="radio"
                  name="city"
                  value="Lahore"
                  checked={city === "Lahore"}
                  onChange={(e) => setCity(e.target.value)}
                />
                Lahore
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="city"
                  value="Karachi"
                  checked={city === "Karachi"}
                  onChange={(e) => setCity(e.target.value)}
                />
                Karachi
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="maxPictures">Max Pictures</label>
            <input
              type="number"
              id="maxPictures"
              value={maxPictures}
              onChange={(e) =>
                setMaxPictures(Math.min(Math.max(e.target.value, 1), 10))
              }
              min={1}
              max={10}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className="image-previews">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index + 1}`} />
            ))}
          </div>

          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};
export default Dashboard;
