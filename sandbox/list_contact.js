const models = require('../models');

async function listContacts(){
  const contacts = await models.Contact.findAll(); // --- [1]
  console.log(contacts);
}

listContacts();