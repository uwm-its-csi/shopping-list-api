# shopping-list-api

#### Getting all shopping lists

<details>
<summary><code>GET</code> <code><b>/api/shoppinglists</b></code> <code>(returns all shopping lists in the database)</code></summary>

##### Parameters
None

##### Responses
| http code | content-type       | response                                  |
| --------- | ------------------ | ----------------------------------------- |
| `200`     | `application/json` | `<records>`                               |

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
