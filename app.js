const Koa = require("koa");
const koaBody = require("koa-body");
const AWS = require("aws-sdk");
const Router = require("koa-router");

const { PORT = 3000 } = process.env;
const app = new Koa();
const s3 = new AWS.S3();
const router = new Router();
const bucketName = "annij";
const region = "us-west-2";

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
    Body: data || {},
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

app
  .use(
    koaBody({
      jsonLimit: "100kb"
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());

router.post("/projects", async (ctx, next) => {
  const requestBody = ctx.request.body;
  if (typeof requestBody.data !== "string") {
    ctx.throw(400, "Expected data param to be a string");
  }
  ctx.body = await saveProjectJSON(requestBody);
});

router.del("/projects/:key", async (ctx, next) => {
  ctx.body = await removeProjectJSON(ctx.params.key);
});

if (!module.parent) app.listen(PORT);

module.exports = {
  app,
  getPutObjectParams
};
