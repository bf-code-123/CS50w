//need to have this at the top
document.addEventListener('DOMContentLoaded', function() {
    //when DOM is loaded, perform this function:
    load_posts();
  
    // perform these actions when the compose form is submitted:
    document.querySelector('#post-submit').addEventListener('click', () => new_post());

    //perform this action when edit button is clicked
    document.addEventListener('click', edit_text);
});

function new_post() {
    const content = document.querySelector('#post-content').value;

        // Create a JSON object using the form's filled out values and POST it to the /post route using fetch
        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                content: content
            })
        })

        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
        });

        // Clear out composition fields
        content = '';

        setTimeout(function(){ 
            load_posts(); 
        }, 100);

        // Stop form from submitting
        return false;
}

function load_posts() {
    console.log("load posts successful");
    //clear the post details
    document.querySelectorAll('#post_view').innerHTML = '';

    //create the post container parent div
    var all_posts = document.createElement('div');
    all_posts.setAttribute("class","container");
    document.querySelector('#post_view').append(all_posts);

    //call the load API route
    fetch('/load')

    .then(response => response.json())
    .then(posts => {
        // Print posts
        console.log(posts);

        // for each post
        posts.forEach(post => {
            //make a row container for each post
            const post_container = document.createElement('div');
            post_container.setAttribute("class","container-lg border p-3 post2");
            post_container.setAttribute("id",post.id);
            //add to all posts container div
            all_posts.appendChild(post_container);

            //populate the post details (content, creator, datetime, edit) in each post row
            var cell = document.createElement('div');
            cell.setAttribute("class","col-sm info bold");
            cell.innerHTML = post.creator;
            post_container.appendChild(cell);

            var cell = document.createElement('div');
            cell.setAttribute("class","col-sm info content");
            cell.setAttribute("id","post-content");
            cell.innerHTML = post.content;
            post_container.appendChild(cell);  

            var cell = document.createElement('div');
            cell.setAttribute("class","col-sm info small");
            cell.innerHTML = post.datetime;
            post_container.appendChild(cell);
            
            const edit_button = document.createElement('div');
            edit_button.setAttribute("class","btn btn-primary info");
            edit_button.setAttribute("id", "edit-button");
            edit_button.innerHTML = "Edit"
            post_container.appendChild(edit_button);
        });
    })
}

function edit_text(event) {
    //Find what was clicked on
        const element = event.target;

        // Check if the user clicked on a edit button
        if (element.id === 'edit-button') {
            //save old content element to variable
            old_content_element = element.previousElementSibling.previousElementSibling;
            //save old text to variable
            old_content_text = old_content_element.innerHTML;

            //populate new textarea element with old text and insert into parent element
            var cell = document.createElement('textarea');
            cell.setAttribute("id","edited-content");
            cell.innerHTML = old_content_text;
            //insert new textarea element before the datetime element
            element.parentElement.insertBefore(cell,element.previousElementSibling);

            //get rid of old content element
            old_content_element.remove()
            
            //replace edit button with save button
            const save_button = document.createElement('div');
            save_button.setAttribute("class","btn btn-primary info");
            save_button.setAttribute("id", "save-button");
            save_button.innerHTML = "Save"
            element.parentElement.appendChild(save_button);

            //remove the edit button
            element.remove();

            document.querySelector('#save-button').addEventListener('click', function() {
                //save the new content text
                const content = document.querySelector('#edited-content').value;
                console.log(content);
                //save the ID of the parent element (the post)
                const id = document.querySelector('#edited-content').parentElement.id;
                console.log(id);

                // Create a JSON object using the form's filled out values and POST it to the /post route using fetch
                fetch('/edit', {
                    method: 'POST',
                    body: JSON.stringify({
                        content: content,
                        id : id
                    })
                })

                .then(response => response.json())
                .then(result => {
                    // Print result
                    console.log(result);
                });

                setTimeout(function(){ 
                    load_posts(); 
                    console.log("TIMEOUT SUCCESSFUL");
                }, 100);

                // Stop form from submitting
                return false;
            });
        }
}
