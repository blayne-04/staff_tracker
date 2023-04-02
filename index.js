const inquirer = require(`inquirer`);
const { default: ListPrompt } = require('inquirer/lib/prompts/list');
const mysql = require('mysql2')

require('dotenv').config()
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL Username
      user: process.env.DB_USER,
      // TODO: Add MySQL Password
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the database.`)
  );

options = [
  {
    type: 'list',
    name: 'actSel',
    message: 'Select which action you would like to take',
    choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee', 'menuReturn']
  }
]
function menu(){
  inquirer.prompt(options)
  .then(res => {
    switch(res.actSel){
      case 'View Departments':
        viewDepartments()
        break;
      case 'View Roles':
        viewRoles()
        break;
      case 'View Employees':
        viewEmployees()
        break;
      case 'Add Department':
        addDepartment()
        break;
      case 'Add Role':
        addRole()
        break;
      case 'Add Employee':
        addEmployee()
        break;
      case 'Update Employee':
      //update employee function
        break;
      case 'menuReturn': 
      db.end()
        console.log('Goodbye!')
        break;
    }
  }).catch(err => {
    console.log(err)
  })
}

menu()

function menuReturn(){
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'mainMenu',
      message: 'Enter Y to return to the options menu, Enter N to exit the program'
    }
  ]).then((res) => {
    if(res.mainMenu){
      menu()
    } else{
      console.log('Goodbye')
      process.exit()
    }
  })
}

//db query for department names
function viewDepartments(){
  db.query(`SELECT name FROM departments`, (err, data) => {
    err ? console.error(err) : console.table(data); menuReturn()
  })
}
//db query for role information
function viewRoles(){
  db.query(`SELECT * FROM roles`, (err, data) => {
    err? console.error(err) : console.table(data); menuReturn()
  })
}

function viewEmployees(){
  db.query('SELECT * FROM employees', (err, data) => {
    err? console.error(err) : console.table(data); menuReturn()
  })
}

function addDepartment(){
const dpRegex = /^[a-zA-Z0-9-]{1,30}$/;
  dpQuery = [
    {
      type: 'input',
      name: 'dpQuery',
      message: 'Enter the new department name',
      validate: (depName) => { return dpRegex.test(depName) 
        ?true : 'A department name may only include hyphens, letters, numbers <=30 characters'
      }
    }
  ]
  inquirer.prompt(dpQuery)
  .then(res => {
    db.query(`INSERT INTO departments (name) VALUES (?)`, [res.dpQuery], (err, data) => {
      err ? console.error(err) : viewDepartments()
    })
  }) .catch(err => {console.error(err)})
}

function dataFetch(depIdFetch, empIdFetch, roleIdFetch){
    let depList
    db.query('SELECT id, name FROM departments', (err, data) => {
      err ? console.log('Something happened while fetching data from departments table') : 
      depList = data.map(({id, name}) => ({value: id, name: name}));
      depIdFetch(depList);
    })
    let empList
    db.query('SELECT id, first_name, last_name FROM employees', (err, data) => {
      err ? console.log('Something happened while fetching data from employees table') : 
      empList = data.map(({id, first_name, last_name}) => ({value: id, name: `${first_name} ${last_name}`}))
      empIdFetch(empList)
    })
    let roleList
    db.query('SELECT id, title, salary FROM roles', (err, data) => {
      err ? console.log('Something happened while fetching data from roles table') : 
      roleList = data.map(({id, title, salary}) => ({value: id, name: `Title: ${title} Salary: ${salary}`}))
      roleIdFetch(roleList)
    })
}



function addRole(){
  const roleRegex = /^[a-zA-Z0-9-]{1,30}$/
  dataFetch((depList) => { 
    roleQuery = [
      {
        type: 'input',
        name: 'roleQuery',
        message: 'enter the new role name',
        validate: (roleName) => { return roleRegex.test(roleName) 
          ?true : 'A role name may only include hyphens, letters, numbers <=30 characters'
        } 
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Input the roles yearly salary in number only format',
        validate: (salary) => { return /^[0-9]+$/.test(salary)
          ?true: 'A salary must be written without special characters or spaces, example: 120000'
        }
      },
      {
        type: 'list',
        name: 'depId',
        message: 'Select a department from the list',
        choices: depList
      }
    ]
    inquirer.prompt(roleQuery)
    .then((res) => {
      db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [res.roleQuery, res.salary, res.depId], (err, data) => {
        err ? console.error(err) : viewRoles();
      })
    })
  })
}


function addEmployee(){
  dataFetch((empList, roleList) => {
    employeeQuery = [
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the new employees first name',
        validate: (empName) => { return /^[a-zA-Z]+$/.test(empName)
          ?true: 'Employee names must be written with only letters and no spaces'
        }
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the new employees last name',
        validate: (empName) => { return /^[a-zA-Z]+$/.test(empName)
          ?true: 'Employee names must be written with only letters and no spaces'
        }
      },
      {
        type: 'list',
        name: 'empRole',
        message: 'Select employee role',
        choices: roleList
      },
      {
        type: 'list',
        name: 'empManager',
        message: 'Select employees manager, null if none',
        choices: [empList, 'null']
      }
    ]
    inquirer.prompt(employeeQuery)
      .then((res) => {
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [res.first_name, res.last_name, res.empRole, res.empManager], (err, data) => {
          err ? console.error(err) : viewRoles();
        })
    })
  })
}