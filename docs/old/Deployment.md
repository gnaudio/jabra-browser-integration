## Deployment

### How to mass deploy the Jabra Chrome Host in a Windows environment

It is possible to mass deploy the required client side software, in order to remove any client side.

1. Push the Windows installer file for the native chromehost (`JabraChromeHost*.msi`) to the clients using your company IT deployment tools, i.e. Microsoft System Center Configuration Manager, IBM Tivoli or Symantec Altiris 

2. Push a Registry key to the clients. This could be done by using Group Policy or Microsoft System Center Configuration Manager.

Registry key details:

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Policies\Google\Chrome\ExtensionInstallForcelist]
"2048"="okpeabepajdgiepelmhkfhkjlhhmofma;https://clients2.google.com/service/update2/crx"
```

### More information
https://www.chromium.org/administrators/policy-list-3#ExtensionInstallForcelist
