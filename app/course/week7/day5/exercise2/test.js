const runTest = function(beforeTest){
    readMessage.runEval = eval
    beforeTest()
    reactRender = ReactDOM.render( <EliumApp/>, document.getElementById("yourSolution"))
    reactRender = ReactDOM.render( <EliumApp/>, document.getElementsByClassName("jasmine-testground")[0])
    describe( 'Elium App should:',  ()=>{
        var main = $(".jasmine-testground")
        var submitButton = main.find("input[type='submit']")
        var inputName = main.find("input[name ='fullname']")
        var inputAge  = main.find("input[name ='age']"  )
        var sortName = main.find("button#sortName")
        var sortAge  = main.find("button#sortAge")
        var tableBody = main.find('tbody')

        beforeAll(() => {
        })

        it('have a sumit button', () => {
            expect(submitButton.get(0)).toBeDefined()
        })

        it('have an input for the full name', () => {
            expect(inputName.get(0)).toBeDefined()
        })

        it('have an input for the age', () => {
            expect(inputAge.get(0)).toBeDefined()
        })

        it('have an table body', () => {
            expect(tableBody.get(0)).toBeDefined()
        })

        it('have an button to sort by age', () => {
            expect(sortAge.get(0)).toBeDefined()
        })

        it('have an button to sort by name', () => {
            expect(sortName.get(0)).toBeDefined()
        })


        it('be able to add students and their age', () => {
            inputName.val("pedro favuzzi")
            inputAge.val(10)
            submitButton.click()

            inputName.val("banana split")
            inputAge.val(5)
            submitButton.click()

            inputName.val("super man")
            inputAge.val(11)
            submitButton.click()

            var expected = 0
            tableBody.find("tr").each((i, ele) => {
                const children = $(ele).children()
                if (["pedro favuzzi", "banana split", "super man"].includes($(children[0]).text()) ) expected +=1
                if (["10", "5", "11" ].includes($(children[1]).text()) ) expected +=1
            })
            expect(expected).toEqual(6)
        })

        it('sort the table by name if we click the sort by name button', () =>{
            sortName.click()
            var orderedNames = []
            var orderedAges = []
            tableBody.find("tr").each((i, ele) => {
                const children = $(ele).children()
                orderedNames.push($(children[0]).text())
                orderedAges.push($(children[1]).text())
            })
            expect(orderedNames).toEqual([ 'banana split', 'pedro favuzzi', 'super man' ])
            expect(orderedAges).toEqual([ '5', '10', '11' ])

        })

        it('sort the table by name in the inverse order at the second click', () =>{
            sortName.click()
            var orderedNames = []
            var orderedAges = []
            tableBody.find("tr").each((i, ele) => {
                const children = $(ele).children()
                orderedNames.push($(children[0]).text())
                orderedAges.push($(children[1]).text())
            })
            expect(orderedNames).toEqual(['super man', 'pedro favuzzi', 'banana split' ])
            expect(orderedAges).toEqual([ '11', '10', '5' ])

        })


        it('sort the table by age if we click the sort by age button', () =>{
            sortAge.click()
            var orderedNames = []
            var orderedAges = []
            tableBody.find("tr").each((i, ele) => {
                const children = $(ele).children()
                orderedNames.push($(children[0]).text())
                orderedAges.push($(children[1]).text())
            })
            expect(orderedNames).toEqual([ 'pedro favuzzi', 'super man', 'banana split' ])
            expect(orderedAges).toEqual(['10' ,'11' ,'5'])

        })

        it('sort the table by age in the inverse order at the second click', () =>{
            sortAge.click()
            var orderedNames = []
            var orderedAges = []
            tableBody.find("tr").each((i, ele) => {
                const children = $(ele).children()
                orderedNames.push($(children[0]).text())
                orderedAges.push($(children[1]).text())
            })
            expect(orderedNames).toEqual([ 'banana split', 'super man', 'pedro favuzzi' ])
            expect(orderedAges).toEqual([ '5', '11', '10' ])

        })

    })
}

var asyncTest = function(response) {
    JasmineBoot();
    response.data = "JS\n" + response.data;
    runTest(() => readMessage(response))
    exercuteTest()
}

window.runTheTest = function() {
    axios.get("<%= view.solution %>.js")
        .then(asyncTest)
}

runTheTest()
