//need to have this at the top
document.addEventListener('DOMContentLoaded', function() {
    load_posts();
  
    // perform these actions when the compose form is submitted:
    document.querySelector('#post-form').onsubmit = () => {
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

    function edit_text() {
        const content = document.querySelector("#post_content");
        content.innerHTML == "edited!";
    }

    function load_posts() {
    //TODO
    }
});



