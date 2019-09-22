
const vapidPublicKey = 'BIYJJ-lY0hhaZserfasQL6RwXSNSP8KB5Qc662MwUEDqH-d6u6VQZi5O4IhrN8WFJ9FTvBiwNCaD1DxHaUODepE';

const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function subscribeUser(pushSubscription) {
    return fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(pushSubscription),
        headers: {
            'content-type': 'application/json',
        },
    });
}

function unsubscribeUser(pushSubscription) {
    return fetch('/api/unsubscribe', {
        method: 'POST',
        body: JSON.stringify(pushSubscription),
        headers: {
            'content-type': 'application/json',
        },
    });
}

export function registerPushManager() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
        .then(registration => {

            if (!registration.pushManager) {
                alert("Push unsupported");
                return;
            }
            
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            })
            .then(subscribeUser)
            .catch(err => console.log(err));
        })
    }
}

export function unregisterPushManager() {
    return navigator.serviceWorker.ready
    .then(registration => {
        
        return registration.pushManager.getSubscription()
        .then(subscription => {

            return subscription.unsubscribe()
            .then(() => unsubscribeUser(subscription))
            .catch(err => console.log(err));

        })
        .catch(err => console.log(err));

    })
}