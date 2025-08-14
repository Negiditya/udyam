const express = require('express');
const { aadharAuth, verifyOtp, panValidation } = require('../puppeteer/udyam');

const router = express.Router()
let sessions = {}

router.post('/aadhaar/generate-otp', async (req, res) => {

    try {
        const { aadhar, name } = req.body;
        const { msg, status, page, browser } = await aadharAuth(aadhar, name)
        sessions[aadhar] = { page, browser }
        res.json({ msg, status })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }



})
router.post('/aadhaar/verify-otp', async (req, res) => {

    try {

        const { otp, aadhar } = req.body;
        const { page, browser } = sessions[aadhar]
        const result = await verifyOtp(otp, page, browser)
        console.log(result)
        sessions[aadhar] = { page: result.page, browser: result.browser }
        console.log(result.msg);
        res.json({
            msg: result.msg || '',
            status: result.msg ? false : true 
        })

    } catch (error) {
        res.status(500).json({ error: error.message });

    }




})

router.post('/pan-validation', async (req, res) => {

    try {



        const { aadhar, data } = req.body;
        console.log('Sessions:', sessions);
        console.log('Aadhar in request:', aadhar);

        const { page, browser } = sessions[aadhar]
        const result = await panValidation(data, page, browser)
        sessions[aadhar] = { page: result.page, browser: result.browser }
        console.log(result)
        res.json(result);
    } catch (error) {
        res.status(500).json({ err: error.message })

    }



})

module.exports = router