---
sidebar_position: 5
---

# Connect to Server

Once the server has started successfully, you can connect to it using a Minecraft Bedrock Edition client.

## Verify Server Status

Before connecting, make sure:

1. **Server has finished starting**
   - Console displays `Done (xx.xxs)! For help, type "help"`

2. **Server is running**
   - Console can accept commands normally

## Connection Methods

### Local Connection (Same Computer)

If you're playing on the same computer as the server:

1. Open Minecraft Bedrock Edition client
2. Click "Play" → "Servers" → "Add Server"
3. Fill in server information:
   - **Server Name**: Custom name
   - **Server Address**: `127.0.0.1` or `localhost`
   - **Port**: `19132` (default port, use actual port if modified)
4. Click "Save" and connect

:::warning Windows 10/11 Local Connection Note
Windows systems have loopback restrictions enabled by default, which need to be lifted for local connections:

1. Run PowerShell as administrator
2. Execute the following command:
```powershell
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
```
:::

### LAN Connection (Same Network)

If you and the server are on the same local network:

1. Get the server's LAN IP address:
   - **Windows**: Run `ipconfig` in command prompt, look for IPv4 address
   - **Linux/macOS**: Run `ifconfig` or `ip addr` in terminal

2. In the Minecraft client:
   - **Server Address**: Server's LAN IP (e.g., `192.168.1.100`)
   - **Port**: `19132` (or custom port)

### Public Network Connection (Remote Server)

If the server is deployed on a remote host or cloud server:

1. **Get Public IP**
   - Ask the server administrator or check the cloud server console

2. **Configure Firewall**
   - Ensure the firewall allows inbound connections on **UDP port 19132**
   - Cloud servers need to open the port in security groups

3. **Configure Port Forwarding** (if needed)
   - If the server is behind a router, port forwarding needs to be set up

4. Fill in the client:
   - **Server Address**: Public IP
   - **Port**: `19132` (or custom port)

## Supported Clients

Nukkit server supports the following Bedrock Edition clients:

- Minecraft Bedrock Edition (Windows 10/11)
- Minecraft PE (Android/iOS)
- Minecraft (Nintendo Switch)
- Minecraft (Xbox)
- Minecraft (PlayStation)
- **NetEase Minecraft** (requires `netease-client-support` configuration enabled)

:::info NetEase Client Support
If using NetEase Minecraft client, make sure to enable in `server.properties`:
```properties
netease-client-support=true
```
:::

## Verify Connection

After successful connection:

1. You should be able to see the server's spawn point
2. The server console will display your connection information
3. You can move and interact normally

## Having Issues?

If you cannot connect, please check the [Troubleshooting](troubleshooting.md) section for solutions.
