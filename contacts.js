const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const chalk = require("chalk");

const contactsPath = path.join(__dirname, "/db/contacts.json");

const readContacts = async () => {
  const res = await fs.readFile(contactsPath, "utf8");

  try {
    const contacts = JSON.parse(res);
    return contacts;
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};

// TODO: задокументировать каждую функцию
async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const [res] = contacts.filter((contact) => String(contact.id) === contactId);
  return res;
}

async function removeContact(contactId) {
  const contacts = await readContacts();

  const removedContacts = contacts.filter(
    (contact) => String(contact.id) !== contactId
  );
  if (removedContacts.length !== contacts.length) {
    await fs.writeFile(contactsPath, JSON.stringify(removedContacts, null, 2));
    console.log(chalk.yellowBright("Contact removed!"));
  } else {
    console.log(chalk.red("No such Contact found!"));
  }

  return removedContacts;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
