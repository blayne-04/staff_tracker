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
    choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee']
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
      //add role function
        break;
      case 'Add Employee':
      //add employee function
        break;
      case 'Update Employee':
      //update employee function
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
      message: 'Type Y to return to the options menu, Type N to exit the program'
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
      err ? console.error(err) : viewDepartments(); menuReturn()
    })
  }) .catch(err => {console.error(err)})
}