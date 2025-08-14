import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

export default function AadhaarForm() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();

  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const handleConsentChange = (e) => {
    setConsent(e.target.checked);
  };

  const handleValidateAndGenerateOTP = async () => {
    if (!formData.aadhar || !formData.name || !consent) {
      alert('Please fill all required fields and give consent');
      return;
    }

    setIsLoading(true);
    setMessage('');
    console.log("API URL:",import.meta.env.VITE_API_URL);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhar: formData.aadhar,
          name: formData.name
        })
      });

      const data = await response.json();
      setMessage(data.msg);

      if (data.status) {
        setIsSuccess(true);
        setOtpSent(true);
      } else {
        setIsSuccess(false);
        setOtpSent(false);
      }
    } catch (error) {
      setMessage('Network error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    if (!formData.otp) {
      alert('Please enter OTP');
      return;
    }

    setOtpLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: formData.otp,
          aadhar: formData.aadhar
        })
      });

      const result = await response.json();

      // If result.msg is empty, OTP is verified successfully
      if (!result.msg || result.msg.trim() === '') {
        setMessage('OTP verified successfully!');
        setIsSuccess(true);
        // Navigate to PAN validation after a short delay
        setTimeout(() => {
          navigate('/pan-validation');
        }, 1500);
      } else {
        // Display the error message
        setMessage(result.msg);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            UDYAM REGISTRATION FORM - For New Enterprise who are not Registered yet as MSME
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="bg-blue-500 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-lg font-medium">Aadhaar Verification With OTP</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Aadhaar Number
                </label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleInputChange}
                  placeholder="Your Aadhaar No"
                  disabled={otpSent}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${otpSent ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Name of Entrepreneur
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name as per Aadhaar"
                  disabled={otpSent}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${otpSent ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                />
              </div>
            </div>

            <div className="mb-6 space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                <span>Aadhaar number shall be required for Udyam Registration.</span>
              </div>
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                <span>
                  The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={handleConsentChange}
                  disabled={otpSent}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number for Udyam Registration.
                </span>
              </label>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-md ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                <div className={`text-sm ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                  {message}
                </div>
              </div>
            )}

            {otpSent && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  *Enter One Time Password (OTP) Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="OTP code"
                  className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex gap-4">
              {!otpSent ? (
                <button
                  onClick={handleValidateAndGenerateOTP}
                  disabled={isLoading || !consent}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Validate & Generate OTP'
                  )}
                </button>
              ) : (
                <button
                  onClick={handleValidateOTP}
                  disabled={otpLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium flex items-center"
                >
                  {otpLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validating...
                    </>
                  ) : (
                    'Validate OTP'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


