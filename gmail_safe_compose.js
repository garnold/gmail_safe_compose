(function () {

    const GSC_STYLE = '__GSC__';
    const GSC_POLLING_DELAY = 500;

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    if (typeof HTMLElement.prototype.highlight !== 'function') {
        HTMLElement.prototype.highlight = function () {
            if (this.className.indexOf(GSC_STYLE) === -1) {
                this.className += ' ' + GSC_STYLE;
            }
        };
    }
    if (typeof HTMLElement.prototype.unhighlight !== 'function') {
        HTMLElement.prototype.unhighlight = function () {
            if (this.className.indexOf(GSC_STYLE) !== -1) {
                this.className = this.className.replace(' ' + GSC_STYLE, '');
            }
        };
    }

    var composeWindows = [];

    var highlightEmailAddressesOutsideOfSenderDomain = function () {
        for (var i = 0; i < composeWindows.length; i++) {
            var composeWindow = composeWindows[i];
            var from = composeWindow.querySelector("input[name=from]").value;
            var senderDomain = from.replace(/.*@/, '@');

            var emailSpans = composeWindow.querySelectorAll('span[email]');
            for (var j = 0; j < emailSpans.length; j++) {
                var emailSpan = emailSpans[j];
                var childDiv = emailSpan.querySelector('div');

                if (emailSpan.getAttribute('email').endsWith(senderDomain)) {
                    emailSpan.unhighlight();
                    if (childDiv) {
                        childDiv.unhighlight();
                    }
                }
                else {
                    emailSpan.highlight();
                    if (childDiv) {
                        childDiv.highlight();
                    }
                }
            }
        }

        window.setTimeout(highlightEmailAddressesOutsideOfSenderDomain, GSC_POLLING_DELAY);
    };
    window.setTimeout(highlightEmailAddressesOutsideOfSenderDomain, GSC_POLLING_DELAY);

    document.addEventListener('DOMNodeInserted', function (event) {
        var source = event.srcElement;
        if (!source.getElementsByTagName) {
            return;
        }

        var form = source.querySelector('form');
        if (form && form.from) {
            composeWindows.push(source);
        }
    });
})();