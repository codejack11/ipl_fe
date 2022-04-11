var jwt = localStorage.getItem("jwt");
if (jwt != null) {
    window.location.href = './index.html'
}

function register() {
    const fname = document.getElementById("fname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", BASE_URL + "api/users/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "email": email,
        "password": password,
        "name": fname
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            if (this.status == 201) {
                localStorage.setItem("jwt", objects['data']['token']);
                localStorage.setItem("email", objects['data']['email']);
                localStorage.setItem("name", objects['data']['name']);
                localStorage.setItem("id", objects['data']['id']);
                Swal.fire({
                    text: objects['message'],
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = './index.html';
                    }
                });
            } else {
                Swal.fire({
                    text: objects['message'],
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };
    return false;
}