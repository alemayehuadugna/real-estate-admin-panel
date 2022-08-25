<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import employeeDashboard from './employee'
import { sendWelcomeNotification } from '@/api/notification'

export default {
  name: 'Dashboard',
    components: { adminDashboard, employeeDashboard },
    data() {
      return {
        currentRole: 'adminDashboard',
        userId: '',
        role: '',
      }
    },
    computed: {
      ...mapGetters([
        'id', 'roles'
      ])
    },
    created() {
      if(!this.roles.includes('Admin')) {
        this.currentRole = 'employeeDashboard'
      }

    this.userId = this.id
	  this.role = this.roles.join(' | ')
          // subscribe user for push notification
      const publicVapidKey =
        "BK1UHH4-z4DU6tj2ipdc6l-cUlx0KgHdwzEZf3YVIq3V0gh2Nn_cOXtNJOwXqVJNyIikZy_kKx2M0hdinaQtptE";
      //conditional render
      let clicked = true;

      // check for service worker
      if ("serviceWorker" in navigator) {
        send(this.userId, this.role).catch((err) => console.error(err));
      }

      // register service worker, register push, send push
      async function send(userId, role) {
        // registering service worker
        const register = await navigator.serviceWorker.register(
          "/serviceWorker.js"
        );

        console.log("service worker registered...");

        // register push
        console.log("registering push");
        if (clicked) {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready
              .then(function (registration) {
                if (!registration.pushManager) {
                  console.log("Push manager unavailable.");
                  return;
                }

                registration.pushManager
                  .getSubscription()
                  .then(function (existedSubscription) {
                    if (existedSubscription === null) {
                      console.log("No subscription detected, make a request.");
                      registration.pushManager
                        .subscribe({
                          userVisibleOnly: true,
                          applicationServerKey:
                            urlBase64ToUint8Array(publicVapidKey),
                        })
                        .then(function (newSubscription) {
                          console.log(
                            "New subscription added.",
                            newSubscription
                          );
                          sendWelcome(newSubscription);
                        })
                        .catch(function (e) {
                          if (Notification.permission !== "granted") {
                            console.log("Permission was not granted.");
                          } else {
                            console.error(
                              "An error ocurred during the subscription process.",
                              e
                            );
                          }
                        });
                    } else {
                      console.log("Existed subscription detected.");
                    }
                  });
              })
              .catch(function (e) {
                console.error(
                  "An error ocurred during Service Worker registration.",
                  e
                );
              });
          }
        } else {
          console.log("Can not reachable to the service worker");
        }
        console.log("push registered");

        // send welcome notification
        function sendWelcome(subscription) {
          console.log("sending welcome push");
          let data;
          data = {
            subscription: subscription,
            title: "Welcome",
            description: "You are subscribed",
            notificationImage: "http://nothing:3000/push-notification/icon/welocome.png",
            id: userId,
            role: role,
          };
          
          sendWelcomeNotification(data).then((response) => {});
          console.log("welcome push sent");
        }
      }

      function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, "+")
          .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }


    }
}
</script>



