console.log("service worker loaded");

self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log("push received...");
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.description,
      icon: data.notificationImage,
    })
  );
});


