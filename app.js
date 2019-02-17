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

async function saveProjectJSON(fileName, Body = "{}") {
  const objectKey = getObjectKey(fileName);
  var params = {
    Bucket: bucketName,
    Key: objectKey,
    Body,
    ACL: "public-read",
    ContentType: "application/json"
  };

  try {
    await s3.putObject(params).promise();
    return {
      url: `https://s3-${region}.amazonaws.com/${bucketName}/${objectKey}`
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
  const body = ctx.request.body;
  ctx.body = await saveProjectJSON(body.name, JSON.stringify(body.data));
});

router.del("/projects/:key", async (ctx, next) => {
  const body = ctx.request.body;
  ctx.body = await removeProjectJSON(ctx.params.key);
});

app.listen(PORT);
