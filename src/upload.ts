const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.memoryStorage(); // 存储在内存中
const upload = multer({ storage });

async function uploadFiles(req, res) {
  const chalk = (await import("chalk")).default;

  const uploadDir = path.join(__dirname, "picture");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const multerUploadArray = upload.array("file");

  multerUploadArray(req, res, (err) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("文件上传失败");
      console.error("文件上传失败:", err.message);
      return;
    }

    let i = 0;
    let filesLength = req.files.length;

    req.files.forEach(async (file) => {
      const fileName = decodeURIComponent(escape(file.originalname));
      const filePath = path.join(uploadDir, fileName);
      fs.writeFile(filePath, file.buffer, "binary", (err) => {
        if (err) {
          console.error("文件写入失败:", err.message);
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("文件写入失败");
          return;
        }

        i += 1;

        console.log(`${fileName} 上传成功`);

        if (i === filesLength) {
          console.log(chalk.green(`所有文件上传成功, 总个数为: ${i}`));
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("文件上传成功");
        }
      });
    });
  });
}

function uploadFile(req, res) {
  const uploadDir = path.join(__dirname, "picture");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const multerUpload = upload.single("file");

  multerUpload(req, res, (err) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("文件上传失败");
      console.error("文件上传失败:", err.message);
      return;
    }

    const fileName = decodeURIComponent(escape(req.file.originalname));

    const filePath = path.join(uploadDir, fileName);

    fs.writeFile(filePath, req.file.buffer, "binary", (err) => {
      if (err) {
        console.error("文件写入失败:", err.message);
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("文件写入失败");
        return;
      }

      console.log(chalk.green(`${fileName} 上传成功`));
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`${fileName} 上传成功`);
    });
  });
}

module.exports = {
  uploadFile,
  uploadFiles,
};
