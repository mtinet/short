const admin = require("firebase-admin");

// Firebase 초기화 (환경 변수에서 인증 정보 불러오기)
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
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
