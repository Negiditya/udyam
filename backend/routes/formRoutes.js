const express = require('express');
const { aadharAuth, verifyOtp, panValidation } = require('../puppeteer/udyam');

const router = express.Router();

// In-memory sessions (consider Redis for production)
let sessions = {};

/**
 * 1️⃣ Generate OTP
 */
router.post('/aadhaar/generate-otp', async (req, res) => {
  try {
    const { aadhar, name } = req.body;
    if (!aadhar || !name) {
      return res.status(400).json({ status: false, msg: 'Aadhaar and Name are required' });
    }

    const { msg, status, page, browser } = await aadharAuth(aadhar, name);

    if (!status) {
      await browser.close();
      return res.json({ status, msg });
    }

    // Save Puppeteer page/browser for OTP verification
    sessions[aadhar] = { page, browser };
    res.json({ status, msg });
  } catch (error) {
    console.error('Generate OTP Error:', error);
    res.status(500).json({ status: false, msg: 'Server error' });
  }
});

/**
 * 2️⃣ Verify OTP
 */
router.post('/aadhaar/verify-otp', async (req, res) => {
  try {
    const { otp, aadhar } = req.body;
    if (!otp || !aadhar || !sessions[aadhar]) {
      return res.status(400).json({ status: false, msg: 'Invalid session or OTP missing' });
    }

    const { page, browser } = sessions[aadhar];
    const result = await verifyOtp(otp, page, browser);

    // Update session or close browser if OTP failed
    if (!result.status) {
      await browser.close();
      delete sessions[aadhar];
    } else {
      sessions[aadhar] = { page: result.page, browser: result.browser };
    }

    res.json({
      status: result.status,
      msg: result.msg || ''
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ status: false, msg: 'Server error' });
  }
});

/**
 * 3️⃣ PAN Validation
 */
router.post('/pan-validation', async (req, res) => {
  try {
    const { aadhar, data } = req.body;
    if (!aadhar || !data || !sessions[aadhar]) {
      return res.status(400).json({ status: false, msg: 'Invalid session or data missing' });
    }

    const { page, browser } = sessions[aadhar];
    const result = await panValidation(data, page, browser);

    // Close browser after PAN validation to free memory
    await browser.close();
    delete sessions[aadhar];

    // Send only necessary info to frontend
    res.json({
      status: result.status,
      msg: result.msg || '',
      errMsg: result.errMsg || ''
    });
  } catch (error) {
    console.error('PAN Validation Error:', error);
    res.status(500).json({ status: false, msg: 'Server error' });
  }
});

module.exports = router;
