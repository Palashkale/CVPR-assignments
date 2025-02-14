import React from "react";
import {
  Plus,
  DollarSign,
  Users,
  Shield,
  Activity,
  Cigarette,
  Beer,
  Scale,
  Briefcase,
  Brain,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Insurance Admin Dashboard
        </h1>

        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            {["overview", "insurances", "add", "lifestyle"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className={`
                  ${activeTab === tab ? "bg-purple-600 text-white" : "text-gray-700"}
                  hover:bg-purple-600 hover:text-white
                  ${tab === "overview" ? "rounded-l-md" : ""}
                  ${tab === "lifestyle" ? "rounded-r-md" : ""}
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Total Revenue", icon: DollarSign, value: "$1,235,000" },
              { title: "Total Customers", icon: Users, value: "12,345" },
              { title: "Active Policies", icon: Shield, value: "8,765" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:shadow-lg"
              >
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "insurances" && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-900">
                    Insurance Name
                  </TableHead>
                  <TableHead className="text-gray-900">Type</TableHead>
                  <TableHead className="text-gray-900">Premium</TableHead>
                  <TableHead className="text-gray-900">Coverage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "Basic Health Plan",
                    type: "Health",
                    premium: "$199/month",
                    coverage: "$100,000",
                  },
                  {
                    name: "Premium Life Insurance",
                    type: "Life",
                    premium: "$89/month",
                    coverage: "$500,000",
                  },
                  {
                    name: "Family Dental Plan",
                    type: "Dental",
                    premium: "$79/month",
                    coverage: "$10,000",
                  },
                ].map((plan) => (
                  <TableRow key={plan.name} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.type}</TableCell>
                    <TableCell>{plan.premium}</TableCell>
                    <TableCell>{plan.coverage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === "add" && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Add New Insurance Plan
            </h2>
            <form className="space-y-6">
              {/* Mapping over the new fields */}
              {[
                {
                  name: "enlist_disease",
                  label: "Enlist Disease",
                  type: "select",
                  options: ["Disease 1", "Disease 2", "Disease 3"],
                },
                {
                  name: "pred_disease",
                  label: "Predicted Disease",
                  type: "select",
                  options: ["Disease 1", "Disease 2", "Disease 3"],
                },
                {
                  name: "budget",
                  label: "Budget",
                  type: "number",
                  placeholder: "Enter budget amount",
                },
                {
                  name: "addon",
                  label: "Addon",
                  type: "select",
                  options: ["Addon 1", "Addon 2", "Addon 3"],
                },
                {
                  name: "health_score",
                  label: "Health Score",
                  type: "number",
                  placeholder: "Enter health score",
                },
                {
                  name: "rank_score",
                  label: "Rank Score",
                  type: "number",
                  placeholder: "Enter rank score",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      className="mt-1 block w-full border-gray-300 rounded-md"
                    >
                      {field.options?.map((option) => (
                        <option
                          key={option}
                          value={option.toLowerCase().replace(/\s+/g, "_")}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      type={field.type}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Insurance Plan
              </Button>
            </form>
          </div>
        )}

        {activeTab === "lifestyle" && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Lifestyle Factors
            </h2>
            <p className="text-gray-600 mb-6">
              Set the percentage impact of lifestyle factors on insurance
              premiums
            </p>
            <div className="space-y-6">
              {[
                { name: "Exercise", icon: Activity },
                { name: "Smoking", icon: Cigarette },
                { name: "Drinking", icon: Beer },
                { name: "BMI", icon: Scale },
                { name: "Job Hazard", icon: Briefcase },
                { name: "Mental Stress", icon: Brain },
              ].map((factor) => (
                <div key={factor.name} className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <factor.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-grow">
                    <label
                      htmlFor={factor.name}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {factor.name}
                    </label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        id={factor.name}
                        min="0"
                        max="100"
                        placeholder="Enter percentage"
                        className="w-full"
                      />
                      <span className="ml-2 text-gray-600">%</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6">
                Save Lifestyle Factors
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
