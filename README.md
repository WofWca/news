## Usage

To access the API, user must have an access token.
To get one, you must send a `POST` request with basic authentication credentials. 
E.g. `curl -X POST --user vasya:qwerty %HOST%/api/v1/generate-token`. You'll get a response containing it.
Include this token for each API request in the `Authorization` header as follows: `Authorization: token %YOUR_TOKEN%`.

The root endpoint is `HOST/api/v1`.

The following news URLs are available:

#### `GET /news`
List all the news.

#### `POST /news`
Create a piece of news. Pass it in the request body. Don't pass an `_id`, it will be assigned automatically. If the `authorId` field is not specified, whoever makes the request will become the author.

#### `PUT /news/:id`
Change a piece of news. Including unchanged fileds is not necessary.

#### `DELETE /news/:id`
Delete a piece of news.

## Database schema

`users` collection:
```yaml
type: object
required:
- _id
- login
- password
properties:
  _id:
    type: MongoDB ObjectId
    examples:
    - 5c7f695dff4fb10ab87361fa
  login:
    type: string
    examples:
    - vasya
  password:
    type: string
    examples:
    - qwerty123
  admin:
    type: boolean
    description: Whether the user is an admin
    default: false
  authToken:
    type: string
    description: User token to access the API. UUID.
    examples:
    - c4dd3ca2-e499-4619-9d78-78bf4f74648b
```

`news` collection:
```yaml
type: object
required:
- _id
- title
- text
- authorId
properties:
  _id:
    type: MongoDB ObjectId
    examples:
    - 5c7f90f462e14c066919821f
  title:
    type: string
    examples:
    - Julia Yakubenya has dropped a sausage
  text:
    type: string
    description: News piece detailed text
    examples:
    - Some news detailed info.
  authorId:
    type: MongoDB ObjectId
    examples:
    - 5c7f695dff4fb10ab87361fa
```