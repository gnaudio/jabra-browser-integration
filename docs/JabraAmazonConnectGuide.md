## Amazon Connect

Guide to add headset functionality to [Amazon Connect](https://aws.amazon.com/connect/)

Prerequisites:

https://github.com/aws/amazon-connect-streams

and

https://github.com/gnaudio/jabra-browser-integration

### Initialization
Both the Amazon Connect Streams and the Jabra Browser integration libraries must be initialized:

```javascript
jabra.init()
```

```javascript
connect.core.initCCP()
```
