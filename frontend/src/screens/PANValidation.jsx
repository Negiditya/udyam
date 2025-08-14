import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

export default function PANValidationForm() {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormContext();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData(name, value);
    };

    const handlePANValidation = async () => {
        if (!formData.orgType || !formData.pan || !formData.name || !formData.dob) {
            alert('Please fill all required fields');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/pan-validation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    aadhar: formData.aadhar,
                    data: {
                        orgType: formData.orgType,
                        pan: formData.pan,
                        name: formData.name,
                        dob: formData.dob
                    }
                })
            });

            const result = await response.json();

            if (result.status) {
                setMessage('PAN validation successful!');
                setIsSuccess(true);
                // Navigate to next step or show success
            } else {
                setMessage(result.errMsg || 'PAN validation failed');
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage('Network error occurred. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        UDYAM REGISTRATION FORM - PAN Validation
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="bg-blue-500 text-white px-6 py-4 rounded-t-lg">
                        <h2 className="text-lg font-medium">PAN Details Validation</h2>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Organization Type *
                                </label>
                                <select
                                    name="orgType"
                                    value={formData.orgType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Organization Type</option>
                                    <option value="Proprietary / एकल स्वामित्व">Proprietary / एकल स्वामित्व</option>
                                    <option value="Hindu Undivided Family / हिंदू अविभाजित परिवार (एचयूएफ)">Hindu Undivided Family / हिंदू अविभाजित परिवार (एचयूएफ)</option>
                                    <option value="Partnership / पार्टनरशिप">Partnership / पार्टनरशिप</option>
                                    <option value="Co-Operative / सहकारी">Co-Operative / सहकारी</option>
                                    <option value="Private Limited Company / प्राइवेट लिमिटेड कंपनी">Private Limited Company / प्राइवेट लिमिटेड कंपनी</option>
                                    <option value="Public Limited Company / पब्लिक लिमिटेड कंपनी">Public Limited Company / पब्लिक लिमिटेड कंपनी</option>
                                    <option value="Self Help Group / स्वयं सहायता समूह">Self Help Group / स्वयं सहायता समूह</option>
                                    <option value="Limited Liability Partnership / सीमित दायित्व भागीदारी">Limited Liability Partnership / सीमित दायित्व भागीदारी</option>
                                    <option value="Society / सोसाइटी">Society / सोसाइटी</option>
                                    <option value="Trust / ट्रस्ट">Trust / ट्रस्ट</option>
                                    <option value="Others / अन्य">Others / अन्य</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PAN Number *
                                </label>
                                <input
                                    type="text"
                                    name="pan"
                                    value={formData.pan}
                                    onChange={handleInputChange}
                                    placeholder="Enter PAN Number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name as per PAN *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Name as per PAN"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-md ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                }`}>
                                <div className={`text-sm ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                                    {message}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-medium"
                            >
                                Back
                            </button>

                            <button
                                onClick={handlePANValidation}
                                disabled={isLoading}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Validating...
                                    </>
                                ) : (
                                    'Validate PAN'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}