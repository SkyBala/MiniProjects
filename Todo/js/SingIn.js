
const loginForm = document.querySelector(".login-form");
const loginEmail = document.querySelector(".userEmail");
const loginPassword = document.querySelector(".password");



const fetchAllUsers = async () => {
    try {
        const response = await fetch("https://6570538609586eff66412160.mockapi.io/todo/api/v1/Login");
        const users = await response.json();
        return users.find(item => item.email === loginEmail.value && item.password === loginPassword.value);
    } catch (error) {
        console.error(error);
    }
};


const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    const user = await fetchAllUsers();

    if (user && loginEmail.value !== "" || loginPassword.value !== "") {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.replace("../pages/todo.html");
    } else {
        alert("Invalid login or password");
    }
};


loginForm.addEventListener("submit", handleLoginFormSubmit);
