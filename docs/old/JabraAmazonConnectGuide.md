## Amazon Connect

Guide to add headset functionality to [Amazon Connect](https://aws.amazon.com/connect/). This will provide ringer/offhook/onhook functionality to a custom Amazon Connect implementation.

Prerequisites:
* https://github.com/aws/amazon-connect-streams
* https://github.com/gnaudio/jabra-browser-integration
* an Amazon Connect instance (created in the AWS console)

### Layered architecture
![Banner](/docs/AmazonLayers.png)

### Initialization (API v1.2)
Both the Amazon Connect Streams and the Jabra Browser integration libraries must be initialized:

```javascript
jabra.init();
```

```javascript
connect.core.initCCP();
```

### Connecting the two APIs
Callbacks from the Amazon Connect Streams library can trigger an action in the Jabra Browser integration library and callbacks from the Jabra Browser integration library can trigger an action the the Amazon Connect Streams library.

### Example of a complete solution (simplified)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Jabra Amazon Connect Demo</title>
</head>
<body>
  <script src="amazon-connect-v1.2.0.js"></script>
  <script src="jabra.browser.integration-1.2.js"></script>
  <h1>Jabra Amazon Connect Demo</h1>
  <p id="name">Please login</p>
  <br />
  <div style="height:465px;width:320px" id="containerDiv">
  </div>
  <br />
  <script>
    var activeContact = undefined;
    // Jabra library init
    jabra.init(
      function () {
        console.log("Jabra library initialized successfully");
      },
      function (msg) {
        console.log("Jabra library error: " + msg);
      },
      function (req) {
        if (req === jabra.requestEnum.acceptCall) {
          activeContact.accept();
        }
        if (req === jabra.requestEnum.endCall) {
          activeContact.getInitialConnection().destroy();
        }
      }
    );
    // Connect init
    connect.core.initCCP(containerDiv,
      {
        ccpUrl: "https://youramazoninstance.awsapps.com/connect/ccp#/",
        loginPopup: true,
        softphone: { allowFramedSoftphone: true }
      });
    // Agent
    connect.agent(function (agent) {
      var name = agent.getName();
      name = ("Hello agent " + name);
      document.getElementById("name").innerHTML = name;
    });
    // Contact
    connect.contact(function (contact) {
      activeContact = contact;
      contact.onEnded(function (contact) {
        jabra.onHook();
      });
      contact.onConnecting(function (contact) {
        jabra.ring();
      });
      contact.onConnected(function (contact) {
        jabra.offHook();
      });
    });
  </script>
</body>
</html>
```
