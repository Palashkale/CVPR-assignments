import React, { useState } from "react";
import axios from "axios";
import { FileCheck, Upload, ClipboardList, Dumbbell } from "lucide-react";

export function HealthDashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [showLifestyle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [extractedText, setExtractedText] = useState<string>("");
  const [matchedKeyword, setMatchedKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");

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
    bloodGlucose: "",
    HBA1C: "",
    systolicBp: "",
    DiastolicBP: "",
    LDL: "",
    HDL: "",
    Triglycerides: "",
    Haemoglobin: "",
    MuscularCorpusValue: "",
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
          "http://localhost:8001/upload/",
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

  const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setError(null);
      const file = e.target.files[0];

      if (
        ![
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        setError(() => "Please upload only PDF or DOCX files");
        return;
      }

      setFiles([file]);
      const formData = new FormData();
      formData.append("file", file as Blob);

      try {
        const response = await axios.post(
          "http://localhost:8001/reupload/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-Upload-Type": "reupload",
            },
          },
        );

        setExtractedText(response.data.extracted_text || "");
        setMatchedKeyword(response.data.matched_keyword || "");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Failed to process re-uploaded file");
        }
      }
    }
  };

  const handleChange = (key: string, value: string) => {
    setManualEntry((prev) => ({
      ...prev,
      [key]: value === "" ? "" : parseFloat(value) || "",
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMessage("");
    try {
      const requestData = Object.fromEntries(
        Object.entries(manualEntry).map(([key, value]) => [
          key,
          parseFloat(value as string) || 0,
        ]),
      );
      const response = await axios.post(
        "http://localhost:8000/predict",
        requestData,
      );
      setResponseMessage(`Prediction: ${response.data.prediction}`);
    } catch (error) {
      setResponseMessage("Error submitting data. Please try again.");
    } finally {
      setLoading(false);
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
          { label: "Upload Docs", value: "upload", icon: Upload },
          { label: "Lab-Reports", value: "reupload", icon: FileCheck },
          { label: "Manual Entry", value: "manual", icon: ClipboardList },
          { label: "Lifestyle", value: "lifestyle", icon: Dumbbell },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === tab.value
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conditional Rendering Based on Active Tab */}
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

      {activeTab === "reupload" && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileCheck className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <p className="text-gray-600 mb-2">
              Re-upload your medical documents
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

      {/* Manual Entry Section (Visible Only When Active) */}
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
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {responseMessage && (
            <div className="mt-4 text-center text-sm text-gray-700">
              {responseMessage}
            </div>
          )}
        </div>
      )}

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
