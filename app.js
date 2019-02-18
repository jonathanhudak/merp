const Koa = require("koa");
const koaBody = require("koa-body");
const Router = require("koa-router");
const { PORT = 3000 } = process.env;
const app = (module.exports = new Koa());
const router = new Router();

const { createProject, getProjects, deleteProject } = require("./lib/database");

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
  if (!requestBody.data) {
    ctx.throw(400, "data param is required");
  }
  ctx.body = await createProject(requestBody);
});

router.del("/projects/:id", async (ctx, next) => {
  ctx.body = await deleteProject(ctx.params.id);
});

router.get("/projects", async (ctx, next) => {
  ctx.body = await getProjects();
});

if (!module.parent) app.listen(PORT);
