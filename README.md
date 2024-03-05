[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13497031&assignment_repo_type=AssignmentRepo)

# TravelPal

Deployed Web-App:
https://travel-pal-api.onrender.com/

High-fidelity prototype:
https://www.figma.com/file/OE35xQiVS06nt9klhVgwWJ/Untitled?type=design&node-id=0-1&mode=design

## Resource

**Users**

Attributes:

- name (string)
- email (string)
- birthday (string)
- password (string)
- destinations (array)
- interests (array)

## Schema

```sql
db.User.find((
id ObjectId(),
name String,
birthday String,
email String,
password String,
destinations Array,
interests Array));
```

## REST Endpoints

| Name                      | Method | Path                                     |
| ------------------------- | ------ | ---------------------------------------- |
| Retrieve users collection | GET    | /users                                   |
| Retrieve user             | GET    | /users/_\<id\>_                          |
| Create user               | POST   | /users                                   |
| Login User                | POST   | /login                                   |
| Delete destination        | DELETE | /users/_\<id\>_/destinations/destination |
| Delete interest           | DELETE | /users/_\<id\>_/interests/interest       |
| Create destination        | DELETE | /users/_\<id\>_/destinations             |
| Create interest           | POST   | /users/_\<id\>_/interests                |
| Update User               | PUT    | /users/_\<id\>_                          |
