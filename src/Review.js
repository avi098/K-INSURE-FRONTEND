import React, { useState } from "react";
import axios from "axios";

const Review = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post("/api/review-pdf", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "K-insure_individual_customer_review.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      if (response.status === 200) {
        setSuccess(
          "The review has been processed, sent via email, and is available for download."
        );
      } else if (response.status === 206) {
        setSuccess(
          "The review has been processed and is available for download, but there was an issue sending the email."
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("An error occurred while processing the file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-200 w-full text-center py-4">
        Document Review
      </h1>
      <div className="flex-grow flex items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="pdf-upload"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Upload Individual Customer View PDF
              </label>
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
              <label
                htmlFor="pdf-upload"
                className="relative cursor-pointer bg-white bg-opacity-20 rounded-md font-medium text-indigo-300 hover:text-indigo-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base leading-6 transition duration-150 ease-in-out"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                {file ? file.name : "Choose a PDF file"}
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              } transition-all duration-200 ease-in-out transform hover:scale-105`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Review Document
                  <svg
                    className="w-5 h-5 ml-2 -mr-1 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div
          className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          className="mt-8 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md"
          role="alert"
        >
          <p className="font-bold">Success</p>
          <p>{success}</p>
        </div>
      )}
    </div>
  );
};

export default Review;
