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
    choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee', 'Exit']
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
      //add employee function
        break;
      case 'Update Employee':
      //update employee function
        break;
      case 'Exit': 
      db.end()
        console.log('Goodbye!')
        break;
    }
  }).catch(err => {
    console.log(err)
  })
}

menu()

function exit(){
  inquirer.prompt([
    {
      type: 'input',
      name: 'mainMenu',
      message: 'Press Enter To Exit The Program'
    }
  ]).then((res) => {
    console.log('\nGoodbye')
    process.exit()
  })
}

//db query for department names
function viewDepartments(){
  db.query(`SELECT name FROM departments`, (err, data) => {
    err ? console.error(err) : console.table(data); exit()
  })
}
//db query for role information
function viewRoles(){
  db.query(`SELECT * FROM roles`, (err, data) => {
    err? console.error(err) : console.table(data); exit()
  })
}

function viewEmployees(){
  db.query('SELECT * FROM employees', (err, data) => {
    err? console.error(err) : console.table(data); exit()
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

function DepIdFetch(callback){
  let depList
  db.query('SELECT id, name FROM departments', (err, data) => {
    err ? console.error(err) : 
    depList = data.map(({id, name}) => ({value: id, name: name}));
    callback(depList);
  })
}

function addRole(){
  const roleRegex = /^[a-zA-Z0-9-]{1,30}$/
  DepIdFetch((depList) => { 
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
    console.log(depList)
    inquirer.prompt(roleQuery)
    .then((res) => {
      db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [res.roleQuery, res.salary, res.depId], (err, data) => {
        err ? console.error(err) : viewRoles();
      })
    })
  })
}

function addEmployee(){  }