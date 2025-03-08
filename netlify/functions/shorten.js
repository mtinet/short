const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json"); // 환경 변수 대신 직접 파일 로드

// Firebase 초기화
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

exports.handler = async (event) => {
    // ✅ OPTIONS 요청 처리 (CORS Preflight 요청 대응)
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,  // ✅ HTTP OK 상태 반환
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: ""  // OPTIONS 요청은 응답 본문이 필요 없음
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
        const { longUrl } = JSON.parse(event.body);
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
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
