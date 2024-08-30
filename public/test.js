fetch('http://localhost:8000/getdata')
.then((response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
})
.then((data) => {
    console.log("sowmya");
})