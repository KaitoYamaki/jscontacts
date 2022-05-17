const models = require('../models'); // --- [1]

async function createContact(){ // --- [2]
  const num = (new Date()).getTime(); // --- [3]
  const contact = models.Contact.build({ name: `test${num}`, email: `${num}@example.com`}); // --- [4]
  console.log(contact);
  await contact.save(); // --- [5]
}

createContact(); // --- [6]