import React, { useState } from "react";
import axios from "axios";
import { FileCheck, Upload } from "lucide-react";

export function HealthDashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [extractedText, setExtractedText] = useState<string>("");
  const [matchedKeyword, setMatchedKeyword] = useState<string>("");

  const frequencyOptions = [
    { value: 0, label: "Never" },
    { value: 1, label: "Rarely" },
    { value: 2, label: "Occasionally" },
    { value: 3, label: "Frequently" },
    { value: 4, label: "Very Frequently" },
    { value: 5, label: "Always" },
  ];

  const [lifestyle, setLifestyle] = useState({
    exercise: 0,
    smoking: 0,
    drinking: 0,
    bmi: "Normal",
    jobHazard: 0,
    mentalStress: 0,
  });

  const [manualEntry, setManualEntry] = useState({
    testName: "",
    testDate: "",
    resultValue: "",
    referenceRange: "",
    doctorNotes: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setError(null);
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

        if (response.data.extracted_text) {
          setExtractedText(response.data.extracted_text);
        }
        if (response.data.matched_keyword) {
          setMatchedKeyword(response.data.matched_keyword);
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        setError(err.response?.data?.detail || "Failed to process file");
      }
    }
  };

  const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setError(null);
      const uploadedFiles = Array.from(e.target.files);

      // Validate file type
      const file = uploadedFiles[0];
      const fileType = file.type;
      if (
        ![
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(fileType)
      ) {
        setError("Please upload only PDF or DOCX files");
        return;
      }

      setFiles(uploadedFiles);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://localhost:8000/reupload/", // Different endpoint for re-upload
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-Upload-Type": "reupload", // Custom header to identify re-upload
            },
          },
        );

        if (response.data.extracted_text) {
          setExtractedText(response.data.extracted_text);
        }
        if (response.data.matched_keyword) {
          setMatchedKeyword(response.data.matched_keyword);
        }
      } catch (err: any) {
        console.error("Re-upload error:", err);
        setError(
          err.response?.data?.detail || "Failed to process re-uploaded file",
        );
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
        {[
          { label: "Upload Docs", value: "upload" },
          { label: "Lab-Reports", value: "reupload" },
          { label: "Manual Entry", value: "manual" },
          { label: "Lifestyle", value: "lifestyle" },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === tab.value
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload Section */}
      {activeTab === "upload" && (
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
        </div>
      )}

      {/* Re-Upload Section */}
      {activeTab === "reupload" && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileCheck className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <p className="text-gray-600 mb-2">
              Re-upload your medical documents here
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Supported formats: PDF, DOCX only
            </p>
            <label className="bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleReupload}
              />
            </label>
          </div>
        </div>
      )}

      {/* Display Uploaded Files */}
      {files.length > 0 &&
        (activeTab === "upload" || activeTab === "reupload") && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h3 className="text-lg font-semibold">Uploaded File:</h3>
            <p className="text-gray-700">{files[0].name}</p>
          </div>
        )}

      {/* Display Extracted Text */}
      {extractedText && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Extracted Text:</h3>
          <p className="text-gray-700">{extractedText}</p>
        </div>
      )}

      {/* Display Matched Keyword */}
      {matchedKeyword && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Matched Keyword:</h3>
          <p className="text-gray-700">{matchedKeyword}</p>
        </div>
      )}

      {/* Manual Entry Section */}
      {activeTab === "manual" && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {Object.entries(manualEntry).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type={key === "testDate" ? "date" : "text"}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={value}
                  onChange={(e) =>
                    setManualEntry((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Section */}
      {activeTab === "lifestyle" && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {Object.entries(lifestyle).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                {key === "bmi" ? (
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={value}
                    onChange={(e) =>
                      setLifestyle((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={value}
                    onChange={(e) =>
                      setLifestyle((prev) => ({
                        ...prev,
                        [key]: parseInt(e.target.value),
                      }))
                    }
                  >
                    {frequencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
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
