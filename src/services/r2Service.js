const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

async function uploadDirectoryToR2(localDir, remotePrefix) {
  const files = fs.readdirSync(localDir);
  const uploadedUrls = {};

  for (const file of files) {
    const filePath = path.join(localDir, file);
    const fileContent = fs.readFileSync(filePath);
    const key = `${remotePrefix}/${file}`;

    const contentType = file.endsWith('.m3u8')
      ? 'application/vnd.apple.mpegurl'
      : file.endsWith('.ts')
      ? 'video/mp2t'
      : 'application/octet-stream';

    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    }));

    uploadedUrls[file] = `${process.env.R2_PUBLIC_URL}/${key}`;
  }

  return uploadedUrls;
}

async function deleteDirectoryFromR2(remotePrefix, fileNames) {
  for (const file of fileNames) {
    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `${remotePrefix}/${file}`,
    }));
  }
}

module.exports = { uploadDirectoryToR2, deleteDirectoryFromR2 };