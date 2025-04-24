# Victories Service API

## Overview

The Victories Service API provides a RESTful interface for managing victories in a competitive environment.

## API Endpoints

### Victories

- `GET /api/victories/`: Retrieve all victories
- `POST /api/victories/`: Create a new victory
- `GET /api/victories/:id`: Retrieve a single victory by ID
- `PUT /api/victories/:id`: Update a victory
- `DELETE /api/victories/:id`: Delete a victory

### Users Victories

- `GET /api/victories/users/:id`: Retrieve victories by user ID

### Teams Victories

- `GET /api/victories/teams/:id`: Retrieve victories by team ID

### Events Victories

- `GET /api/victories/events/:id`: Retrieve victories by event ID

## Request/Response Formats

- Request bodies should be in JSON format
- Response bodies will be in JSON format

## Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Dependencies

- Go 1.17+
- Gin Framework
- GORM
- Yandex Database

## Installation

To install the Victories Service, run the following command:

```bash
go get github.com/davg/internal/server/victories
```

## Running the Service

To run the Victories Service, execute the following command:

```bash
ENV_TYPE=local go run main.go
```

The service will start on port 8080. You can access the API endpoints using a tool like `curl` or a REST client.

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

The Victories Service is licensed under the MIT License. See LICENSE for details.
