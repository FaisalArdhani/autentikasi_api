# Authentication API with JWT and MongoDB

![Node.js](https://nodejs.org/en)
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4.x-orange.svg)
![JWT](https://img.shields.io/badge/JSON%20Web%20Token-8.x-red.svg)

Welcome to the Awesome Authentication API repository! This project is a simple and secure authentication API built with Node.js, Express.js, MongoDB, and JWT (JSON Web Token). It provides endpoints for user registration, login, token refresh, and protected routes.

## Features

- User registration with password encryption using bcrypt.
- User login and issuance of access and refresh tokens using JWT.
- Token refresh for extending access token validity.
- Secure middleware for protecting routes with JWT authentication.

## Getting Started

1. **Prerequisites**: Ensure you have Node.js, MongoDB, and npm installed on your system.
2. **Installation**: Clone this repository and run `yarn install` to install the dependencies.
3. **Configuration**: Create a `.env` file and provide values for `PORT`, `DB_URL`, `ACCESS_TOKEN_SECRET`, and `REFRESH_TOKEN_SECRET`.
4. **Database Setup**: Ensure MongoDB is running, and the database specified in `.env` is accessible.
5. **Start the Server**: Run `yarn serve` to start the server.

## API Endpoints

- `POST /api/register`: Register a new user with a unique username and encrypted password.
- `POST /api/login`: Authenticate a user and issue access and refresh tokens.
- `POST /api/refresh`: Refresh the access token using a valid refresh token.
- `GET /api/protected`: Access a protected route that requires authentication (use the `Authorization` header with the Bearer token).

## Usage

1. Register a new user by making a `POST` request to `/api/register`.
2. Login and receive access and refresh tokens by making a `POST` request to `/api/login`.
3. Access protected routes by including the access token in the `Authorization` header of the request.
4. Refresh the access token using a valid refresh token by making a `POST` request to `/api/refresh`.

## Error Handling

The API handles errors gracefully and provides informative error messages in the response.

## Security

This API utilizes best practices for user authentication, password encryption, and token management to ensure security and protect sensitive user information.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for exploring the Awesome Authentication API! If you have any questions or need assistance, please don't hesitate to reach out. Happy coding! 🚀
