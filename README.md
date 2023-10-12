# shopping-list-api

#### Getting all shopping lists

<details>
<summary><code>GET</code> <code><b>/api/shoppinglists</b></code> <code>(returns all shopping lists in the database)</code></summary>

##### Parameters
None

##### Responses
| http code | content-type       | response                                  |
| --------- | ------------------ | ----------------------------------------- |
| `200`     | `application/json` | `<userID>, <list<item>>`                               |

##### Example Call
`https://rbeerma-shoppinglist.azurewebsites.net/api/shoppinglists`

##### Example Response
 ```json
[
    {
        "userID": "cooper",
        "list": [
            {
                "id": 1,
                "name": "dog biscuits",
                "quantity": 42,
                "checked": false
            },
            {
                "id": 2,
                "name": "dog food",
                "quantity": 1,
                "checked": true
            },
            {
                "id": 3,
                "name": "Fresh Pet",
                "quantity": 1000,
                "checked": false
            },
            {
                "id": 4,
                "name": "Toys!",
                "quantity": 5,
                "checked": false
            }
        ]
    },
    {
        "userID": "rbeerma",
        "list": [
            {
                "id": 1,
                "name": "Milk",
                "quantity": 1,
                "checked": true
            },
            {
                "id": 2,
                "name": "coffee",
                "quantity": 5,
                "checked": false
            },
            {
                "id": 3,
                "name": "Donuts",
                "quantity": "13",
                "checked": true
            }
        ]
    }
]
 ```

</details>

---

#### Getting a shopping list by user ID

<details>
<summary><code>GET</code> <code><b>/api/shoppinglists</b></code> <code>(returns one shopping list, by user ID)</code></summary>

##### Parameters
userID

##### Responses
| http code | content-type       | response                                  |
| --------- | ------------------ | ----------------------------------------- |
| `200`     | `application/json` | `<list>`                               |

##### Example Call
`https://rbeerma-shoppinglist.azurewebsites.net/api/shoppinglists?userID=cooper`

##### Example Response
 ```json
[
    {
        "id": 1,
        "name": "dog biscuits",
        "quantity": 42,
        "checked": false
    },
    {
        "id": 2,
        "name": "dog food",
        "quantity": 1,
        "checked": true
    },
    {
        "id": 3,
        "name": "Fresh Pet",
        "quantity": 1000,
        "checked": false
    },
    {
        "id": 4,
        "name": "Toys!",
        "quantity": 5,
        "checked": false
    }
]
 ```

</details>

---

#### Saving a shopping list

<details>
<summary><code>POST</code> <code><b>/api/shoppinglists</b></code> <code>(saves a shopping list to the database)</code></summary>

##### Parameters
None

##### Request Body
```
userID: string
list: array of type 'item'
item:
  id: int
  name: string
  quantity: int
  checked: boolean
```

##### Example Request Body
```json
{
    "userID": "cooper",
    "list": [
        {
            "id": 1,
            "name": "dog biscuits",
            "quantity": 42,
            "checked": false
        },
        {
            "id": 2,
            "name": "dog food",
            "quantity": 1,
            "checked": true
        },
        {
            "id": 3,
            "name": "Fresh Pet",
            "quantity": 1000,
            "checked": false
        },
        {
            "id": 4,
            "name": "Toys!",
            "quantity": 5,
            "checked": false
        }
    ]
}
```

##### Responses (currently, a success response is just the MongoDB acknowledgement)
| http code | content-type       | response                                  |
| --------- | ------------------ | ----------------------------------------- |
| `200`     | `application/json` | `<acknowledgement>`                               |

##### Example Response
 ```json
{
    "acknowledged": true,
    "modifiedCount": 0,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
 ```

</details>

---

#### Getting a list of available items

<details>
<summary><code>GET</code> <code><b>/api/itemlist</b></code> <code>(returns a list of available items)</code></summary>

##### Parameters
None

##### Responses
| http code | content-type       | response                                  |
| --------- | ------------------ | ----------------------------------------- |
| `200`     | `application/json` | `<item list>`                               |

##### Example Call
`https://rbeerma-shoppinglist.azurewebsites.net/api/itemlist`

##### Example Response
```json
[
    {
        "name": "Milk"
    },
    {
        "name": "Bread"
    },
    ...
]
```
