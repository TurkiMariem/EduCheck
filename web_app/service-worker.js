importScripts("https://js.pusher.com/beams/service-worker.js");

  const beamsClient = new PusherPushNotifications.Client({
    instanceId: '4e1c5286-875a-4d3f-934c-205103f25516',
  });

  beamsClient.start()
    .then(() => beamsClient.addDeviceInterest('hello'))
    .then(() => console.log('Successfully registered and subscribed!'))
    .catch(console.error);
