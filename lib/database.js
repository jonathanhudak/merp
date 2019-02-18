const { Pool, Client } = require("pg");

const dbConfig =
  process.env.NODE_ENV === "development"
    ? require("../up.json").environment
    : process.env;

async function createDatabaseClient() {
  const client = new Client({
    user: dbConfig.PGUSER,
    host: dbConfig.PGHOST,
    database: dbConfig.PGDATABASE,
    password: dbConfig.PGPASSWORD,
    port: dbConfig.PGPORT
  });

  await client.connect();

  return client;
}

async function ensureProjectsTableCreated(client) {
  const text =
    "CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, data json);";
  await client.query(text);
}

async function createProject({ name, data }) {
  const text = "INSERT INTO projects(name, data) VALUES($1, $2) RETURNING *";
  const values = [name, JSON.stringify(data)];
  try {
    const client = await createDatabaseClient();

    await ensureProjectsTableCreated(client);

    const res = await client.query(text, values);

    return res.rows;
  } catch (e) {
    console.log(e.stack);
    return e.message;
  }
}

async function getProjects() {
  const text = "SELECT * FROM projects";
  try {
    const client = await createDatabaseClient();

    await ensureProjectsTableCreated(client);

    const res = await client.query(text);

    return res.rows;
  } catch (e) {
    console.log(e.stack);
    return e.message;
  }
}

async function deleteProject(id) {
  const text = "DELETE FROM projects WHERE id = $1 RETURNING *";
  try {
    const client = await createDatabaseClient();

    await ensureProjectsTableCreated(client);

    const res = await client.query(text, [id]);

    return { message: `Project id: "${id}" deleted.` };
  } catch (e) {
    console.log(e.stack);
    return e.message;
  }
}

module.exports = {
  createProject,
  getProjects,
  deleteProject
};
