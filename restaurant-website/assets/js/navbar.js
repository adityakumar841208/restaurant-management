// Toggle navbar for mobile view

document.getElementById("menu-icon").onclick = ()=>{
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("active");
};

function scrollToTable(){
  document.getElementById('booktable').scrollIntoView({
    behavior:"smooth"
  });
}





