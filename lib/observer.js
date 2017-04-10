export function observer(init) {
    const instance = new MutationObserver(init.callback)
    if(init.target) {
        instance.observe(init.target, init.options)
    }
    return instance
}

// create an observer instance
const ob = observer({
    target : document.getElementById('some-id'),
    callback : mutations => {
        mutations.forEach(function(mutation) {
            console.log(mutation.type)
        })
    },
    attributes : true,
    childList : true,
    characterData : true
})

// later, you can stop observing
ob.disconnect();
