self.addEventListener('push', event => {
    const message = event.data.json();
    
    self.registration.showNotification(message.title, message);
});