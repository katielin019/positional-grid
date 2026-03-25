const door = document.getElementById("cell-21");

door.classList.add("door");

door.addEventListener("click", () => {
    if (door.style.backgroundColor === "blue") {
        door.style.backgroundColor = "#333";
    } else {
        door.style.backgroundColor = "blue";
    }
});