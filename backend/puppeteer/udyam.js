const puppeteer = require('puppeteer'); // Use puppeteer (bundled Chromium)

const launchBrowser = async () => {
    return await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

// 1️⃣ Aadhaar Auth + Generate OTP
const aadharAuth = async (aadhar, name) => {
    const browser = await launchBrowser();
    const page = await browser.newPage();

    try {
        await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', { waitUntil: 'networkidle2' });

        await page.type('#ctl00_ContentPlaceHolder1_txtadharno', aadhar);
        await page.type('#ctl00_ContentPlaceHolder1_txtownername', name);
        await page.click('#ctl00_ContentPlaceHolder1_btnValidateAadhaar');

        await page.waitForFunction(() => {
            const errEl = document.querySelector('#ctl00_ContentPlaceHolder1_lblmsg');
            const otpEl = document.querySelector('#ctl00_ContentPlaceHolder1_lblOtpRes1');
            return (errEl && errEl.innerText.trim().length > 0) ||
                (otpEl && otpEl.innerText.trim().length > 0);
        }, { timeout: 10000 });

        const errText = await page.$eval('#ctl00_ContentPlaceHolder1_lblmsg', el => el.innerText.trim());
        if (errText.length > 0) {
            return { status: false, msg: errText, page, browser };
        } else {
            const otpMsg = await page.$eval('#ctl00_ContentPlaceHolder1_lblOtpRes1', el => el.innerText.trim());
            return { status: true, msg: otpMsg, page, browser };
        }

    } catch (err) {
        console.error('Aadhaar Auth Error:', err);
        await browser.close();
        return { status: false, msg: 'Server error' };
    }
};

// 2️⃣ Verify OTP
const verifyOtp = async (otp, page, browser) => {
    try {
        await page.evaluate(() => {
            document.querySelector('#ctl00_ContentPlaceHolder1_txtOtp1').value = '';
        });
        await page.type('#ctl00_ContentPlaceHolder1_txtOtp1', otp);
        await page.click('#ctl00_ContentPlaceHolder1_btnValidate');

        await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtPan', { visible: true, timeout: 5000 });
        return { status: true, msg: 'OTP verified successfully', page, browser };

    } catch (err) {
        let msg = '';
        try {
            msg = await page.$eval('#ctl00_ContentPlaceHolder1_lblOtp1', el => el.innerText.trim());
        } catch { }
        return { status: false, msg, page, browser };
    }
};

// 3️⃣ PAN Validation
const panValidation = async (data, page, browser) => {
    try {
        await page.evaluate(() => {
            document.querySelector('#ctl00_ContentPlaceHolder1_ddlTypeofOrg').value = '';
            document.querySelector('#ctl00_ContentPlaceHolder1_txtPan').value = '';
            document.querySelector('#ctl00_ContentPlaceHolder1_txtPanName').value = '';
            document.querySelector('#ctl00_ContentPlaceHolder1_txtdob').value = '';
        });

        await page.select('#ctl00_ContentPlaceHolder1_ddlTypeofOrg', data.orgType);
        await page.type('#ctl00_ContentPlaceHolder1_txtPan', data.pan);
        await page.type('#ctl00_ContentPlaceHolder1_txtPanName', data.name);
        await page.type('#ctl00_ContentPlaceHolder1_txtdob', data.dob);

        await page.click('#ctl00_ContentPlaceHolder1_btnValidatePan');

        let errMsg = await page.$eval('#ctl00_ContentPlaceHolder1_lblPanError', el => el.innerText.trim());
        if (errMsg.length > 0) return { status: false, errMsg, page, browser };

        await page.click('#ctl00_ContentPlaceHolder1_btnGetPanData');
        let cbdtMsg = await page.$eval('#ctl00_ContentPlaceHolder1_lblmsgpan', el => el.innerText.trim());

        return { status: true, msg: cbdtMsg, page, browser };

    } catch (err) {
        console.error('PAN Validation Error:', err);
        await browser.close();
        return { status: false, msg: 'Server error' };
    }
};

module.exports = { aadharAuth, verifyOtp, panValidation };
