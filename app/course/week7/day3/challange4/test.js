const runTest = function(beforeTest){
    const mount = Enzyme.mount
    readMessage.runEval = eval
    beforeTest()
    window.oldSetTimeout = window.setTimeout
    window.oldSetInterval = window.setInterval

    window.setTimeout = (func, time) => {
        return window.oldSetTimeout(func, time/100)
    }

    window.setInterval = (func, time) => {
        return window.oldSetInterval(func, time/100)
    }

    reactRender = ReactDOM.render( <Counter/>, document.getElementById("yourSolution"))


    describe( 'Counter component should:',  ()=>{
        let component

        beforeEach(()=>{
            component = mount(<Counter/>)
        })

        it('should display a button', () => {
            expect(component.find("button").length).toEqual(1)
        })

        it('start from 0', () => {
            expect(component.text()).toContain("0")
        })

        it('define componentWillUnmount', () => {
            expect(component.nodes[0].componentWillUnmount).toBeDefined()
            expect(typeof component.nodes[0].componentWillUnmount).toEqual("function")
        })


        it('If you click 3 or more times, it would not update the counter to 3 or more', (done) => {
            expect(component.text()).toContain("0")
            const button = component.find("button")
            for(let i=0; i<4; i++){button.simulate("click")}
            setTimeout(() => {
                if (typeof component.nodes[0].componentWillUnmount === "function") component.nodes[0].componentWillUnmount()
                expect(component.text()).not.toContain("4")
                done()}
            , 5000)
            
        })

        it('the countdown should go to 0', (done) => {
            const component1 = mount(<Counter/>)
            const button = component1.find("button")
            for(let i=0; i<4; i++){button.simulate("click")}
            let numberText = component1.text().replace(button.text(), "")
            setTimeout(()=> {
                numberText = component1.text().replace(button.text(), "")
                expect(numberText).toEqual("component will unmount in 3")}, 500)
            setTimeout(()=> {
                numberText = component1.text().replace(button.text(), "")
                expect(numberText).toEqual("component will unmount in 2")}, 1500)
            setTimeout(()=> {
                numberText = component1.text().replace(button.text(), "")
                expect(numberText).toEqual("component will unmount in 1")}, 2500)
            setTimeout(()=> {
                numberText = component1.text().replace(button.text(), "")
                if (typeof component1.nodes[0].componentWillUnmount === "function") component1.nodes[0].componentWillUnmount()
                expect(numberText).toEqual("component will unmount in 0")}, 3500)
            setTimeout(() => done(), 5000)

        })

        afterAll((done)=>{
            window.setTimeout =  window.oldSetTimeout
            window.setInterval = window.oldSetInterval
            done()
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