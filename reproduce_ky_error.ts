import ky from 'ky';

async function testKy() {
    try {
        console.log("Testing ky with 'asnwe'...");
        await ky('asnwe');
    } catch (error: any) {
        console.log("Error for 'asnwe':", error.message);
    }

    try {
        console.log("Testing ky with 'sending answer'...");
        await ky('sending answer');
    } catch (error: any) {
        console.log("Error for 'sending answer':", error.message);
    }
}

testKy();
