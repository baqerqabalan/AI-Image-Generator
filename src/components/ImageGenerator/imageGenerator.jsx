import React, { useRef, useState } from "react";
import "./imageGenerator.css";
import default_image from "../assets/defaultImg.jpeg";

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState(default_image);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const imageGenerator = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt === "") {
      setError("Please enter a description.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(prompt)}`,
        {
          headers: {
            Authorization: `${process.env.API_KEY}`,
          },
        }
      );

      const data = await response.json();
      if (data.photos.length > 0) {
        setImageUrl(data.photos[0].src.large);
      } else {
        setError("No images found.");
      }
    } catch (err) {
      setError("Error fetching image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={imageUrl} alt="Generated" />
        </div>
        {loading && (
          <div className="loading">
            <div className="loading-bar-full">
              <div className="loading-text">Loading...</div>
            </div>
          </div>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see..."
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
