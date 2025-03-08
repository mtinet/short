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
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { longUrl } = JSON.parse(event.body);
    if (!longUrl) {
        return { statusCode: 400, body: "Missing longUrl" };
    }

    // 6자리 랜덤 코드 생성
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    // Firestore 저장
    await db.collection("urls").doc(shortCode).set({ longUrl });

    return {
        statusCode: 200,
        body: JSON.stringify({ shortUrl: `https://sshortener.netlify.app/${shortCode}` }),
    };
};
