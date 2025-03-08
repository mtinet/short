const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

// Firebase 초기화
const serviceAccount = require("../serviceAccount.json");
initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = getFirestore();

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
        body: JSON.stringify({ shortUrl: `https://yourdomain.com/${shortCode}` }),
    };
};
