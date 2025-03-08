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
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: ""
        };
    }

    const shortCode = event.path.split("/").pop();
    const doc = await db.collection("urls").doc(shortCode).get();

    if (!doc.exists) {
        return {
            statusCode: 404,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "URL Not Found" })
        };
    }

    const { longUrl } = doc.data();
    return {
        statusCode: 302,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Location": longUrl
        }
    };
};
