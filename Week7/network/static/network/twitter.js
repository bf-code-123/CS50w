//need to have this at the top
document.addEventListener('DOMContentLoaded', function() {
    load_posts();
  
    // perform these actions when the compose form is submitted:
    document.querySelector('#post-form').addEventListener('click', () => new_post());

    document.querySelector('#edit').addEventListener('click', () => edit_text());

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
    //clear the post details
    document.querySelectorAll('#post_view').innerHTML = '';

    //create the post div
    var all_posts = document.createElement('div');
    all_posts.setAttribute("class","container");
    document.querySelector('#post_view').append(all_posts);

    fetch('/load')

    .then(response => response.json())
    .then(posts => {
        // Print posts
        console.log(posts);

        // for each post
        for (i = 0; i < posts.length; i++) {
            //make a row for each post
            const post = document.createElement('div');
            post.setAttribute("class","container-lg border p-3");
            //add to all posts div
            all_posts.appendChild(post);

            //populate the table in each row
            var cell = document.createElement('div');
            cell.setAttribute("class","col-sm");
            cell.innerHTML = post[i].creator;
            post.appendChild(cell);

            var cell = document.createElement('div');
            cell.setAttribute("class","col-sm");
            cell.innerHTML = post[i].content;
            post.appendChild(cell);  

            var cell = document.createElement('div');
            cell.setAttribute("class","col-sm");
            cell.innerHTML = emails[i].datetime;
            post.appendChild(cell);
            
            const edit_button = document.createElement('div');
            edit_button.setAttribute("class","btn btn-primary");
            //edit_button.setAttribute("id",emails[i].id)
            edit_button.innerHTML = "Edit"
            post.appendChild(edit_button);
            }

        })

    }

function edit_text() {
    const content = document.querySelector("#post_content");
    content.innerHTML == "edited!";
}
