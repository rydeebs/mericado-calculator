"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { classifyProduct, calculateDutyRate, testOpenAIConnection } from "@/lib/chatgpt"

const TOP_COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

const Index = () => {
  const [formData, setFormData] = useState({
    htsCode: "",
    country: "",
    dutyRate: "",
    numPOs: "",
    numUnits: "",
    unitCost: "",
    freightCost: 0,
  })
  const [classifyLoading, setClassifyLoading] = useState(false)
  const [dutyRateLoading, setDutyRateLoading] = useState(false)
  const [error, setError] = useState("")
  const [showClassifyInput, setShowClassifyInput] = useState(false)
  const [productDescription, setProductDescription] = useState("")
  const [classificationResult, setClassificationResult] = useState("")
  const [isOpenAIKeySet, setIsOpenAIKeySet] = useState(true)
  const [dutyRateResult, setDutyRateResult] = useState("")

  useEffect(() => {
    const checkOpenAIKey = async () => {
      try {
        console.log("Checking OpenAI API key...")
        const isConnected = await testOpenAIConnection()
        setIsOpenAIKeySet(isConnected)
        if (isConnected) {
          console.log("OpenAI API key is valid and working")
          setError("")
        } else {
          throw new Error("OpenAI connection test failed")
        }
      } catch (error) {
        console.error("Error checking OpenAI API key:", error)
        setIsOpenAIKeySet(false)
        if (error instanceof Error) {
          setError(`OpenAI API key error: ${error.message}`)
          console.error("Error stack:", error.stack)
        } else {
          setError(`An unexpected error occurred while checking the OpenAI API key: ${String(error)}`)
        }
      }
    }
    checkOpenAIKey()
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const calculateFreightCost = () => {
    const unitsPerYear = Number(formData.numPOs) * Number(formData.numUnits)
    const unitCost = Number(formData.unitCost) || 0
    return (unitsPerYear * unitCost * 0.1).toFixed(2)
  }

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      freightCost: value[0],
    }))
  }

  const handleHelpClassify = () => {
    if (!formData.country) {
      setError("Please select a Country of Origin before classifying the product.")
      return
    }
    setShowClassifyInput(true)
  }

  const handleSubmitClassification = async () => {
    if (!productDescription.trim()) {
      setError("Please provide a product description.")
      return
    }

    setClassifyLoading(true)
    setError("")
    try {
      const htsCode = await classifyProduct(productDescription, formData.country)
      if (!htsCode || !/^\d{10}$/.test(htsCode)) {
        throw new Error("Invalid HTS code received")
      }
      setFormData((prev) => ({ ...prev, htsCode }))
      setClassificationResult(`HTS Code: ${htsCode}`)
      setShowClassifyInput(false)
      setProductDescription("")
    } catch (err) {
      console.error("Error in handleSubmitClassification:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred during classification.")
    } finally {
      setClassifyLoading(false)
    }
  }

  const handleCalculateDutyRate = async () => {
    if (!formData.htsCode || !formData.country) {
      setError("Please provide both HTS Code and Country of Origin before calculating duty rate.")
      return
    }
    setDutyRateLoading(true)
    setError("")
    try {
      const dutyRateResponse = await calculateDutyRate(formData.htsCode, formData.country)
      if (typeof dutyRateResponse === "string" && dutyRateResponse.includes("%")) {
        const dutyRate = dutyRateResponse.replace("%", "")
        setFormData((prev) => ({ ...prev, dutyRate }))
        setDutyRateResult(`Duty Rate: ${dutyRateResponse}`)
      } else {
        throw new Error("Invalid duty rate response")
      }
    } catch (err) {
      console.error("Error in handleCalculateDutyRate:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred while calculating the duty rate.")
    } finally {
      setDutyRateLoading(false)
    }
  }

  const maxValue = 12000
  const step = 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-white/50 backdrop-blur-sm animate-fade-up shadow-xl rounded-xl border-gray-200/50">
          {!isOpenAIKeySet && (
            <Alert variant="warning" className="mb-4">
              <AlertDescription>
                {error ||
                  "OpenAI API key is not set or invalid. Some features are unavailable. Please check your .env.local file and ensure the OPENAI_API_KEY is set correctly."}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Product Information */}
            <div className="space-y-4 p-4 bg-white/80 rounded-lg">
              <h2 className="text-lg font-semibold text-primary mb-6 font-mono">Product Information</h2>
              <div className="space-y-2">
                <Label htmlFor="country" className="font-mono">
                  Country of Origin (COO)
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                  <SelectTrigger id="country" className="w-full font-mono">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="font-mono max-h-[200px] overflow-y-auto">
                    {TOP_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country.toLowerCase()}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hts-code" className="font-mono">
                  HTS Code <span className="text-xs text-gray-500">(10 digit code)</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="hts-code"
                    placeholder="Enter HTS Code"
                    value={formData.htsCode}
                    onChange={(e) => handleChange("htsCode", e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 font-mono"
                  />
                  <Button
                    onClick={handleHelpClassify}
                    disabled={!formData.country}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Help Classify
                  </Button>
                </div>
                {showClassifyInput && (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      placeholder="Describe your product here..."
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="w-full h-24 font-mono"
                    />
                    <Button
                      onClick={handleSubmitClassification}
                      disabled={classifyLoading || !productDescription.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {classifyLoading ? "Classifying..." : "Submit"}
                    </Button>
                  </div>
                )}
                {classificationResult && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-md">
                    <p className="text-sm font-mono">{classificationResult}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duty-rate" className="font-mono">
                  Duty Rate (%)
                </Label>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Input
                      id="duty-rate"
                      placeholder="Enter Duty Rate"
                      value={formData.dutyRate}
                      onChange={(e) => handleChange("dutyRate", e.target.value)}
                      className="pr-8 font-mono w-full"
                      type="number"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono">%</span>
                  </div>
                  <Button
                    onClick={handleCalculateDutyRate}
                    disabled={dutyRateLoading || !formData.htsCode || !formData.country}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {dutyRateLoading ? "Calculating..." : "Calculate Duty Rate"}
                  </Button>
                </div>
                <p className="mt-4 text-xs italic text-gray-500">
                  Disclaimer: MERiCADO is not a certified customs agent. Please consult a licensed customs broker for
                  official HTS codes and duty rates.
                </p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gray-200 -mx-3"></div>

            {/* Order Information */}
            <div className="space-y-4 p-4 bg-white/80 rounded-lg">
              <h2 className="text-lg font-semibold text-primary mb-6 font-mono">Order Information</h2>
              <div className="space-y-2">
                <Label htmlFor="num-pos" className="font-mono">
                  Number of PO's (per Year)
                </Label>
                <Input
                  id="num-pos"
                  placeholder="Enter number of PO's"
                  value={formData.numPOs}
                  onChange={(e) => handleChange("numPOs", e.target.value)}
                  type="number"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="num-units" className="font-mono">
                  Number of Units (per PO)
                </Label>
                <Input
                  id="num-units"
                  placeholder="Enter number of units"
                  value={formData.numUnits}
                  onChange={(e) => handleChange("numUnits", e.target.value)}
                  type="number"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit-cost" className="font-mono">
                  Unit Cost (per PO) (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono">$</span>
                  <Input
                    id="unit-cost"
                    placeholder="Enter unit cost"
                    value={formData.unitCost}
                    onChange={(e) => handleChange("unitCost", e.target.value)}
                    className="pl-7 font-mono"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex flex-col space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 font-mono">Estimated Freight Cost (per PO)</h3>
                <p className="text-2xl font-bold text-primary mt-1 font-mono">
                  $
                  {Number(formData.freightCost).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="space-y-4">
                <Slider
                  defaultValue={[0]}
                  max={maxValue}
                  step={step}
                  value={[formData.freightCost]}
                  onValueChange={handleSliderChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Index

