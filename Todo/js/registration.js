const registerForm = document.querySelector(".Register-form");
const regUsername = document.querySelector(".username");
const regEmail = document.querySelector(".userEmail");
const regPassword = document.querySelector(".password");
const regConfirmPassword = document.querySelector(".passwordCheck");

const getUserId = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData ? userData.id : null;
};

console.log(getUserId());

const registerUser = async (email, username, password) => {
    const user = { username, email, password };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    };

    try {
        const response = await fetch("https://6570538609586eff66412160.mockapi.io/todo/api/v1/Login", options);
        const userData = await response.json();

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(userData));
            window.location.replace("../pages/todo.html");
        } else {
            console.error(`Failed to register user. Status: ${response.status}`);
        }
    } catch (e) {
        console.error(e);
    }
};

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (regPassword.value === regConfirmPassword.value && regEmail.value !== "" || regConfirmPassword.value !== "" || regPassword.value !== "" || regUsername.value !== "" ) {
        await registerUser(regEmail.value, regUsername.value, regPassword.value);
    } else {
        console.error("Password and confirm password do not match.");
    }
});
