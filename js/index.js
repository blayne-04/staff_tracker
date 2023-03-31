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
    name: 'actionSelect',
    message: 'Select which action you would like to take',
    choices: ['View Departments', 'View Roles', 
    'View Employees', 'Add Department', 'Add Role', 'Add Employee', 
    'Update Employee']
  }
]
inquirer.prompt(options)
.then(res => {
  switch(res){
    case 'View Departments':
    viewDepartments()
      break;
    case 'View Roles':
    //view roles function
      break;
    case 'View Employees':
    //view employees function
      break;
    case 'Add Department':
    //add department function
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

function viewDepartments(){
  db.query(`SELECT name FROM department`, (err, data) => {
    err ? console.error(err) : console.table(data) 
  })
}
