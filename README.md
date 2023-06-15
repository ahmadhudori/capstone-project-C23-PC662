# capstone-project-C23-PC662
## **API Documentation**

url : https://app-2ge5ruq6qa-et.a.run.app/

### **POST /signUp**
<details>

#### **Body** 
| Key         	| Type    	| Default 	| Required 	| Description                     	|
|--------------	|---------	| ---------	|----------	|---------------------------------	|
| name        	| String  	|         	| Yes      	| Name of the user                  |
| email       	| String    |          	| Yes      	| User email  (must be **unique**)                     	|
| password     	| String  	|          	| Yes       | User password                   	|

#### **Successful response**
  Register successfully (**201**)
```JSON
{
    "message": "user added"
}
```
#### **Failed response**
Some fields are not filled (400)
```JSON
{
    "message": "please fill every fields to sign up"
}
```
Email already exists (400)
```JSON
{
"message": "Email already exists"
}
```
</details>

### **POST /login**
<details>

#### **Body**
| Key         	| Type    	| Default 	| Required 	| Description                     	|
|--------------	|---------	| ---------	|----------	|---------------------------------	|
| email       	| String    |          	| Yes      	| User email                        |
| password     	| String  	|          	| Yes       | User password  

#### **Successful response**
  Login successfully (**200**)
```JSON
{
    "message": "login succeed",
    "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```
#### **Failed response**
Username/password inccorect (400)
```JSON
{
    "message": "email/password incorrect"
}
```

</details>

### **GET /profile**
<details>

#### **Header**
| Name         	| Type    	| Default 	| Required 	| Value                            	|
|--------------	| --------- | ---------	|----------	|---------------------------------	|
| Authorization | Bearer  	|         	| Yes      	| token from login |
#### **Successful response**
  Get user detail success (**200**)
```JSON
{
    "id": "xxxxxxxxxxxxxxx",
    "name": "xxxxxxxxxxxxxxx",
    "email": "xxxxxxxxxxxxxxx",
    "createdAt": "2023-06-15T14:11:42.755Z"
}
```
#### **Failed response**
not filling Bearer token (**400**)
```JSON
{
    "message": "token required"
}
```
Bearer token invalid (**400**)
```JSON
{
    "name": "JsonWebTokenError",
    "message": "invalid signature"
}
```

</details>

### **POST  /uploadProfileImage**
<details>

#### **Header**
| Name         	| Type    	| Default 	| Required 	| Value                            	|
|--------------	| --------- | ---------	|----------	|---------------------------------	|
| Authorization | Bearer  	|         	| Yes      	| token from login |
#### **Body** 
| Key         	| Type    	| Default 	| Required 	| Description                     	|
|--------------	|---------	| ---------	|----------	|---------------------------------	|
| profile       	| file    |          	| Yes      	| User profile picture                        |

#### **Successful response**
Upload profile picture success (**200**)
  ```JSON
{
    "message": "profile image sucessfully updated",
    "imageUrl": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```
#### **Failed response**
not filling Bearer token (**400**)
```JSON
{
    "message": "token required"
}
```
Bearer token invalid (**400**)
```JSON
{
    "name": "JsonWebTokenError",
    "message": "invalid signature"
}
```
not filling profile fields (**400**)
```JSON
{
    "message": "please fill profile fields"
}
```
</details>

### **POST  /updateProfile**
<details>

#### **Header**
| Name         	| Type    	| Default 	| Required 	| Value                            	|
|--------------	| --------- | ---------	|----------	|---------------------------------	|
| Authorization | Bearer  	|         	| Yes      	| token from login |

#### **Body** 
| Key         	| Type    	| Default 	| Required 	| Description                     	|
|--------------	|---------	| ---------	|----------	|---------------------------------	|
| updatedName        	| String  	|    user name     	| No (but, at least one of other fields filled)      	| Name of the user                  |
| updatedEmail       	| String    |     user email     	| No (but, at least one of other fields filled)     	| User email  (must be **unique**)                     	|
| updatedPass     	| String  	|    user password      	| No (but, at least one of other fields filled)       | User password                   	|

#### **Successful response**
User profile updated (**200**)
```JSON
{
    "message": "user updated"
}
```

#### **Failed response**
not filling Bearer token (**400**)

```JSON
{
    "message": "token required"
}
```
Bearer token invalid (**400**)
```JSON
{
    "name": "JsonWebTokenError",
    "message": "invalid signature"
}
```
not filling any field (**400**)
```JSON
{
    "message": "please fill updateName/updatedEmail/updatedPass field"
}
```
</details>
