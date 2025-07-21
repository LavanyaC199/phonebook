
    //  Replace with your actual MockAPI endpoint:
   const API_URL = 'https://64ca53d8700d50e3c706e8e3.mockapi.io/contacts';


    const contactForm = document.getElementById('contactForm');
    const contactsList = document.getElementById('contactsList');
    const searchInput = document.getElementById('search');

    // Load contacts on page load
    document.addEventListener('DOMContentLoaded', fetchContacts);

    // Add new contact
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();

      if (!name || !phone) return;

      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone })
        });
        contactForm.reset();
        fetchContacts();
      } catch (err) {
        alert('Error adding contact');
      }
    });

    // Fetch all contacts
    async function fetchContacts() {
      try {
        const res = await fetch(API_URL);
        const contacts = await res.json();
        displayContacts(contacts);
      } catch (err) {
        contactsList.innerHTML = `<li>Error fetching contacts.</li>`;
      }
    }

    // Display contact list
    function displayContacts(contacts) {
      contactsList.innerHTML = '';
      contacts.forEach(contact => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${contact.name} - ${contact.phone}</span>
          <div>
            <button class="edit" onclick="editContact('${contact.id}', '${contact.name}', '${contact.phone}')">Edit</button>
            <button class="delete" onclick="deleteContact('${contact.id}')">Delete</button>
          </div>
        `;
        contactsList.appendChild(li);
      });
    }

    // Delete contact
    async function deleteContact(id) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchContacts();
      } catch (err) {
        alert('Error deleting contact.');
      }
    }

    // Edit contact
    async function editContact(id, oldName, oldPhone) {
      const name = prompt('Edit name:', oldName);
      const phone = prompt('Edit phone:', oldPhone);

      if (name && phone) {
        try {
          await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone })
          });
          fetchContacts();
        } catch (err) {
          alert('Error updating contact.');
        }
      }
    }

    // Search contacts
    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value.toLowerCase();
      try {
        const res = await fetch(API_URL);
        const contacts = await res.json();
        const filtered = contacts.filter(c =>
          c.name.toLowerCase().includes(query) || c.phone.includes(query)
        );
        displayContacts(filtered);
      } catch (err) {
        console.log('Search error');
      }
    });
  