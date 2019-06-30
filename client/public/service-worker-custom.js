self.addEventListener('push', event => {
    const message = event.data.json();
    message.badge = '/favicon-32x32.png';
    self.registration.showNotification(message.title, message);
});

self.addEventListener('notificationclick', event => {
    const urlToOpen = new URL(event.notification.data.urlToOpen, self.location.origin).href;

    const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
    })
    .then((windowClients) => {
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
        matchingClient = windowClient;
        break;
        }
    }

    if (matchingClient) {
        return matchingClient.focus();
    } else {
        return clients.openWindow(urlToOpen);
    }
    });

    event.waitUntil(promiseChain)
});
