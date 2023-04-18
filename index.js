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
    
    db.query('SELECT * FROM department;', function (err, results) {
        console.table(results);
        start()
    });

}

function viewRoles() {
    
    db.query('SELECT role.title, role.id, department.name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;', function (err, results) {
        console.table(results);
        start()
    });
}
function viewEmployees() {
    
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary,CONCAT(manager.first_name, " ", manager.last_name) AS managerName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id;', function (err, results) {
        console.table(results);
        start()
    });
}

function addDepartment() {
   
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

    db.query('SELECT * FROM department;', function (err, results) {
        const departmentList = results.map(({ id, name }) => ({
            name: name,
            value: id
        }))


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
                    type: 'list',
                    name: 'roleDepartment',
                    message: 'What is the name of the department for the role to be added?',
                    choices: departmentList
                }
            ]).then((data) => {
                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`,
                    [data.roleName, data.roleSalary, data.roleDepartment], function (err, results) {
                        console.log('new role has been added');
                        start()
                    })
            })
    });

}

function addEmployee() {
    
    db.query('SELECT * from employee', (err, results) => {
        const employeeList = results.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))

        employeeList.unshift({ name: 'No Manager', value: null })

        db.query('SELECT * from role', (err, results) => {
            const roleList = results.map(({ id, title }) => ({
                name: title,
                value: id
            }))

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'employeeFirst',
                        message: 'What is the first name of the employee to be added?'
                    },
                    {
                        type: 'input',
                        name: 'employeeLast',
                        message: 'What is the last name of the employee to be added?'
                    },
                    {
                        type: 'list',
                        name: 'employeeRole',
                        message: 'What is the role of the employee to be added?',
                        choices: roleList
                    },
                    {
                        type: 'list',
                        name: 'employeeManagerId',
                        message: `Who is their Manager?`,
                        choices: employeeList
                    }
                ]).then((data) => {
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,[data.employeeFirst, data.employeeLast, data.employeeRole, data.employeeManagerId], function (err, results) {
                        console.table('New employee added');
                        start()
                    })
                })


        })
    })

}

function updateRole() {
    
    db.query('SELECT * from employee', (err, results) => {
        const employeeList = results.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))

        db.query('SELECT * from role', (err, results) => {
            const roleList = results.map(({ id, title }) => ({
                name: title,
                value: id
            }))

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeName',
                        message: "Who's role would you like to change?",
                        choices: employeeList
                    },
                  
                    {
                        type: 'list',
                        name: 'employeeRole',
                        message: 'What is the new role?',
                        choices: roleList
                    },
                    
                ]).then((data) => {
                    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`,[data.employeeRole, data.employeeName], function (err, results) {
                        console.table('Role updated');
                        start()
                    })
                })


        })
    })
}


start()




