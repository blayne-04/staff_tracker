INSERT INTO department (id, name) VALUES
  (1, 'Sales'),
  (2, 'Marketing'),
  (3, 'Engineering'),
  (4, 'Finance');

INSERT INTO role (id, title, salary, department_id) VALUES
  (1, 'Sales Manager', 100000, 1),
  (2, 'Sales Representative', 60000, 1),
  (3, 'Marketing Manager', 90000, 2),
  (4, 'Marketing Coordinator', 50000, 2),
  (5, 'Software Engineer', 120000, 3),
  (6, 'DevOps Engineer', 110000, 3),
  (7, 'Financial Analyst', 80000, 4),
  (8, 'Accountant', 70000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
  (1, 'John', 'Doe', 1, NULL),
  (2, 'Jane', 'Doe', 2, 1),
  (3, 'Bob', 'Smith', 3, NULL),
  (4, 'Mary', 'Johnson', 4, 3),
  (5, 'Alice', 'Lee', 5, NULL),
  (6, 'David', 'Kim', 6, 5),
  (7, 'Karen', 'Chen', 7, NULL),
  (8, 'Mike', 'Wu', 8, 7);
