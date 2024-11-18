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

    const notificationData = event.notification.data; // Access the data set in showNotification
    console.log(notificationData)
    event.waitUntil(
        // clients.openWindow(`http://localhost:5000/admin/${notificationData.order}`) // Use the ID from notification data
        clients.openWindow(`https://vedika-restaurant.onrender.com/admin/${notificationData.order}`) // Use the ID from notification data
    );
    // if (notificationData && notificationData.id) {
    //     // Perform an action or navigate to a URL
    // } else {
    //     console.error('No ID found in notification data.');
    // }

})
