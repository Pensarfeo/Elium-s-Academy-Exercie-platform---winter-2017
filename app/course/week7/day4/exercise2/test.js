const runTest = function(beforeTest){
    readMessage.runEval = eval
    beforeTest()
    reactRender = ReactDOM.render( <EliumApp/>, document.getElementById("yourSolution"))
    reactRender = ReactDOM.render( <EliumApp/>, document.getElementsByClassName("jasmine-testground")[0])
    describe( 'Elium App should:',  ()=>{
        var main = $(".jasmine-testground")
        var submitButton = main.find("input[type='submit']")
        var input = main.find("input[type='text']")
        var tableBody = main.find('tbody')

        beforeAll(() => {
        })

        it('have a sumit button', () => {
            expect(submitButton.get(0)).toBeDefined()
        })
        it('have an input field', () => {
            expect(input.get(0)).toBeDefined()
        })
        it('have an table body', () => {
            expect(tableBody.get(0)).toBeDefined()
        })
        it('add new names and surnames to the table', () => {
            input.val("pedro favuzzi")
            submitButton.click()

            input.val("banana split")
            submitButton.click()

            input.val("super man")
            submitButton.click()
            var expected = 0
            tableBody.find("tr").each((i, ele) => {
                const children = $(ele).children()
                if (["pedro", "banana", "super" ].includes($(children[0]).text()) ) expected +=1
                if (["f.", "s.", "m." ].includes($(children[1]).text()) ) expected +=1
                    $(children[1]).mouseenter()
            })
            expect(expected).toEqual(6)
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