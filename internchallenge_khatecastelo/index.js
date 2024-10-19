const express = require('express'); //importing express modules
const fs = require('fs'); //interacting with file systems
const path = require('path'); //for file path operations
const csv = require('csv-parser'); //to take in csv files

//declaring express applications
const app = express();

//declaring port
const PORT = 5000;

//array to store data in memory
let employees = []; 

//declaring csvData too access the file and retrieve employee data
const csvData = () => 
{
    const filePath = path.join(__dirname, 'data.csv'); //path to csv files
    fs.createReadStream(filePath) //reading file stream 
    .pipe(csv()) //parsing csv
    .on('data', (row) => {
        employees.push({
            id: Number(row.id),
            name: row.name,
            email: row.email,
            position: row.position,
            salary: Number(row.salary),
        });
        
    })
    //if successful, print out confirmation and data of csv in console
    .on('end', () => {
        console.log(`******************************************`);
        console.log('CSV successfully accessed');
        console.log(`******************************************`);
        console.log(employees);
    })
    //error handling if unsucccessful
    .on('error', (error) => {
        console.error('CSV unsuccessfully accessed: ', error.message);
    });
};

//loading CSV file 
csvData(); 

// the home page of localhost:5000
app.get('/', (req, res) => {
    res.send('Welcome to your Express server!');
});

//GET employees 
app.get('/employees', (req,res) => {
    res.json(employees); //responds with a list of employees in .JSON format
});

//retrieving employee details by id, ie: localhost:5000/employees/1 = employee 1 details
app.get('/employees/:id', (req, res) => {

    //retrieves id parameter
    const employeeId = Number(req.params.id);

    //using find to search in employees array with matching ID
    const employee = employees.find(emp => emp.id === employeeId);

    //if employee is found, display their details
    if(employee)
    {
        res.json(employee);
    }
    //if employee is not found
    else
    {
        res.json({message: 'Employee not found'}); 
    }
})

//confirmation that server has started and is listening on port 50000
app.listen(PORT, () => {
    console.log(`******************************************`);
    console.log(`Server is running on http://localhost:${PORT}`);
});


