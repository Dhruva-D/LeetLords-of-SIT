const USER = require('../models/user')
const { LeetCode } = require('leetcode-query')

const leetcode = new LeetCode();

async function handelAddNewUser(req, res) {
  const body = req.body;
  const name = body.name;
  const user = body.user;
  
  console.log(body);
  console.log(name);
  console.log(user);
  
  
  if(!user) return res.status(400).json({error: 'Enter Username'})
  if(!name) return res.status(400).json({error: 'Enter Your name'})

  const resUser = await USER.findOne({ userId: user })
  const resName = await USER.findOne({ name: name})
  
  if (resUser) {
    return res.status(400).json({error: `username already exists "${name}"`})
  } else if (resName) {
    return res.status(400).json({erro: `name already exists ${name}`})
  } 
    
  await USER.create({
    userId: body.user,
    name: body.name,
  })

  return res.json({user: body.user, name: body.name})
} 

async function handelGetUser(req, res) {
  try {
    const username = req.params.username;
    const userData = await leetcode.user(username);
    console.log(userData);
    return res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    return res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
}


module.exports = {
  handelAddNewUser,
  handelGetUser,
} 