#### Bank account with new

Write an object constructor function, called bank account, which has at least 3 mtehods (key value pairs in which the value is a function) called ```withdraw```, ```deposit``` and ```balance``` which allows us to keep track of the money flow in the account. None of the methods defined withing bankAccount Object take more than one argument and no other variables should be defined other than the bankAccount Object.
Example:

```jsx
var account = new bankAccount() //deafault to 0
account.withdraw(2)
account.withdraw(5)
account.deposit(4)
account.deposit(6)
account.balance() // 3
```
**Notes:** Write the ```withdraw```, ```deposit``` and ```balance``` within the constructor's prototype