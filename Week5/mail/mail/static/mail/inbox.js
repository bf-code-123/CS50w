document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  //select inputs and submit button to be used later:
  const newRecipient = document.querySelector('#compose-recipients');
  const newSubject = document.querySelector('#compose-subject');
  const newBody = document.querySelector('#compose-body');
  const newSubmit = document.querySelector('#compose_submit');

  // Disable submit button by default:
  //submit.disable = true;

  document.querySelector('#compose-view').onsubmit = () => {

    const recipient = newRecipient.value;
    const subject = newSubject.value;
    const body = newBody.value;
    
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipient,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });

    recipient = '';
    subject = '';
    body = '';
  }
  // Clear out composition fields
  // document.querySelector('#compose-recipients').value = '';
  // document.querySelector('#compose-subject').value = '';
  // document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}