#### Adding student's details

Well now that we have tons of students it will be nice to be able to sort them by their name and age. Starting with yesterday’s Exercises, allow the Elium admin to add the age of the student along with the name of the student. Add to buttons to sort by age or by surname. If the same button is pressed twice the order of the sorting should change!  For example if “sort by surname” is pressed once the names should be displayed A-Z. If the button is pressed again the order should be Z-A.

**Notes:**
1. set the id of the sorting buttons to ```sortName``` and ```sortAge```
2. the input for the student age should have the following attribute ```name = "age"```

**Notes:** You **must** mount it at the following DOM Node to get your component tested: ```document.getElementsByClassName("jasmine-testground")[0]```.
