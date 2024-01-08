const http = require("http");
const fs = require("fs");
const path = require("path");
const getIp = require("./getIp");
const multer = require("multer");

const { ipv4 } = getIp();

// 配置 multer
const storage = multer.memoryStorage(); // 存储在内存中
const upload = multer({ storage: storage });

// 缓存到内存的文件内容
const memoryCache = {};

function readFolderToMemory(
  folderPath,
  parentFolder = "",
  excludedFolders = []
) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    // => 父文件夹名字/子文件夹名字/子文件名字
    // => article/0_base/index.md
    const key = path.join(parentFolder, file).replaceAll("\\", "/");

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

function handleUpload(req, res) {
  const uploadDir = path.join(__dirname, "picture");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const fileName = "uploaded-image.png";

  const multerUpload = upload.single("image");

  multerUpload(req, res, (err) => {
    if (err) {
      console.error("文件上传失败:", err.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("文件上传失败。");
    } else {
      const filePath = path.join(
        uploadDir,
        decodeURIComponent(escape(req.file.originalname))
      );

      console.log("__filePath", filePath);

      fs.writeFile(filePath, req.file.buffer, "binary", (err) => {
        if (err) {
          console.error("文件写入失败:", err.message);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("文件写入失败。");
        } else {
          console.log(`文件 ${fileName} 上传成功。`);
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(`文件 ${fileName} 上传成功。`);
        }
      });
    }
  });
}
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://192.168.3.143:8000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-requested-with"
  ); // 添加 x-requested-with
  res.setHeader("Access-Control-Allow-Credentials", "true");

  console.log(req.url);

  if (req.method === "OPTIONS") {
    console.log("__options_ok");
    // 处理预检请求，直接返回 200 OK
    res.writeHead(200);
    res.end();
    return;
  }

  // 上传照片给我, 然后我监听到, 然后写入指定文件夹
  // 监听请求地址: upload

  if (req.url === "/upload") {
    console.log("__upload");
    handleUpload(req, res);
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log("OR");
  console.log(`Server is running at http://${ipv4}:${PORT}`);
});
