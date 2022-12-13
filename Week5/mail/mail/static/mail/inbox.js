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

  const recipients_field = document.querySelector('#compose-recipients');
  const subject_field = document.querySelector('#compose-subject');
  const body_field = document.querySelector('#compose-body');


  // perform these actions when the compose form is submitted:
  document.querySelector('#compose-form').onsubmit = () => {

    //store compose form values as variables for easier access
    const recipients = recipients_field.value;
    const subject = subject_field.value;
    const body = body_field.value;

    // Create a JSON object using the form's filled out values and POST it to the /emails route using fetch
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })

    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });

    // Clear out composition fields
    recipients_field.value = '';
    subject_field.value = '';
    body_field.value = '';

    //load the mailbox after email successfully sent
    load_mailbox('inbox');

    // Stop form from submitting
    return false;
    
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox') {
    // Create a table element
    const inbox_table = document.createElement('table');
    inbox_table.setAttribute("id", "inbox_table");
    inbox_table.setAttribute("class", "table");
    document.querySelector('#emails-view').append(inbox_table);
    
    // Create table row tr element of a table
    var inbox_header_row = document.createElement('tr');
    inbox_table.appendChild(inbox_header_row);

    // Create headers in first row
    var header_cols = ["sender", "body", "timestamp"];
    for (var i = 0; i < header_cols.length; i++) {
      var theader = document.createElement("th");
      theader.innerHTML = header_cols[i];
      inbox_header_row.appendChild(theader)
    }
    
    fetch('/emails/inbox')

    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

        // for each email
        for (i = 0; i < emails.length; i++) {

          //make a row
          var trow = document.createElement('tr');
          inbox_table.appendChild(trow);
          //populate the table in each row
          var cell = document.createElement('td');
          cell.innerHTML = emails[i].sender;
          trow.appendChild(cell);
          var cell = document.createElement('td');
          cell.innerHTML = emails[i].body;
          trow.appendChild(cell);
          var cell = document.createElement('td');
          cell.innerHTML = emails[i].timestamp;
          trow.appendChild(cell);

          //  can't figure out how to iterate on the second variable
          // for (j = 0; j < header_cols.length; j++) {
          //   var cell = document.createElement('td');
          //   cell.innerHTML = emails[i].sender;
          //   cell.innerHTML = emails[i].body;
          //   cell.innerHTML = emails[i].timestamp;
          //   trow.appendChild(cell);
          // }
    
        }
    })
  }
  else if (mailbox === 'sent'){
    document.querySelector('#emails-view').innerHTML = `<h4> sent test </h4>`;
  }
  else if (mailbox === 'archive') {
    document.querySelector('#emails-view').innerHTML = `<h4> archive test </h4>`;
  }




}