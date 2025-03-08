const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

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
