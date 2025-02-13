import React, { useState } from "react";
import axios from "axios";
import { FileCheck, Upload } from "lucide-react";

export function HealthDashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showLifestyle, setShowLifestyle] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [matchedKeyword, setMatchedKeyword] = useState<string>("");
  const [lifestyle, setLifestyle] = useState({
    exercise: "Regular",
    smoking: "Never",
    bmi: "Normal",
    jobHazard: "Low",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setError(null); // Reset error state
      const uploadedFiles = Array.from(e.target.files);
      setFiles(uploadedFiles);

      const formData = new FormData();
      formData.append("file", uploadedFiles[0]);

      try {
        const response = await axios.post(
          "http://localhost:8000/upload/",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        setExtractedText(response.data.extracted_text);
        setMatchedKeyword(response.data.matched_keyword);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to process file");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Health Profile Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Upload your medical reports for analysis
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            showLifestyle
              ? "bg-gray-200 text-gray-900"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
          onClick={() => setShowLifestyle(false)}
        >
          Upload Docs
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            showLifestyle
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-900"
          }`}
          onClick={() => setShowLifestyle(true)}
        >
          Lifestyle
        </button>
      </div>

      {/* Upload Section */}
      {!showLifestyle && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your medical reports here
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Supported formats: PDF, JPG, PNG
            </p>
            <label className="bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Uploaded File Display */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Uploaded File
              </h4>
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FileCheck className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-gray-700">{files[0].name}</span>
              </div>
            </div>
          )}

          {/* Extracted Text Display */}
          {extractedText && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800">
                Extracted Text
              </h4>
              <p className="text-gray-700">{extractedText}</p>
              <h4 className="text-lg font-semibold text-gray-800 mt-4">
                Matched Keyword
              </h4>
              <p className="text-gray-700">{matchedKeyword}</p>
            </div>
          )}
        </div>
      )}

      {/* Lifestyle Section */}
      {showLifestyle && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Lifestyle Recommendations
          </h2>
          <p className="text-gray-600 mt-2">
            Get personalized lifestyle tips based on your health reports.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(lifestyle).map(([key, value]) => (
              <div key={key} className="text-left">
                <label className="block text-gray-800 font-semibold mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={value}
                  onChange={(e) =>
                    setLifestyle({ ...lifestyle, [key]: e.target.value })
                  }
                >
                  {[
                    "Always",
                    "Frequently",
                    "Regular",
                    "Occasionally",
                    "Rarely",
                    "Never",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-100 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
