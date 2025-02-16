import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

import axios, { AxiosError } from "axios";
import {
  FileCheck,
  Upload,
  ClipboardList,
  Dumbbell,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

export function HealthDashboard() {
  const [files, setFiles] = useState<File[]>([]);
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
  //Lifestyle
  const [lifestyle, setLifestyle] = useState({
    exercise: 0,
    smoking: 0,
    drinking: 0,
    bmi: "Normal",
    jobHazard: 0,
    mentalStress: 0,
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [response, setResponse] = useState<{ weightedAverage: number } | null>(
    null,
  );

  const sendDataToAPI = async () => {
    try {
      const { bmi, ...numericValues } = lifestyle; // Exclude 'bmi' from API request
      const res = await axios.post<{ weightedAverage: number }>(
        "http://localhost:5001/lifestyle",
        numericValues,
      );

      setResponse(res.data);
      setApiError(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setApiError(err.response?.data.message || "Server Error");
    }
  };
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
  //Upload Docs
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
    if (!e.target.files || e.target.files.length === 0) return;

    setError(null);
    const file = e.target.files[0];
    //Lab Reports
    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PDF, DOCX, JPG, or PNG files");
      return;
    }

    setFiles([file]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8002/extract/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Upload-Type": "reupload",
          },
        },
      );

      if (response.data) {
        setExtractedText(JSON.stringify(response.data, null, 2)); // Display extracted values as JSON
      } else {
        setError("No response received from the server.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to process the re-uploaded file");
      }
    }
  };

  const handleChange = (key: string, value: string) => {
    setManualEntry((prev) => ({
      ...prev,
      [key]: value === "" ? "" : parseFloat(value) || "",
    }));
  };
  //Manual Entry
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
              Supported formats: PDF, DOCX, JPG, PNG
            </p>
            <label className="bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.jpg,.png"
                onChange={handleReupload}
              />
            </label>
          </div>

          {/* Display Extracted Data */}
          {extractedText && (
            <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Extracted Medical Values
              </h3>

              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">
                      Test Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    JSON.parse(extractedText)?.extracted_values || {},
                  ).map(([key, value]) => (
                    <tr key={key} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {key}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Display Predicted Disease in an Alert Manner */}
              {JSON.parse(extractedText)?.model_prediction
                ?.disease_prediction && (
                <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-lg shadow-md flex items-center animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      ⚠️ Possible Disease Detected
                    </h3>
                    <p className="text-xl font-bold">
                      {
                        JSON.parse(extractedText)?.model_prediction
                          ?.disease_prediction
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Display Error if any */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-lg shadow-md flex items-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <p className="font-semibold">{error}</p>
            </div>
          )}
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
            className="mt-6 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {responseMessage && (
            <Alert className="mt-6 bg-gray-50 border-l-4 border-red-500 shadow-md">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <AlertTitle className="text-red-600">
                Predicted Disease
              </AlertTitle>
              <AlertDescription className="text-gray-800">
                {responseMessage}
              </AlertDescription>
            </Alert>
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

          <button
            onClick={sendDataToAPI}
            className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Submit
          </button>

          {/* Response Message */}
          {response && (
            <div className="mt-4 bg-green-100 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900">Result</h3>
              <p className="text-green-700">
                Weighted Average: {response.weightedAverage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {apiError && (
            <div className="mt-4 bg-red-100 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900">Error</h3>
              <p className="text-red-700">{apiError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
