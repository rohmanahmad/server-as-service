export default [
    {
        "hash": "login",
        "component": "AuthLogin",
        "menu": false
    },
    // user agent
    { 
        "hash": "user/create",
        "component": "AgentCreate",
        "menu": true
    },
    {
        "hash": "user/access",
        "component": "AgentList",
        "menu": true
    },
    // roles
    { 
        "hash": "role/list",
        "component": "RoleList",
        "menu": true
    },
    { 
        "hash": "role/edit",
        "component": "RoleEdit",
        "menu": true
    },
    { 
        "hash": "role/create",
        "component": "RoleCreate",
        "menu": true
    },
]