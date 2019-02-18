require("should");
const app = require("./app");
const server = app.listen();
const request = require("supertest").agent(server);

describe("app", function() {
  after(function() {
    server.close();
  });

  describe("GET /projects", () => {
    it("returns a list of projects", done => {
      request.get("/projects").expect(200, done);
    });
  });
});
