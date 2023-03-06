const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname,'../dev-data/data/users.json');
const userData = JSON.parse(fs.readFileSync(dataPath,'utf-8'));


const getAllUsers = (req,res) => {
    res.status(200).json({
        status : 'Success',
        results : userData.length,
        data : {
            userData
        }
    })
}

const getUser = (req,res) => {
    console.log('Get User');
}

const addNewUser = (req,res) => {
    console.log('Add new User');
}

const updateUser = (req,res) => {
    console.log('UpdateUser');
}

const deleteUser = (req,res) => {
    console.log('Delete User');
}

module.exports = {
    getAllUsers,
    getUser,
    addNewUser,
    updateUser,
    deleteUser
};