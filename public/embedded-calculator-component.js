"use client"

import React from "react"

const { useState } = React

function TariffCalculator() {
  const [formData, setFormData] = useState({
    htsCode: "",
    country: "",
    dutyRate: "",
    numPOs: "",
    numUnits: "",
    unitCost: "",
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to calculate duty rate")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return React.createElement(
    "div",
    { className: "embedded-calculator" },
    React.createElement("h2", null, "Tariff Calculator"),
    React.createElement(
      "form",
      { onSubmit: handleSubmit },
      React.createElement(
        "div",
        null,
        React.createElement("label", { htmlFor: "htsCode" }, "HTS Code:"),
        React.createElement("input", {
          type: "text",
          id: "htsCode",
          name: "htsCode",
          value: formData.htsCode,
          onChange: handleChange,
          required: true,
        }),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { htmlFor: "country" }, "Country of Origin:"),
        React.createElement("input", {
          type: "text",
          id: "country",
          name: "country",
          value: formData.country,
          onChange: handleChange,
          required: true,
        }),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { htmlFor: "numPOs" }, "Number of POs (per Year):"),
        React.createElement("input", {
          type: "number",
          id: "numPOs",
          name: "numPOs",
          value: formData.numPOs,
          onChange: handleChange,
          required: true,
        }),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { htmlFor: "numUnits" }, "Number of Units (per PO):"),
        React.createElement("input", {
          type: "number",
          id: "numUnits",
          name: "numUnits",
          value: formData.numUnits,
          onChange: handleChange,
          required: true,
        }),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { htmlFor: "unitCost" }, "Unit Cost (USD):"),
        React.createElement("input", {
          type: "number",
          id: "unitCost",
          name: "unitCost",
          value: formData.unitCost,
          onChange: handleChange,
          required: true,
          step: "0.01",
        }),
      ),
      React.createElement("button", { type: "submit" }, "Calculate"),
    ),
    result &&
      React.createElement(
        "div",
        { className: "result" },
        React.createElement("p", null, `Duty Rate: ${result.dutyRate}`),
        React.createElement("p", null, `Estimated Duty: $${result.estimatedDuty}`),
      ),
    error && React.createElement("div", { className: "error" }, error),
  )
}

