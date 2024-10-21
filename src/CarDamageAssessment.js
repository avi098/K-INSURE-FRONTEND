"use client";

import React, { useState } from "react";
import axios from "axios";
import { CloudUpload, FileSearch, ChevronDown, Download } from "lucide-react";
import { Button } from "./Button.js";
import { Input } from "./Input.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion.js";
import { Badge } from "./Badge.js";
import { Card, CardContent, CardHeader, CardTitle } from "./Card.js";
import { Label } from "./Label.js";

export default function CarDamageAssessment() {
  const [file, setFile] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState({
    category: "mid_range",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleInputChange = (e) => {
    setVehicleInfo({ ...vehicleInfo, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSelectChange = (name, value) => {
    setVehicleInfo({ ...vehicleInfo, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("vehicle_category", vehicleInfo.category);
    formData.append("vehicle_make", vehicleInfo.make);
    formData.append("vehicle_model", vehicleInfo.model);
    formData.append("vehicle_year", vehicleInfo.year);

    try {
      const response = await axios.post("/api/assess-damage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
      setActiveStep(2);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.error ||
          "An error occurred while processing the image."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post(
        "/api/generate-pdf",
        { report: result.report },
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "damage_assessment_report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("An error occurred while downloading the PDF.");
    }
  };

  const renderForm = () => (
    <Card className="mb-6 bg-black text-white">
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">
                Vehicle Category
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("category", value)}
                defaultValue={vehicleInfo.category}
              >
                <SelectTrigger id="category" className="bg-gray-800 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="mid_range">Mid-range</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="premium_luxury">Premium Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="make" className="text-white">
                Vehicle Make
              </Label>
              <Input
                id="make"
                name="make"
                value={vehicleInfo.make}
                onChange={handleInputChange}
                required
                className="bg-gray-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-white">
                Vehicle Model
              </Label>
              <Input
                id="model"
                name="model"
                value={vehicleInfo.model}
                onChange={handleInputChange}
                required
                className="bg-gray-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-white">
                Vehicle Year
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={vehicleInfo.year}
                onChange={handleInputChange}
                required
                className="bg-gray-800 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">
              Upload Image
            </Label>
            <Input
              id="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="bg-gray-800 text-white"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <FileSearch className="mr-2 h-4 w-4 animate-spin" />
                Assessing...
              </>
            ) : (
              <>
                <CloudUpload className="mr-2 h-4 w-4" />
                Assess Damage
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderResult = () => (
    <div className="space-y-6">
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle className="text-center">
            Damage Assessment Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <img
              src={`data:image/jpeg;base64,${result.image_data}`}
              alt="Vehicle with damage assessment overlay"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>

          <Button
            onClick={handleDownloadPDF}
            className="mb-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="damage-summary" className="border-white">
              <AccordionTrigger className="text-white">
                Damage Summary
                <ChevronDown className="h-4 w-4 ml-2" />
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Damage Type</TableHead>
                      <TableHead className="text-white">Severity</TableHead>
                      <TableHead className="text-white">Confidence</TableHead>
                      <TableHead className="text-white">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.report.damage_summary.map((damage, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-white">
                          {damage.damage_type}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              damage.severity === "large"
                                ? "destructive"
                                : damage.severity === "medium"
                                ? "warning"
                                : "success"
                            }
                          >
                            {damage.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {(damage.confidence * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-white">
                          ₹{damage.costs.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cost-breakdown" className="border-white">
              <AccordionTrigger className="text-white">
                Cost Breakdown
                <ChevronDown className="h-4 w-4 ml-2" />
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableBody>
                    {Object.entries(result.report.cost_breakdown).map(
                      ([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium text-white">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </TableCell>
                          <TableCell className="text-white">
                            ₹{value.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="additional-info" className="border-white">
              <AccordionTrigger className="text-white">
                Additional Information
                <ChevronDown className="h-4 w-4 ml-2" />
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-white">
                  Estimated Repair Time: {result.report.repair_time_estimate}{" "}
                  days
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recommendations" className="border-white">
              <AccordionTrigger className="text-white">
                Recommendations
                <ChevronDown className="h-4 w-4 ml-2" />
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 text-white">
                  {result.report.recommendations.map(
                    (recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    )
                  )}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="additional-notes" className="border-white">
              <AccordionTrigger className="text-white">
                Additional Notes
                <ChevronDown className="h-4 w-4 ml-2" />
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 text-white">
                  {result.report.additional_notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <h1 className="text-4xl md:text-5xl font-bold text-center py-4 text-white">
        Car Damage Assessment
      </h1>
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="bg-black p-6 rounded-lg mb-8">
          {activeStep === 2 ? renderResult() : renderForm()}
        </div>
      </div>
    </div>
  );
}
