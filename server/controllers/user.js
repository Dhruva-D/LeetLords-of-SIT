const USER = require('../models/user')

async function handelAddNewUser(req, res) {
  const body = req.body;
  const user = body.user;
  const name = body.name;
  
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

module.exports = {
  handelAddNewUser,
}  