---
sidebar_position: 6
---

# Troubleshooting

This section covers common issues and solutions when setting up and running a Nukkit server.

## Server Won't Start

### Issue Description
The window flashes briefly or shows errors when double-clicking the startup script.

### Possible Causes and Solutions

#### 1. Java Not Installed or Version Too Old

**Check Method:**
```bash
java -version
```

**Solution:**
- Ensure Java 17 or higher is installed
- Refer to the [Preparation](preparation.md) section to reinstall Java

#### 2. JAR Filename Mismatch

**Check Method:**
- Verify that the JAR filename in the startup script matches the actual filename

**Solution:**
- Modify the filename in the startup script, or rename the JAR file

#### 3. Corrupted JAR File

**Check Method:**
- Check if the file size is abnormal (normally about 10-20 MB)

**Solution:**
- Re-download Nukkit-MOT

#### 4. Insufficient Memory

**Error Message:**
```
Could not reserve enough space for object heap
```

**Solution:**
- Reduce memory allocation in startup script (e.g., `-Xmx512M`)
- Close other memory-intensive programs

## Players Cannot Connect

### Local Connection Issues

#### Windows Loopback Restriction

**Issue Description:**
Cannot connect to server on the same computer.

**Solution:**
Run PowerShell as administrator and execute:
```powershell
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
```

### Firewall Issues

**Issue Description:**
LAN or public network players cannot connect.

**Solution:**

**Windows Firewall:**
1. Open "Windows Defender Firewall"
2. Click "Advanced settings"
3. Create new inbound rule, allow **UDP port 19132**

**Linux (ufw):**
```bash
sudo ufw allow 19132/udp
```

**Linux (iptables):**
```bash
sudo iptables -A INPUT -p udp --dport 19132 -j ACCEPT
```

### Port Already in Use

**Error Message:**
```
Address already in use
```

**Solution:**
- Check if another program is using port 19132
- Modify `server-port` in `server.properties` to a different port

### NetEase Client Cannot Connect

**Issue Description:**
Cannot connect using NetEase Minecraft client.

**Solution:**
Enable NetEase client support in `server.properties`:
```properties
netease-client-support=true
```

## Plugin Issues

### Plugin Failed to Load (Red)

**Issue Description:**
Plugin name appears in red when using the `plugins` command.

**Possible Causes:**

#### 1. Version Incompatibility
- Plugin doesn't support current Nukkit version

**Solution:**
- Find a plugin that supports the current version
- Update Nukkit to the version required by the plugin

#### 2. Missing Dependencies
- Plugin depends on other plugins

**Solution:**
- Check plugin documentation and install required dependency plugins

#### 3. Configuration File Error
- Plugin configuration file has format errors

**Solution:**
- Check console error messages
- Delete configuration file and let the plugin regenerate it
- Fix configuration according to plugin documentation

## Performance Issues

### Server Lag

**Possible Causes:**

#### 1. Insufficient Memory
**Solution:**
- Increase the `-Xmx` value in startup script
- Reduce the number of concurrent online players

#### 2. Too Many Chunks Loading
**Solution:**
Reduce view distance in `server.properties`:
```properties
view-distance=6
```

#### 3. Plugin Conflicts or Performance Issues
**Solution:**
- Disable plugins one by one to find the problematic plugin
- Update or replace poorly performing plugins

## World/Data Issues

### World Corruption

**Issue Description:**
Server cannot load world or shows errors.

**Solution:**
1. Stop the server
2. Backup the `worlds` folder
3. Try deleting lock files in `worlds/world/db`
4. If unable to fix, restore from backup

### Data Loss

**Prevention Measures:**
- Regularly backup the `worlds` folder
- Properly shut down the server (use `stop` command instead of force closing)

## Other Issues

### Console Garbled Text

**Windows Users:**
Add to the beginning of startup script:
```bat
chcp 65001
```

### Cannot Execute Commands

**Issue Description:**
Commands entered in console don't respond.

**Solution:**
- Check if there are many error messages flooding the console
- Try restarting the server
- Check if the issue is caused by a plugin

## Getting Help

If the above solutions don't solve your problem:

1. Check complete server logs (`logs` folder)
2. Search for the error message
3. Ask questions in [GitHub Issues](https://github.com/MemoriesOfTime/Nukkit-MOT/issues)
4. Join community discussion groups for help

:::tip When Asking Questions, Please Provide
- Server version
- Java version
- Operating system
- Complete error logs
- Steps to reproduce the issue
:::
