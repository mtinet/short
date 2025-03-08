const admin = require("firebase-admin");

if (!admin.apps.length) {
    try {
        const serviceAccount = require("./serviceAccount.json");
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
    }
}

const db = admin.firestore();

exports.handler = async (event) => {
    console.log("Event received:", event);  // ✅ 로그 추가 (디버깅용)

    // CORS Preflight 요청 처리
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: ""
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Only POST requests are allowed." })
        };
    }

    try {
        const requestBody = JSON.parse(event.body);
        console.log("Parsed request body:", requestBody);  // ✅ 디버깅 로그 추가

        const { longUrl } = requestBody;
        if (!longUrl) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Missing longUrl parameter." })
            };
        }

        const shortCode = Math.random().toString(36).substring(2, 8);
        await db.collection("urls").doc(shortCode).set({ longUrl });

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ shortUrl: `https://sshortener.netlify.app/${shortCode}` })
        };
    } catch (error) {
        console.error("Error processing request:", error);  // ✅ 에러 로그 출력
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Internal Server Error", details: error.toString() })
        };
    }
};
