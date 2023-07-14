const iv = crypto.getRandomValues(new Uint8Array(12));

async function encryptAES(data, key) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name : 'AES-GCM',
            iv: iv,
        },
        key,
        encodedData
    );

    return encryptedData;
}

async function decryptAES(encryptedData, key) {
    const decryptedData = await crypto.subtle.decrypt(
        {
            name : 'AES-GCM',
            iv: iv
        },
        key,
        encryptedData
    );
    const decoder = new TextDecoder();
    const decodedData = decoder.decode(decryptedData);

    return decodedData;
}

// Helper functions for base64 conversion
function arrayBufferToBase64(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
    let base64String = '';

    for (let i = 0; i < uint8Array.length; i++) {
        base64String += String.fromCharCode(uint8Array[i]);
    }

    return btoa(base64String);
}
function base64ToArrayBuffer(base64String) {
    const binaryString = atob(base64String);
    const uint8Array = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    return uint8Array.buffer;
}

//  Encode Base64
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str));
}

// Decode Base64
function UnicodeDecodeB64(str) {
    return decodeURIComponent(atob(str));
}

export { b64EncodeUnicode, UnicodeDecodeB64, encryptAES, decryptAES, arrayBufferToBase64, base64ToArrayBuffer};

/*async function hash256Converter(string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function verifyHash(string, hashHex) {
    const calculatedHash = await hashHexConverter(string);
    return calculatedHash == hashHex;
}*/