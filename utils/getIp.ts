const os = require("os");

// 获取网络接口列表
const networkInterfaces = os.networkInterfaces();

function getIp() {
  const result = {};

  // 遍历网络接口列表，找到 IPv4 地址
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === "IPv4" && !iface.internal) {
        result["ipv4"] = iface.address;
      }
    }
  });

  return result;
}

module.exports = getIp;
