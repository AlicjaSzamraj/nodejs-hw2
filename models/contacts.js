const Contact = require("./contact");

const listContacts = async () => {
  console.log("Fetching contacts from database...");
  const contacts = await Contact.find();
  console.log("Fetched contacts:", contacts);
  return contacts;
};

const getContactById = async (contactId) => {
  console.log(`Fetching contact with ID ${contactId}`);
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  console.log(`Removing contact with ID ${contactId}`);
  return await Contact.findByIdAndRemove(contactId);
};

const addContact = async (body) => {
  console.log("Adding new contact:", body);
  return await Contact.create(body);
};

const updateContact = async (contactId, body) => {
  console.log(`Updating contact with ID ${contactId}`, body);
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
