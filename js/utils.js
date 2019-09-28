// Global JS Helper Functions

/**
 * @function
 * @param {event} event Event listener object
 * This will show (css .show) the content of the tab clicked and hide (css .hide) all other content. It will also add .active class to tab selected.
 */
function tabSelect(event) {
    var contentElSelector = event.target.getAttribute('data-target');
    var contentEl = document.querySelector(contentElSelector);

    var otherTabEls = document.querySelectorAll('.tabs:not(' + contentElSelector + ')');
    var otherContentEls = document.querySelectorAll('.tab-content:not(' + contentElSelector + ')');

    // remove active class from not selected tabs
    otherTabEls.forEach(function(el) {
        el.classList.remove('active');
    });

    // hide all not selected tab content elements
    otherContentEls.forEach(function(el) {
        el.classList.remove('show');
        el.classList.add('hide');
    });

    // add active class to selected tab
    event.target.classList.add('active');

    // show selected tab content
    contentEl.classList.remove('hide');
    contentEl.classList.add('show');
}