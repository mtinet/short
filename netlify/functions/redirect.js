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
    const shortCode = event.path.split("/").pop(); // URL에서 코드 추출
    const doc = await db.collection("urls").doc(shortCode).get();

    if (!doc.exists) {
        return { statusCode: 404, body: "URL Not Found" };
    }

    const { longUrl } = doc.data();

    return {
        statusCode: 302,
        headers: { Location: longUrl }, // 302 리다이렉트
    };
};
