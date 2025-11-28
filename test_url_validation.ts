import { NonRetriableError } from "inngest";

async function testUrlValidation() {
    const invalidUrl = "sending answer";
    const validUrl = "https://example.com";

    console.log(`Testing invalid URL: '${invalidUrl}'`);
    try {
        new URL(invalidUrl);
        console.log("FAIL: Invalid URL should have thrown an error.");
    } catch (e) {
        console.log("PASS: Invalid URL threw an error as expected.");
        console.log(`Error message: Invalid URL: '${invalidUrl}'. Please ensure the endpoint is a valid URL.`);
    }

    console.log(`\nTesting valid URL: '${validUrl}'`);
    try {
        new URL(validUrl);
        console.log("PASS: Valid URL was parsed successfully.");
    } catch (e) {
        console.log("FAIL: Valid URL should not have thrown an error.");
        console.log(e);
    }
}

testUrlValidation();
