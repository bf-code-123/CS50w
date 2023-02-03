function post(post) {

    post = post || '';

    //not sure what these do
    const content = document.querySelector('#post-content')
    content.setAttribute("value",`${post.content}`);

    // perform these actions when the compose form is submitted:
    document.querySelector('#post-form').onsubmit = () => {
        const content = content.value;

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
  }
}

function edit_text() {
    const content = document.querySelector("#post_content");
    content.innerHTML == "edited!";
}


