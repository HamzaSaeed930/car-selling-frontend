"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FiLogOut } from "react-icons/fi";
import Image from 'next/image';
import { AxiosError } from "axios";


interface ErrorResponse {
  message: string;
}

const Dashboard = () => {
  const [carModel, setCarModel] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [maxPictures, setMaxPictures] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) {
      setMessage("No files selected.");
      return;
    }

    const filesArray = Array.from(selectedFiles);
    if (filesArray.length > maxPictures) {
      setMessage(`You can only upload up to ${maxPictures} images.`);
      return;
    }

    setImages(filesArray);
    const previews = filesArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("carModel", carModel);
    formData.append("price", price);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("maxPictures", maxPictures.toString());
    images.forEach((image) => formData.append("images", image));

    try {
      await axios.post(
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
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setMessage(axiosError.response?.data.message || "An error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
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
          <FiLogOut className="h-5 w-5" />
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
              onChange={(e) => {
                const value = Number(e.target.value);
                setMaxPictures(Math.min(Math.max(value, 1), 10));
              }}
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
              <Image
                key={index}
                src={src}
                alt={`Preview ${index + 1}`}
                width={100}
                height={100}
              />
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