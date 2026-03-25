- TODO: add a reset / return to home button?
    - needs to be sticky (?)
    - positioned over the grid (z-index)
    - should i center it at the origin of the grid? or start it somewhere random? (instead of at the top left cell)
        - should i use local browser storage to track what cells have been visited / interacted with?
- think about / look into windowing and virtualization for performance optimization
    - DOM limitations won't be a problem until handling thousands of individual divs
    - not sure if there's a difference between windowing and virtualization or if they're functionally interchangeable
    - basically just only renders the cells currently visible in the viewport to offload some of the DOM tree
- i wonder if vectors could come into play at all with this concept
    - honestly i've only recently begun to intuitively understand vectors, and i'm still getting a feel for when to apply them conceptually vs. not

```js
var element = document.querySelector('.map')
let infoVisible = false
const root = document.documentElement;

// And pass it to panzoom
let pz = panzoom(element, {
            minZoom: 0.3, maxZoom: 1.35, 
            beforeWheel: function(e) {
                var shouldIgnore = !(e.ctrlKey || e.metaKey || e.altKey)
                return shouldIgnore;
            },
            onTouch: function(e) {
                if(e.target.classList.contains('site-title')) return false
                else return true; // tells the library to not preventDefault.
            }
        })

pz.smoothZoom(500, 500, 0.3)

document.getElementById('site-count').innerText = document.querySelectorAll('.site').length
document.getElementById('section-count').innerText = document.querySelectorAll('section').length

pz.on('zoom', () => {
    let scale = pz.getTransform().scale
    root.style.setProperty('--title-size', (scale < 0.4 ? 1.05/scale : 2.7) * 12 + 'px') 
})

function toggleInfo(){
    let text = document.querySelector('.info-text')
    infoVisible ? text.style.display = "none" : text.style.display = "inline-block"
    infoVisible = !infoVisible
}

document.querySelector('main').addEventListener("wheel", (e) => {

    if(e.ctrlKey || e.metaKey || e.altKey){
        return false
    } 

    // if(e.target == "main"){
        e.preventDefault()
    // }

    let transform = pz.getTransform()
    let scale = transform.scale
    let x = transform.x
    let y = transform.y

    let deltaX = e.deltaX;
    let deltaY = e.deltaY;

    if(e.shiftKey) deltaX = 0

    pz.moveTo(x - deltaX, y - deltaY);
});
```