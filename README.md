[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13497031&assignment_repo_type=AssignmentRepo)

# TravelPal

Deployed Web-App:
https://s24-sessions-Anjoliekate.onrender.com/

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

## Overview

A Web-application that uses frameworks, tools, and languages such as JavaScript, Vue.js, Express.js, Node.js, MongoDB, HTML, CSS, and mongoose. This web-app contains a full user authentication, authorization, middleware, and session store system. With TravelPal users can track their dream destinations and their hobbies. In future versions users will be able to interact with other users and become "Travel Pals" based on interests, destinations, and several other factors.

<img width="1031" alt="Screenshot 2024-05-01 at 9 23 23 PM" src="https://github.com/Anjoliekate/TravelPal/assets/99061657/4e6ab0fd-1e5f-47b4-b836-91134edfb83b">
