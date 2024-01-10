import fs from "fs";
import path from "path";
import http from "http";

import getIp from "./utils/getIp.js";
import { uploadFile, uploadFiles } from "./upload.js";

const { ipv4 } = getIp();

// 缓存到内存的文件内容
const memoryCache = {};
function readFolderToMemory(
  folderPath,
  parentFolder = "",
  excludedFolders: any[] = []
) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file: string) => {
    const filePath = path.join(folderPath, file);
    // => 父文件夹名字/子文件夹名字/子文件名字
    // => article/0_base/index.md
    const key = path.join(parentFolder, file)?.replace(/\\/g, "/");

    // 检查是否在排除列表中
    if (!excludedFolders.includes(file)) {
      if (fs.statSync(filePath).isDirectory()) {
        // 如果是文件夹，则递归读取，并传递当前文件夹作为父级
        readFolderToMemory(filePath, key, excludedFolders);
      } else {
        const content = fs.readFileSync(filePath, "utf8");
        memoryCache[key] = content;
      }
    }
  });
}
const readFilePath = "D:\\code\\yomua\\dist";

// 递归读取指定目录内每个文件的内容
// readFolderToMemory(readFilePath, "", ["node_modules"]);

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://192.168.3.143:8000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-requested-with"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(200); // 处理预检请求，直接返回 200 OK
    res.end();

    return;
  }

  if (req.url === "/upload") {
    uploadFile(req, res);
    return;
  }

  if (req.url === "/upload_files") {
    uploadFiles(req, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });

  res.end("Not Found");
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log("OR");
  console.log(`Server is running at http://${ipv4}:${PORT}`);
});
