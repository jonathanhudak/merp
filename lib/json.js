const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const bucketName = "annij";
const region = "us-west-2";

const { createProject, getProjects, deleteProject } = require("./lib/database");

function getObjectKey(fileName) {
  const key = fileName || Date.now().toString();
  const objectKey = key.endsWith(".json") ? key : `${key}.json`;
  return objectKey;
}

function getPutObjectParams({ name, data }) {
  const objectKey = getObjectKey(name);
  return {
    Bucket: bucketName,
    Key: objectKey,
    Body: JSON.stringify(data) || {},
    ACL: "public-read",
    ContentType: "application/json"
  };
}

async function saveProjectJSON(requestBody) {
  try {
    const params = getPutObjectParams(requestBody);
    await s3.putObject(params).promise();
    return {
      url: `https://s3-${region}.amazonaws.com/${params.Bucket}/${params.Key}`
    };
  } catch (e) {
    console.log(e);
    return e.message;
  }
}

async function removeProjectJSON(fileName) {
  const objectKey = getObjectKey(fileName);
  var params = {
    Bucket: bucketName,
    Key: objectKey
  };

  try {
    await s3.deleteObject(params).promise();
    return { message: `${objectKey} deleted` };
  } catch (e) {
    return e;
  }
}
