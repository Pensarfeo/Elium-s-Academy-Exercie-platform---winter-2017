/*
Copyright (c) 2008-2016 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
jasmineRequire.html = function(j$) {
    j$.ResultsNode = jasmineRequire.ResultsNode();
    j$.HtmlReporter = jasmineRequire.HtmlReporter(j$);
    j$.HtmlSpecFilter = jasmineRequire.HtmlSpecFilter();
};

jasmineRequire.HtmlReporter = function(j$) {

    var noopTimer = {
        start: function() {},
        elapsed: function() {
            return 0; }
    };

    function HtmlReporter(options) {
        var env = options.env || {},
            getContainer = options.getContainer,
            createElement = options.createElement,
            createTextNode = options.createTextNode,
            timer = options.timer || noopTimer,
            results = [],
            specsExecuted = 0,
            failureCount = 0,
            pendingSpecCount = 0,
            htmlReporterMain,
            symbols,
            failedSuites = [];

        this.initialize = function() {
            clearPrior();
            htmlReporterMain = createDom('div', { className: 'jasmine_html-reporter' },
                createDom('ul', { className: 'jasmine-symbol-summary' }),
                createDom('div', { className: 'jasmine-alert' }),
                createDom('div', { className: 'jasmine-results' },
                    createDom('div', { className: 'jasmine-failures' })
                )
            );
            getContainer().appendChild(htmlReporterMain);
        };

        var totalSpecsDefined;
        this.jasmineStarted = function(options) {
            totalSpecsDefined = options.totalSpecsDefined || 0;
            timer.start();
        };

        var summary = createDom('div', { className: 'jasmine-summary' });

        var topResults = new j$.ResultsNode({}, '', null),
            currentParent = topResults;

        this.suiteStarted = function(result) {
            currentParent.addChild(result, 'suite');
            currentParent = currentParent.last();
        };

        this.suiteDone = function(result) {
            if (result.status == 'failed') {
                failedSuites.push(result);
            }

            if (currentParent == topResults) {
                return;
            }

            currentParent = currentParent.parent;
        };

        this.specStarted = function(result) {
            currentParent.addChild(result, 'spec');
        };

        var failures = [];
        this.specDone = function(result) {
            if (noExpectations(result) && typeof console !== 'undefined' && typeof console.error !== 'undefined') {
                console.error('Spec \'' + result.fullName + '\' has no expectations.');
            }

            if (result.status != 'disabled') {
                specsExecuted++;
            }

            if (!symbols) {
                symbols = find('.jasmine-symbol-summary');
            }

            symbols.appendChild(createDom('li', {
                className: noExpectations(result) ? 'jasmine-empty' : 'jasmine-' + result.status,
                id: 'spec_' + result.id,
                title: result.fullName
            }));

            if (result.status == 'failed') {
                failureCount++;

                var failure =
                    createDom('div', { className: 'jasmine-spec-detail jasmine-failed' },
                        createDom('div', { className: 'jasmine-description' },
                            createDom('span', { title: result.fullName}, result.fullName)
                        ),
                        createDom('div', { className: 'jasmine-messages' })
                    );
                var messages = failure.childNodes[1];

                for (var i = 0; i < result.failedExpectations.length; i++) {
                    var expectation = result.failedExpectations[i];
                    messages.appendChild(createDom('div', { className: 'jasmine-result-message' }, expectation.message));
                    messages.appendChild(createDom('div', { className: 'jasmine-stack-trace' }, expectation.stack));
                }

                failures.push(failure);
            }

            if (result.status == 'pending') {
                pendingSpecCount++;
            }
        };

        this.jasmineDone = function(doneResult) {
            var banner = find('.jasmine-banner');
            var alert = find('.jasmine-alert');
            var order = doneResult && doneResult.order;
            alert.appendChild(createDom('span', { className: 'jasmine-duration' }, 'finished in ' + timer.elapsed() / 1000 + 's'));

            var statusBarMessage = '';
            var statusBarClassName = 'jasmine-bar ';

            if (totalSpecsDefined > 0) {
                statusBarMessage += pluralize('spec', specsExecuted) + ', ' + pluralize('failure', failureCount);
                if (pendingSpecCount) { statusBarMessage += ', ' + pluralize('pending spec', pendingSpecCount); }
                statusBarClassName += (failureCount > 0) ? 'jasmine-failed' : 'jasmine-passed';
            } else {
                statusBarClassName += 'jasmine-skipped';
                statusBarMessage += 'No specs found';
            }

            var seedBar;
            if (order && order.random) {
                seedBar = createDom('span', { className: 'jasmine-seed-bar' },
                    ', randomized with seed ',
                    createDom('a', { title: 'randomized with seed ' + order.seed, href: seedHref(order.seed) }, order.seed)
                );
            }

            alert.appendChild(createDom('span', { className: statusBarClassName }, statusBarMessage, seedBar));

            var errorBarClassName = 'jasmine-bar jasmine-errored';
            var errorBarMessagePrefix = 'AfterAll ';

            for (var i = 0; i < failedSuites.length; i++) {
                var failedSuite = failedSuites[i];
                for (var j = 0; j < failedSuite.failedExpectations.length; j++) {
                    alert.appendChild(createDom('span', { className: errorBarClassName }, errorBarMessagePrefix + failedSuite.failedExpectations[j].message));
                }
            }

            var globalFailures = (doneResult && doneResult.failedExpectations) || [];
            for (i = 0; i < globalFailures.length; i++) {
                var failure = globalFailures[i];
                alert.appendChild(createDom('span', { className: errorBarClassName }, errorBarMessagePrefix + failure.message));
            }

            var results = find('.jasmine-results');
            results.appendChild(summary);

            summaryList(topResults, summary);

            function summaryList(resultsTree, domParent) {
                var specListNode;
                for (var i = 0; i < resultsTree.children.length; i++) {
                    var resultNode = resultsTree.children[i];
                    if (resultNode.type == 'suite') {
                        var suiteListNode = createDom('ul', { className: 'jasmine-suite', id: 'suite-' + resultNode.result.id },
                            createDom('li', { className: 'jasmine-suite-detail' },
                                createDom('span', {}, resultNode.result.description)
                            )
                        );

                        summaryList(resultNode, suiteListNode);
                        domParent.appendChild(suiteListNode);
                    }
                    if (resultNode.type == 'spec') {
                        if (domParent.getAttribute('class') != 'jasmine-specs') {
                            specListNode = createDom('ul', { className: 'jasmine-specs' });
                            domParent.appendChild(specListNode);
                        }
                        var specDescription = resultNode.result.description;
                        if (noExpectations(resultNode.result)) {
                            specDescription = 'SPEC HAS NO EXPECTATIONS ' + specDescription;
                        }
                        if (resultNode.result.status === 'pending' && resultNode.result.pendingReason !== '') {
                            specDescription = specDescription + ' PENDING WITH MESSAGE: ' + resultNode.result.pendingReason;
                        }
                        specListNode.appendChild(
                            createDom('li', {
                                    className: 'jasmine-' + resultNode.result.status,
                                    id: 'spec-' + resultNode.result.id
                                },
                                createDom('span', { }, specDescription)
                            )
                        );
                    }
                }
            }

            if (failures.length) {
                var failureNode = find('.jasmine-failures');
                for (i = 0; i < failures.length; i++) {
                    failureNode.appendChild(failures[i]);
                }
            }
        };

        return this;

        function find(selector) {
            return getContainer().querySelector('.jasmine_html-reporter ' + selector);
        }

        function clearPrior() {
            // return the reporter
            var oldReporter = find('');

            if (oldReporter) {
                getContainer().removeChild(oldReporter);
            }
        }

        function createDom(type, attrs, childrenVarArgs) {
            var el = createElement(type);

            for (var i = 2; i < arguments.length; i++) {
                var child = arguments[i];

                if (typeof child === 'string') {
                    el.appendChild(createTextNode(child));
                } else {
                    if (child) {
                        el.appendChild(child);
                    }
                }
            }

            for (var attr in attrs) {
                if (attr == 'className') {
                    el[attr] = attrs[attr];
                } else {
                    el.setAttribute(attr, attrs[attr]);
                }
            }

            return el;
        }

        function pluralize(singular, count) {
            var word = (count == 1 ? singular : singular + 's');

            return '' + count + ' ' + word;
        }

        function defaultQueryString(key, value) {
            return '?' + key + '=' + value;
        }

        function setMenuModeTo(mode) {
            htmlReporterMain.setAttribute('class', 'jasmine_html-reporter ' + mode);
        }

        function noExpectations(result) {
            return (result.failedExpectations.length + result.passedExpectations.length) === 0 &&
                result.status === 'passed';
        }
    }

    return HtmlReporter;
};

jasmineRequire.HtmlSpecFilter = function() {
    function HtmlSpecFilter(options) {
        var filterString = options && options.filterString() && options.filterString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        var filterPattern = new RegExp(filterString);

        this.matches = function(specName) {
            return filterPattern.test(specName);
        };
    }

    return HtmlSpecFilter;
};

jasmineRequire.ResultsNode = function() {
    function ResultsNode(result, type, parent) {
        this.result = result;
        this.type = type;
        this.parent = parent;

        this.children = [];

        this.addChild = function(result, type) {
            this.children.push(new ResultsNode(result, type, this));
        };

        this.last = function() {
            return this.children[this.children.length - 1];
        };
    }

    return ResultsNode;
};
