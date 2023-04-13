INSERT INTO department (name)
VALUES ('Sales'),
        ('Billing'),
        ('Customer Service');

INSERT INTO role (title, salary, department_id)
   VALUES  ('Sales Manager', 200, 1),
        ('Sales Rep', 100, 1),
        ('Billing Specialist', 100, 2),
        ('Billing Manager', 200, 2),
        ('Customer Relations Rep', 100, 3),
        ('Customer Service Manager', 200, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Danny', 'Clark',1, NULL),
        ('John', 'Doe', 2, 1),
        ('Vinnie', 'Lopez', 4, NULL),
        ('James', 'Smith', 3, 3),
        ('Eric', 'Bradburn', 6, NULL),
        ('David', 'Bailey', 5, 5);
