INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Engineering'),
  ('Finance');

INSERT INTO roles (title, salary, department_id) VALUES
  ('Sales Manager', 100000, 1),
  ('Sales Representative', 60000, 1),
  ('Marketing Manager', 90000, 2),
  ('Marketing Coordinator', 50000, 2),
  ('Software Engineer', 120000, 3),
  ('DevOps Engineer', 110000, 3),
  ('Financial Analyst', 80000, 4),
  ('Accountant', 70000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Doe', 2, 1),
  ('Bob', 'Smith', 3, NULL),
  ('Mary', 'Johnson', 4, 3),
  ('Alice', 'Lee', 5, NULL),
  ('David', 'Kim', 6, 5),
  ('Karen', 'Chen', 7, NULL),
  ('Mike', 'Wu', 8, 7);
