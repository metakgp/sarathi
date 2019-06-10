/**
 * Javascript file that registers service worker for the website
 */

const publicKey = 'BKXfzdbdl2sE_IKEpoEQU5AIyO2oTBUN-Ro_ZOksKVK6M3nMMn1XQboqDVuSaCC3CL2l2g4YriWwipVurr-6JPQ';

if ('serviceWorker' in navigator) {
    registerServiceWorker().catch(err => console.log(err));
}

async function registerServiceWorker() {
    console.log("Registering service worker");
    const register = await navigator.serviceWorker.register('/javascripts/sw.js', {
        scope: '/',
    });
    console.log("Service worker registered");

    console.log("Registering push service");
    const pushSubscription = await register.pushManager.subscribe({
        userVisibleOnly: true, 
        applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    console.log("Registered push service");

    // Sending pushSubscription object to the backend
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(pushSubscription),
        headers: {
            'content-type': 'application/json',
        },
    });
    console.log("Push subscription sent");
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}