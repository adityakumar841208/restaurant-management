// Listen for 'push' events
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();

        // Display the notification
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icon.png', // Optional icon for the notification
            data: data.data,  // Include any additional data
        });
    } else {
        console.error('Push event received with no data.');
    }
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification

    // Perform an action or navigate to a URL
    event.waitUntil(
        clients.openWindow('http://localhost:5000/admin/orders') // Update this URL as needed
    );
});
