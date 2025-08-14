const puppeteer = require('puppeteer')

// function for handling aadhar auth and generate OTP

const aadharAuth = async (aadhar, name) => {


    const browser = await puppeteer.launch({ headless: true })

    const page = await browser.newPage();

    await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx')

    await page.type('#ctl00_ContentPlaceHolder1_txtadharno', aadhar);
    await page.type('#ctl00_ContentPlaceHolder1_txtownername', name);


    await page.click('#ctl00_ContentPlaceHolder1_btnValidateAadhaar');

    await page.waitForFunction(() => {
        const errEl = document.querySelector('#ctl00_ContentPlaceHolder1_lblmsg');
        const otpEl = document.querySelector('#ctl00_ContentPlaceHolder1_lblOtpRes1'); 
        return (errEl && errEl.innerText.trim().length > 0) ||
            (otpEl && otpEl.innerText.trim().length > 0);
    }, { timeout: 10000 });

    let msg = '';

    const errText = await page.$eval('#ctl00_ContentPlaceHolder1_lblmsg', el => el.innerText.trim());
    if (errText.length > 0) {
        msg = errText;
        return { msg, status: false, page, browser };
    } else {
        msg = await page.$eval('#ctl00_ContentPlaceHolder1_lblOtpRes1', el => el.innerText.trim());
        return { msg, status: true, page, browser };
    }




}


// function for verification of otp

const verifyOtp = async (otp, page, browser) => {

    await page.evaluate(() => {
        document.querySelector('#ctl00_ContentPlaceHolder1_txtOtp1').value = '';
    });
    await page.type('#ctl00_ContentPlaceHolder1_txtOtp1', otp);
    await page.click('#ctl00_ContentPlaceHolder1_btnValidate');

    try {

        await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtPan', { visible: true, timeout: 5000 });
        return { msg: "OTP verified successfully", page, browser };
    } catch {

        let msg = "";
        try {
            msg = await page.$eval('#ctl00_ContentPlaceHolder1_lblOtp1', el => el.innerText.trim());
        } catch {

        }
        return { msg, page, browser };
    }
}

const panValidation = async (data, page, browser) => {
    // Clear previous values
    await page.evaluate(() => {
        document.querySelector('#ctl00_ContentPlaceHolder1_ddlTypeofOrg').value = '';
        document.querySelector('#ctl00_ContentPlaceHolder1_txtPan').value = '';
        document.querySelector('#ctl00_ContentPlaceHolder1_txtPanName').value = '';
        document.querySelector('#ctl00_ContentPlaceHolder1_txtdob').value = '';
    });

    // Use select for dropdown, not type
    await page.select('#ctl00_ContentPlaceHolder1_ddlTypeofOrg', data.orgType);
    await page.type('#ctl00_ContentPlaceHolder1_txtPan', data.pan);
    await page.type('#ctl00_ContentPlaceHolder1_txtPanName', data.name);
    await page.type('#ctl00_ContentPlaceHolder1_txtdob', data.dob);

    // Rest of your code...



await page.click('#ctl00_ContentPlaceHolder1_btnValidatePan');

let errMsg = await page.$eval('#ctl00_ContentPlaceHolder1_lblPanError', el => el.innerText.trim());
const success = await page.$eval('#ctl00_ContentPlaceHolder1_lblPanError', el => el.innerText.trim());

if (errMsg.length > 0) {
    return { status: false, errMsg, page, browser }
}
else if (success.length > 0) {
    await page.click('#ctl00_ContentPlaceHolder1_btnGetPanData');
    let cbdtMsg = '';

    cbdtMsg = await page.$eval('#ctl00_ContentPlaceHolder1_lblmsgpan', el => el.innerText.trim());
    if (errMsg.length > 0) {
        return { status: false, errMsg: cbdtMsg, page, browser }
    }

    return { status: true, page, browser }


}






}




module.exports = { aadharAuth, verifyOtp, panValidation }