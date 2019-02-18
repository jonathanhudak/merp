# Merp

## Notes

```sql

// Create
CREATE TABLE projects (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, data json);

// Add
INSERT INTO projects VALUES (1, 'foo', '{ "sections": [] }');

// Update
UPDATE projects SET data '{ "sections": [1,2,3,4] }' WHERE id = 1;

// Query Sections
SELECT id, data->>'sections' AS sections FROM projects;

// Query Sections
SELECT * FROM projects WHERE data->>'sections' = '[]';
```

### Reference

- http://clarkdave.net/2013/06/what-can-you-do-with-postgresql-and-json/
