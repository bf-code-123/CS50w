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
  document.querySelector('#email-details-view').style.display = 'none';

  //clear the email details
  document.querySelectorAll('#email_details').innerHTML = '';
  document.querySelector('#email-details-view').innerHTML = '';

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
  document.querySelector('#email-details-view').style.display = 'none';

  //clear the email details
  document.querySelectorAll('#email_details').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox') {
    // // Create a table element
    // const inbox_table = document.createElement('table');
    // inbox_table.setAttribute("id", "inbox_table");
    // inbox_table.setAttribute("class", "table");
    // document.querySelector('#emails-view').append(inbox_table);
    
    // // Create table row tr element of a table
    // var inbox_header_row = document.createElement('tr');
    // inbox_table.appendChild(inbox_header_row);

    // // Create headers in first row
    // var header_cols = ["sender", "body", "timestamp"];
    // for (var i = 0; i < header_cols.length; i++) {
    //   var theader = document.createElement("th");
    //   theader.innerHTML = header_cols[i];
    //   inbox_header_row.appendChild(theader)
    // } 

    //clear the email details
    document.querySelectorAll('#email_details').innerHTML = '';
    document.querySelector('#email-details-view').innerHTML = '';
    
    //create the inbox
    var inbox = document.createElement('div');
    inbox.setAttribute("class","container");
    document.querySelector('#emails-view').append(inbox);
    
    fetch('/emails/inbox')

    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

        // for each email
        for (i = 0; i < emails.length; i++) {

          //make a row
          const email = document.createElement('div');
          email.setAttribute("class","row email_box");
          //add to inbox div
          inbox.appendChild(email);
          
          //give div the same ID as the email in the div
          email.setAttribute("id",emails[i].id);

          //populate the table in each row
          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].sender;
          email.appendChild(cell);
          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].body;
          email.appendChild(cell);  
          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].timestamp;
          email.appendChild(cell);

          //add an event listener to show email details if row is clicked
          email.onclick = () => {
            //hide both other views
            document.querySelector('#compose-view').style.display = 'none';
            document.querySelector('#emails-view').style.display = 'none';
            document.querySelector('#email-details-view').style.display = 'block';

            //get details from 1 email, passing in the ID from the div
            fetch(`/emails/${email.id}`)
            .then(response => response.json())
            .then(email => {
                // Print email
                console.log(email);

                //create the inbox
                const details = document.createElement('div');
                details.setAttribute("class", "container");
                details.setAttribute("id", "email_details");
                details.innerHTML = ('Here are the email details:');
                document.querySelector('#email-details-view').appendChild(details);

                const sender = document.createElement('text');
                const recipient = document.createElement('text');
                const subject = document.createElement('text');
                const timestamp = document.createElement('text');
                const space1 = document.createElement('br');
                const space2 = document.createElement('br');
                const space3 = document.createElement('br');
                const space4 = document.createElement('br');
                const space5 = document.createElement('br');

                sender.innerHTML = (`Sender: ${email.sender}`);
                recipient.innerHTML = (`Recipient: ${email.recipients}`);
                subject.innerHTML = (`Subject: ${email.subject}`);
                timestamp.innerHTML = (`Timestamp: ${email.timestamp}`);
                
                document.querySelector('#email_details').appendChild(space5);
                document.querySelector('#email_details').appendChild(sender);
                document.querySelector('#email_details').appendChild(space1);
                document.querySelector('#email_details').appendChild(recipient);
                document.querySelector('#email_details').appendChild(space2);
                document.querySelector('#email_details').appendChild(subject);
                document.querySelector('#email_details').appendChild(space3);
                document.querySelector('#email_details').appendChild(timestamp);
                document.querySelector('#email_details').appendChild(space4);
            });
          }
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