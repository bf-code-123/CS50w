document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(email) {

  email = email || '';

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

  recipients_field.setAttribute("value",`${email.sender}`);
  subject_field.setAttribute("value",`Re: ${email.subject}`);
  //can't figure this out
  body_field.setAttribute("value",`On .. wrote ${email.body}`);


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

    //load the mailbox after email successfully sent (with delay)
    setTimeout(function(){ 
      load_mailbox('sent'); 
    }, 100);

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

          //make a row for each email (which will have 2 columns)
          const email = document.createElement('div');
          email.setAttribute("class","row email_box");
          //add to inbox div
          inbox.appendChild(email);
          
          //make a column for details for each email row
          const email_info = document.createElement('div');
          email_info.setAttribute("class","col-10");
          //add to email row
          email.appendChild(email_info);

          //give total email div the same ID as the email in the div
          email.setAttribute("id",emails[i].id);

          //adding extra row within the first column in preparation of the three data columns
          const extra_row = document.createElement('div');
          extra_row.setAttribute("class","row");
          //add to email details column
          email_info.appendChild(extra_row);

          //make a column for archive button
          const archive_button_div = document.createElement('div');
          archive_button_div.setAttribute("class","col");
          //add to email row
          email.appendChild(archive_button_div);

          //color the div depending on status of read/unread attribute
          if (emails[i].read === true) {
            email.style.backgroundColor = "grey";
          }
          else if (emails[i].read === false) {
            email.style.backgroundColor = "white";
          }

          //populate the table in each row
          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].sender;
          extra_row.appendChild(cell);

          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].subject;
          extra_row.appendChild(cell);  

          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].timestamp;
          extra_row.appendChild(cell);
          
          const archive_button = document.createElement('div');
          archive_button.setAttribute("class","btn btn-primary");
          archive_button.setAttribute("id",emails[i].id)
          archive_button.innerHTML = "Archive"
          archive_button_div.appendChild(archive_button);

          //add an event listener to show email details if row is clicked
          email_info.onclick = () => {
            //hide both other views
            document.querySelector('#compose-view').style.display = 'none';
            document.querySelector('#emails-view').style.display = 'none';
            document.querySelector('#email-details-view').style.display = 'block';

            //update read field from email to be read == true
            fetch(`/emails/${email.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  read: true
              })
            })

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
                document.querySelector('#email-details-view').appendChild(details);

                //populate email details
                const sender = document.createElement('text');
                const recipient = document.createElement('text');
                const subject = document.createElement('text');
                const body = document.createElement('text');
                const timestamp = document.createElement('text');
                const space1 = document.createElement('br');
                const space2 = document.createElement('br');
                const space3 = document.createElement('br');
                const space4 = document.createElement('br');
                const space5 = document.createElement('br');
                const space6 = document.createElement('br');
                //make reply button
                const reply_button = document.createElement('button');
                reply_button.setAttribute("class", "btn btn-sm btn-outline-primary");
                reply_button.setAttribute("id","reply");
                reply_button.innerHTML = ("Reply");
                //space for body
                const body_space = document.createElement('hr');

                sender.innerHTML = (`From: ${email.sender}`);
                recipient.innerHTML = (`To: ${email.recipients}`);
                subject.innerHTML = (`Subject: ${email.subject}`);
                body.innerHTML = (`Body: ${email.body}`);
                timestamp.innerHTML = (`Timestamp: ${email.timestamp}`);
                
                document.querySelector('#email_details').appendChild(space1);
                document.querySelector('#email_details').appendChild(sender);
                document.querySelector('#email_details').appendChild(space2);
                document.querySelector('#email_details').appendChild(recipient);
                document.querySelector('#email_details').appendChild(space3);
                document.querySelector('#email_details').appendChild(subject);
    
                document.querySelector('#email_details').appendChild(space4);
                document.querySelector('#email_details').appendChild(timestamp);
                document.querySelector('#email_details').appendChild(space5);

                document.querySelector('#email_details').appendChild(reply_button);

                document.querySelector('#email_details').appendChild(body_space);
                document.querySelector('#email_details').appendChild(body);

                //reply function
                document.querySelector('#reply').addEventListener('click', () => compose_email(email));

            });
          }

          archive_button.onclick = () => {
            fetch(`/emails/${email.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: true
              })
            })
            setTimeout(function(){ 
              load_mailbox('inbox'); 
            }, 100);
          }
        }
    })
  }
  else if (mailbox === 'sent'){
    //clear the email details
    document.querySelectorAll('#email_details').innerHTML = '';
    document.querySelector('#email-details-view').innerHTML = '';
    
    //create the inbox
    var inbox = document.createElement('div');
    inbox.setAttribute("class","container");
    document.querySelector('#emails-view').append(inbox);
    
    fetch('/emails/sent')

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
          cell.innerHTML = emails[i].recipients;
          email.appendChild(cell);
          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].subject;
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
                document.querySelector('#email-details-view').appendChild(details);

                //populate email details
                const sender = document.createElement('text');
                const recipient = document.createElement('text');
                const subject = document.createElement('text');
                const body = document.createElement('text');
                const timestamp = document.createElement('text');
                const space1 = document.createElement('br');
                const space2 = document.createElement('br');
                const space3 = document.createElement('br');
                const space4 = document.createElement('br');
                const space5 = document.createElement('br');
                const space6 = document.createElement('br');
                //make reply button
                const reply_button = document.createElement('button');
                reply_button.setAttribute("class", "btn btn-sm btn-outline-primary");
                reply_button.setAttribute("id","reply");
                reply_button.innerHTML = ("Reply");
                //space for body
                const body_space = document.createElement('hr');

                sender.innerHTML = (`From: ${email.sender}`);
                recipient.innerHTML = (`To: ${email.recipients}`);
                subject.innerHTML = (`Subject: ${email.subject}`);
                body.innerHTML = (`Body: ${email.body}`);
                timestamp.innerHTML = (`Timestamp: ${email.timestamp}`);
                
                document.querySelector('#email_details').appendChild(space1);
                document.querySelector('#email_details').appendChild(sender);
                document.querySelector('#email_details').appendChild(space2);
                document.querySelector('#email_details').appendChild(recipient);
                document.querySelector('#email_details').appendChild(space3);
                document.querySelector('#email_details').appendChild(subject);
    
                document.querySelector('#email_details').appendChild(space4);
                document.querySelector('#email_details').appendChild(timestamp);
                document.querySelector('#email_details').appendChild(space5);

                document.querySelector('#email_details').appendChild(reply_button);

                document.querySelector('#email_details').appendChild(body_space);
                document.querySelector('#email_details').appendChild(body);

                //reply function
                document.querySelector('#reply').addEventListener('click', () => compose_email(email));

            });
          }
        }
    })
  }
  else if (mailbox === 'archive') {
    document.querySelector('#emails-view').innerHTML = `<h4> Archived Mail </h4>`;
    //clear the email details
    document.querySelectorAll('#email_details').innerHTML = '';
    document.querySelector('#email-details-view').innerHTML = '';
    
    //create the inbox
    var inbox = document.createElement('div');
    inbox.setAttribute("class","container");
    document.querySelector('#emails-view').append(inbox);
    
    fetch('/emails/archive')

    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

        // for each email
        for (i = 0; i < emails.length; i++) {

          //make a row for each email (which will have 2 columns)
          const email = document.createElement('div');
          email.setAttribute("class","row email_box");
          //add to inbox div
          inbox.appendChild(email);
          
          //make a column for details for each email row
          const email_info = document.createElement('div');
          email_info.setAttribute("class","col-10");
          //add to email row
          email.appendChild(email_info);

          //give total email div the same ID as the email in the div
          email.setAttribute("id",emails[i].id);

          //adding extra row within the first column in preparation of the three data columns
          const extra_row = document.createElement('div');
          extra_row.setAttribute("class","row");
          //add to email details column
          email_info.appendChild(extra_row);

          //make a column for archive button
          const archive_button_div = document.createElement('div');
          archive_button_div.setAttribute("class","col");
          //add to email row
          email.appendChild(archive_button_div);

          //color the div depending on status of read/unread attribute
          if (emails[i].read === true) {
            email.style.backgroundColor = "grey";
          }
          else if (emails[i].read === false) {
            email.style.backgroundColor = "white";
          }

          //populate the table in each row
          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].sender;
          extra_row.appendChild(cell);

          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].subject;
          extra_row.appendChild(cell);  

          var cell = document.createElement('div');
          cell.setAttribute("class","col-sm");
          cell.innerHTML = emails[i].timestamp;
          extra_row.appendChild(cell);
          
          const archive_button = document.createElement('div');
          archive_button.setAttribute("class","btn btn-primary");
          archive_button.setAttribute("id",emails[i].id)
          archive_button.innerHTML = "Unarchive"
          archive_button_div.appendChild(archive_button);

          //add an event listener to show email details if row is clicked
          email_info.onclick = () => {
            //hide both other views
            document.querySelector('#compose-view').style.display = 'none';
            document.querySelector('#emails-view').style.display = 'none';
            document.querySelector('#email-details-view').style.display = 'block';

            //update read field from email to be read == true
            fetch(`/emails/${email.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  read: true
              })
            })

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
                document.querySelector('#email-details-view').appendChild(details);

                //populate email details
                const sender = document.createElement('text');
                const recipient = document.createElement('text');
                const subject = document.createElement('text');
                const body = document.createElement('text');
                const timestamp = document.createElement('text');
                const space1 = document.createElement('br');
                const space2 = document.createElement('br');
                const space3 = document.createElement('br');
                const space4 = document.createElement('br');
                const space5 = document.createElement('br');
                const space6 = document.createElement('br');
                //make reply button
                const reply_button = document.createElement('button');
                reply_button.setAttribute("class", "btn btn-sm btn-outline-primary");
                reply_button.setAttribute("id","reply");
                reply_button.innerHTML = ("Reply");
                //space for body
                const body_space = document.createElement('hr');

                sender.innerHTML = (`From: ${email.sender}`);
                recipient.innerHTML = (`To: ${email.recipients}`);
                subject.innerHTML = (`Subject: ${email.subject}`);
                body.innerHTML = (`Body: ${email.body}`);
                timestamp.innerHTML = (`Timestamp: ${email.timestamp}`);
                
                document.querySelector('#email_details').appendChild(space1);
                document.querySelector('#email_details').appendChild(sender);
                document.querySelector('#email_details').appendChild(space2);
                document.querySelector('#email_details').appendChild(recipient);
                document.querySelector('#email_details').appendChild(space3);
                document.querySelector('#email_details').appendChild(subject);
    
                document.querySelector('#email_details').appendChild(space4);
                document.querySelector('#email_details').appendChild(timestamp);
                document.querySelector('#email_details').appendChild(space5);

                document.querySelector('#email_details').appendChild(reply_button);

                document.querySelector('#email_details').appendChild(body_space);
                document.querySelector('#email_details').appendChild(body);

                //reply function
                document.querySelector('#reply').addEventListener('click', () => compose_email(email));

            });
          }

          archive_button.onclick = () => {
            fetch(`/emails/${email.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: false
              })
            })
            setTimeout(function(){ 
              load_mailbox('inbox'); 
            }, 100);
          }
        }
    })
  }
}