const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'mysql123',
        database: 'cms_db'
    },
    console.log(`Connected to the cms_db database.`)
);

function start() {
    inquirer
        .prompt([

            {
                type: 'list',
                message: 'Which of the following options would you like to do?',
                name: 'options',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit'],
            },
        ])
        .then((data) => {
            switch (data.options) {
                case 'view all departments':
                    viewDepartments()
                    break;
                case 'view all roles':
                    viewRoles()
                    break;
                case 'view all employees':
                    viewEmployees()
                    break;
                case 'add a department':
                    addDepartment()
                    break;
                case 'add a role':
                    addRole()
                    break;
                case 'add an employee':
                    addEmployee()
                    break;
                case 'update an employee role':
                    updateRole()
                    break;
                default:
                    process.exit()

            }
        });
}


function viewDepartments() {
    // WHEN I choose to view all departments
    // THEN I am presented with a formatted table showing department names and department ids
    db.query('SELECT * FROM department;', function (err, results) {
        console.table(results);
        start()
    });

}

function viewRoles() {
    // WHEN I choose to view all roles
    // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
    db.query('SELECT role.title, role.id, department.name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;', function (err, results) {
        console.table(results);
        start()
    });
}

function viewEmployees() {
    // WHEN I choose to view all employees
    // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    // fix managers names

    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.first_name, manager.last_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id;', function (err, results) {
        console.table(results);
        start()
    });
}

function addDepartment() {
    // WHEN I choose to add a department
    // THEN I am prompted to enter the name of the department and that department is added to the database
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department to be added?'
            }
        ]).then((data) => {
            db.query(`INSERT INTO department (name) VALUES ('${data.department}');`, function (err, results) {
                console.table(results);
                start()
            })
        })

}

function addRole() {
    // WHEN I choose to add a role
    // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the role to be added?'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary of the role to be added?'
            },
            {
                type: 'input',
                name: 'roleDepartment',
                message: 'What is the name of the department for the role to be added?'
            }
        ]).then((data) => {
            db.query(`INSERT INTO role (title, salary) VALUES ('${data.roleName}, ${data.roleSalary}'); INSERT INTO department (name)`, function (err, results) {
                console.table(results);
                start()
            })
        })

}

function addEmployee() {
    // WHEN I choose to add an employee
    // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
}

function updateRole() {
    // WHEN I choose to update an employee role
    // THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
}


start()




