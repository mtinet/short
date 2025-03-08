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
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Access-Control-Allow-Origin": "*" },  // ✅ CORS 헤더 추가
            body: JSON.stringify({ error: "Only POST requests are allowed." })
        };
    }

    const { longUrl } = JSON.parse(event.body);
    if (!longUrl) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },  // ✅ CORS 헤더 추가
            body: JSON.stringify({ error: "Missing longUrl parameter." })
        };
    }

    const shortCode = Math.random().toString(36).substring(2, 8);
    await db.collection("urls").doc(shortCode).set({ longUrl });

    return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },  // ✅ CORS 헤더 추가
        body: JSON.stringify({ shortUrl: `https://sshortener.netlify.app/${shortCode}` })
    };
};
