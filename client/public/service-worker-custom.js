self.addEventListener('push', event => {
    const message = event.data.json();
    message.icon = 'https://travelkgp.herokuapp.com/icon.png';
    self.registration.showNotification(message.title, message);
});