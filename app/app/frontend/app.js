window.onload = (event) => {

    const routes = [
        {path: '/', handler: homeHandler},
        {path: '/index.html', handler: homeHandler},
        {path: '/login.html', handler: loginHandler},
        {path: '/signup.html', handler: signupHandler}
    ]

    handleUrlChange();


    function handleUrlChange () {
        const path = window.location.pathname;
        const urlPath = routes.find(route => route.path === path)

        if (urlPath) {
            urlPath.handler();

        } else {
            homeHandler();
        }
    }

    function homeHandler () {
        console.log("home works");
        const bookForm = document.getElementById("book-form");
        console.log(bookForm);
        const urlAddBook = 'http://127.0.0.1:5000/add_book';

        renderBooksForFiveDays ()

        logout();
        bookForm.addBookListener("submit", (book) => {
            book.preventDefault();

            sendRequestToServer(bookForm, urlAddBook);
        })
    }

    function loginHandler () {
        const loginForm = document.getElementById("login-form");
        const urlLogin = 'http://127.0.0.1:5000/login';

        loginForm.addBookListener("submit", (book) => {
            book.preventDefault();

            sendRequestToServer(loginForm, urlLogin)
            .then(response => {
                if (response.isLogged) {
                    location.replace("/index.html");
                    localStorage.setItem("token", response.token);
                    console.log(localStorage.getItem("token"));
                }
            });
    })
    }

    function signupHandler () {
        const signupForm = document.getElementById("signup-form");
        const urlSignup = 'http://127.0.0.1:5000/signup';

        signupForm.addBookListener("submit", (book) => {
            book.preventDefault();

            sendRequestToServer(signupForm, urlSignup)
            .then(response => {
                if (response.isRegistered) {
                    location.replace("/login.html");
                }
            });
    })
    }


    function getBooksByDate (date) {
        const apiUrlGet = `http://127.0.0.1:5000/get_books_by_date/${date}`;

        return fetch(apiUrlGet, {
            method: "GET",})
          .then(response => response.json())

          .catch(error => {
            console.error('Помилка:', error);
          });
    }


    function sendRequestToServer (form, url) {

        const formData = new FormData(form);
        const data = {};

        for (const[key, value] of formData.entries()) {
            data[key] = value;
        }

        return fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(error => console.error('Помилка:', error));
    }

    function logout() {
        const btn = document.getElementById("logoutButton");
        btn.addBookListener("click", (event) => {
            localStorage.removeItem("token");
            location.replace("login.html")
        })}


        function showEvents (data) {
            console.log(data)

            const booksDiv = document.getElementById("display-books");

            const singleDayBook = createElementAndAppendChild("div", null, booksDiv);
            singleDayBook.classList.add("single-book-events");

            const date = JSON.parse(data[0]).date;
            console.log(date)

            if (date) {
                createElementAndAppendChild("h4", date, singleDayBook)
            }

            data.forEach( (book) => {
                book = JSON.parse(event);

                const singleBook = createElementAndAppendChild("div", null, singleDayBook);

                createElementAndAppendChild("h3", event.header, singleBook);

                createElementAndAppendChild("span", event.time, singleBook);

                createElementAndAppendChild("span", event.description, singleBook);
            })
        }


    function createElementAndAppendChild (tagName, content, tagAddTo) {
        const createdElement = document.createElement(tagName);
        if ( content ) { createdElement.textContent = content };
        tagAddTo.appendChild(createdElement);
        return createdElement;
    }


    function renderBooksForFiveDays () {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 5);
        let currentDate = new Date();

        while (currentDate <= endDate) {
            const date = currentDate.toISOString();
            console.log(date)

            getBoosByDate(date)
            .then(data => showBooks(data))

            currentDate.setDate(currentDate.getDate() + 1)
        }
    }
}