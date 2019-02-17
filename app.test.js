require("should");
const { app } = require("./app");
const server = app.listen();
const request = require("supertest").agent(server);

describe("app", function() {
  after(function() {
    server.close();
  });

  describe("POST /projects", () => {
    it("expects data in the request body", done => {
      request
        .post("/projects")
        .send({})
        .expect(400, done);
    });

    it("does not expect a name in the request body", done => {
      const data = JSON.stringify({ a: 1 });
      request
        .post("/projects")
        .send({ data })
        .expect(200, done);
    });
  });
});
