### Dynamic Calculator

write a function called dynamicCalculator that takes 1 to 3 arguments. In most cases the first arguments is a string with the name of the operation whe want to use and two mor argument that are the numbers that we should pass to the operation.
However when we pass the argument ```"add"```, we can now pass a function definition as second argument and this function will be now added to the list of possible operations, the thirs argument will now be the name of the operation associated to that function.

Example

```jsx

dynamicCalculator("sum", 1, 2) // This should now work

// first we need to define a functionality
var sum = function(v1, v2){
    return v1 + v2
}

// second we need to pass is to the dynamicCalculator
dynamicCalculator("add", sum, "sum") // 3

// now we can sum two numbers!
dynamicCalculator("sum", 1, 2) // 3

```