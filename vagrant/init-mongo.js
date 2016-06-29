db = db.getSiblingDB('admin')
db.createUser(
    {
        user: "mvshop",
        pwd: "mvshop",
        roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
    }
)