const Koa = require("koa");
const koaBody = require("koa-body");
const AWS = require("aws-sdk");
const bucketName = "anni-jmh";
const Router = require("koa-router");

const { PORT = 3000 } = process.env;
const app = new Koa();
const s3 = new AWS.S3();
const router = new Router();

async function saveJSONFile(
  fileName = "database.json",
  Body = '{ "foo": "bar" }'
) {
  var params = {
    Bucket: bucketName,
    Key: fileName,
    Body,
    ACL: "public-read",
    region: "us-west-2"
  };
  await s3.putObject(params, function(err, data) {
    if (err) console.log(err);
    else
      console.log(
        "Successfully uploaded data to " + bucketName + "/" + fileName
      );
  });
}

app
  .use(
    koaBody({
      jsonLimit: "1kb"
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());

// app.use(async ctx => {
//   const body = ctx.request.body;
//   console.log(body.name);
//   if (!body.name) ctx.throw(400, ".name required");
//   ctx.body = { name: body.name.toUpperCase() };
// });

router.post("/projects", async (ctx, next) => {
  const body = ctx.request.body;
  await saveJSONFile(body.name, JSON.stringify(body.data));
  ctx.body = "done?";
});

app.listen(PORT);
