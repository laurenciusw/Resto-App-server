# My Restaurant App Server

My Assets App is an application to manage your assets. This app has :

- RESTful endpoint for asset's CRD operation
- JSON formatted response

&nbsp;

## RESTful endpoints

### GET /cuisines

> Get all assets

_Request Header_

```
{
  "access_token": "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
     {
        "id": 1,
        "name": "Cheeseburger",
        "description": "A classic cheeseburger with juicy beef patty, melted cheese, lettuce, and tomato",
        "price": 8000,
        "imgUrl": "https://example.com/cheeseburger.jpg",
        "authorId": 1,
        "categoryId": 2,
        "createdAt": "2023-04-10T15:48:07.374Z",
        "updatedAt": "2023-04-10T15:48:07.374Z",
        "User": {
            "id": 1,
            "username": "johndoe",
            "email": "johndoe@example.com",
            "role": "staff",
            "phoneNumber": "123-456-7890",
            "address": "123 Main St, Anytown USA",
            "createdAt": "2023-04-10T15:48:07.344Z",
            "updatedAt": "2023-04-10T15:48:07.344Z"
        }
    },
    {
        "id": 2,
        "name": "Grilled Chicken Sandwich",
        "description": "Grilled chicken breast topped with bacon, lettuce,  tomato, and mayo on a toasted bun",
        "price": 7500,
        "imgUrl": "https://example.com/grilled-chicken-sandwich.jpg",
        "authorId": 2,
        "categoryId": 1,
        "createdAt": "2023-04-10T15:48:07.374Z",
        "updatedAt": "2023-04-10T15:48:07.374Z",
        "User": {
            "id": 2,
            "username": "janedoe",
            "email": "janedoe@example.com",
            "role": "admin",
            "phoneNumber": "555-555-5555",
            "address": "456 Elm St, Anytown USA",
            "createdAt": "2023-04-10T15:48:07.344Z",
            "updatedAt": "2023-04-10T15:48:07.344Z"
        }
    }
]
```

_Response (500 - internal server error)_

```
{
     message: "internal server error"
}
```

### POST /cuisines

> Create new asset

_Request Header_

```
{
  "access_token": "string"
}
```

_Request Body_

```
{
    "name": "<name of cuisine>",
    "description": "<description of the cuisine>",
    "price": "<price of the cuisine>",
    "imgUrl": "<picture of the cuisine>",
    "authorId": "<id from user>",
    "categoryId": "<id from category>",
    "updatedAt": "<data updated at>",
    "createdAt": "<data created at>"
}
```

_Response (201 - Created)_

```
{
    "name": "<name of posted cuisine>",
    "description": "<description of the posted cuisine>",
    "price": "<price of the posted cuisine>",
    "imgUrl": "<picture of the posted cuisine>",
    "authorId": "<id from user>",
    "categoryId": "<id from category>",
    "updatedAt": "<data updated at>",
    "createdAt": "<data created at>"
}
```

_Response (400 - Bad Request)_

```
{
    "message": [
        "Nama harus diisi",
        "description harus diisi",
        "imgUrl harus diisi"
    ]
}
```

_Response (404 - not found)_

```
{
     message: "data not found"
}

```

_Response (500 - internal server error)_

```
{
     message: "internal server error"
}

```

### DELETE /cuisines

> Create new asset

_Request Header_

```
{
  "access_token": "string"
}
```

_Request Body_

```
not needed
```

_Response (200 - Deleted)_

```
{
    "message": "Cuisine with id 18 succes to delete "
}
```

_Response (404 - not found)_

```
{
     message: "data not found"
}
```

_Response (500 - internal server error)_

```
{
     message: "internal server error"
}
```

### GET /cuisines/:id

_Request Header_

```
{
  "access_token": "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "id": 1,
    "name": "Cheeseburger",
    "description": "A classic cheeseburger with juicy beef patty, melted cheese, lettuce, and tomato",
    "price": 8000,
    "imgUrl": "https://example.com/cheeseburger.jpg",
    "authorId": 1,
    "categoryId": 2,
    "createdAt": "2023-04-10T15:48:07.374Z",
    "updatedAt": "2023-04-10T15:48:07.374Z"
}
```

_Response (500 - internal server error)_

```
{
     message: "internal server error"
}
```

### GET /categories

_Request Header_

```
{
  "access_token": "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "id": 1,
        "name": "Snacks",
        "createdAt": "2023-04-10T15:48:07.366Z",
        "updatedAt": "2023-04-10T15:48:07.366Z"
    },
    {
        "id": 2,
        "name": "Non Vegetarian Foods",
        "createdAt": "2023-04-10T15:48:07.366Z",
        "updatedAt": "2023-04-10T15:48:07.366Z"
    }
]
```

_Response (500 - internal server error)_

```
{
     message: "internal server error"
}
```

## POST /users/register

_Request Header_

```
{
  "access_token": "string"
}
```

Request:

- body:

```
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "address": "string",
}
```

_Response (201 - Created)_

```
{
  "message": "user with email (user.email) has been created"
}
```

_Response (400 - Bad Request)_

```
{
  "message": "username cannot be empty"
}
{
  "message": "email is required"
}
{
  "message": "password is required"
}
{
  "message": "email must be unique"
}
```

## POST /auth/login

Request:

- body:

```
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```
{
  "access_token": "string",
  "email": "string",
  "userRole":"string"
}
```

_Response (400 - Bad Request)_

```
{
  "message": "email is required"
}
{
  "message": "password is required"
}
```

## POST /auth/login-google

- body:

```
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```
{
  "access_token": "string",
  "userRole": "string",
  userEmail,: "string"
}
```
