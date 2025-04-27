// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Navbar scroll effect
  var lastScrollTop = 0; // This Variable will store the top position
  var navbar = document.getElementById("navbar"); // Get The NavBar

  window.addEventListener("scroll", function () {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (window.innerWidth <= 768 && navbar) {
      if (scrollTop > lastScrollTop) {
        navbar.style.top = "-80px";
      } else {
        navbar.style.top = "0";
      }
    }
    lastScrollTop = scrollTop;
  });

  // For setting toggle menu
  var audio = document.getElementById("audioPlayer"),
    loader = document.getElementById("preloader");

  window.settingtoggle = function () {
    var settingContainer = document.getElementById("setting-container");
    var visualModeToggle = document.getElementById(
      "visualmodetogglebuttoncontainer"
    );
    var soundToggle = document.getElementById("soundtogglebuttoncontainer");

    if (settingContainer) settingContainer.classList.toggle("settingactivate");
    if (visualModeToggle) visualModeToggle.classList.toggle("visualmodeshow");
    if (soundToggle) soundToggle.classList.toggle("soundmodeshow");
  };

  window.playpause = function () {
    if (audio) {
      var soundSwitch = document.getElementById("switchforsound");
      if (soundSwitch && !soundSwitch.checked) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  window.visualmode = function () {
    document.body.classList.toggle("light-mode");
    document.querySelectorAll(".needtobeinvert").forEach(function (e) {
      e.classList.toggle("invertapplied");
    });
  };

  // Handle page load
  window.addEventListener("load", function () {
    if (loader) {
      loader.style.display = "none";
    }

    var heyElement = document.querySelector(".hey");
    if (heyElement) {
      heyElement.classList.add("popup");
    }
  });

  // Mobile menu variables
  var emptyArea = document.getElementById("emptyarea"),
    mobileTogglemenu = document.getElementById("mobiletogglemenu");

  window.hamburgerMenu = function () {
    document.body.classList.toggle("stopscrolling");

    var mobileMenu = document.getElementById("mobiletogglemenu");
    var bar1 = document.getElementById("burger-bar1");
    var bar2 = document.getElementById("burger-bar2");
    var bar3 = document.getElementById("burger-bar3");

    if (mobileMenu) mobileMenu.classList.toggle("show-toggle-menu");
    if (bar1) bar1.classList.toggle("hamburger-animation1");
    if (bar2) bar2.classList.toggle("hamburger-animation2");
    if (bar3) bar3.classList.toggle("hamburger-animation3");
  };

  window.hidemenubyli = function () {
    document.body.classList.toggle("stopscrolling");

    var mobileMenu = document.getElementById("mobiletogglemenu");
    var bar1 = document.getElementById("burger-bar1");
    var bar2 = document.getElementById("burger-bar2");
    var bar3 = document.getElementById("burger-bar3");

    if (mobileMenu) mobileMenu.classList.remove("show-toggle-menu");
    if (bar1) bar1.classList.remove("hamburger-animation1");
    if (bar2) bar2.classList.remove("hamburger-animation2");
    if (bar3) bar3.classList.remove("hamburger-animation3");
  };

  // Section highlighting for navigation
  const sections = document.querySelectorAll("section") || [],
    navLi =
      document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li") ||
      [],
    mobilenavLi =
      document.querySelectorAll(
        ".mobiletogglemenu .mobile-navbar-tabs-ul li"
      ) || [];

  window.addEventListener("scroll", () => {
    let currentSection = "";
    sections.forEach((section) => {
      let sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 200) {
        currentSection = section.getAttribute("id");
      }
    });

    // Special case for education section - highlight the about section as well
    if (currentSection === "education") {
      currentSection = "about";
    }

    mobilenavLi.forEach((li) => {
      li.classList.remove("activeThismobiletab");
      if (li.classList.contains(currentSection)) {
        li.classList.add("activeThismobiletab");
      }
    });

    navLi.forEach((li) => {
      li.classList.remove("activeThistab");
      if (li.classList.contains(currentSection)) {
        li.classList.add("activeThistab");
      }
    });
  });

  console.log(
    "%c Designed and Developed by Ishan Savaliya",
    "background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;"
  );

  // Back to top button
  let mybutton = document.getElementById("backtotopbutton");

  function scrollFunction() {
    if (mybutton) {
      if (
        document.body.scrollTop > 400 ||
        document.documentElement.scrollTop > 400
      ) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
  }

  window.scrolltoTopfunction = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  window.onscroll = function () {
    scrollFunction();
  };

  // Prevent right-click on images
  document.addEventListener(
    "contextmenu",
    function (e) {
      if (e.target.nodeName === "IMG") {
        e.preventDefault();
      }
    },
    false
  );

  // For Pupil follow Animation
  let Pupils = document.getElementsByClassName("footer-pupil"),
    pupilsArr = Array.from(Pupils),
    pupilStartPoint = -10,
    pupilRangeX = 20,
    pupilRangeY = 15,
    mouseXStartPoint = 0,
    mouseXEndPoint = window.innerWidth,
    currentXPosition = 0,
    fracXValue = 0,
    mouseYEndPoint = window.innerHeight,
    currentYPosition = 0,
    fracYValue = 0,
    mouseXRange = mouseXEndPoint - mouseXStartPoint;

  const mouseMove = (e) => {
    fracXValue =
      (currentXPosition = e.clientX - mouseXStartPoint) / mouseXRange;
    fracYValue = (currentYPosition = e.clientY) / mouseYEndPoint;

    let xPosition = pupilStartPoint + fracXValue * pupilRangeX;
    let yPosition = pupilStartPoint + fracYValue * pupilRangeY;

    pupilsArr.forEach((pupil) => {
      pupil.style.transform = `translate(${xPosition}px, ${yPosition}px)`;
    });
  };

  const windowResize = () => {
    mouseXEndPoint = window.innerWidth;
    mouseYEndPoint = window.innerHeight;
    mouseXRange = mouseXEndPoint - mouseXStartPoint;
  };

  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("resize", windowResize);

  // Improved popup form functions to eliminate lag
  window.openPopup = function () {
    const popupForm = document.getElementById("popupForm");
    popupForm.style.display = "block";
    popupForm.classList.remove("fade-out");
    document.body.classList.add("stopscrolling");

    // Completely disable animated cursor while form is open
    document.querySelectorAll(".circle").forEach((circle) => {
      // Hide instead of just changing opacity for better performance
      circle.style.display = "none";
    });

    // Use regular cursor for typing
    document.body.style.cursor = "auto";

    // Force text cursor on form inputs
    document
      .querySelectorAll("#popupForm input, #popupForm textarea")
      .forEach((input) => {
        input.style.cursor = "text";
      });
  };

  window.closePopup = function () {
    const popupForm = document.getElementById("popupForm");
    popupForm.classList.add("fade-out");
    setTimeout(() => {
      popupForm.style.display = "none";
      document.body.classList.remove("stopscrolling");

      // Re-enable cursor animations
      document.querySelectorAll(".circle").forEach((circle) => {
        circle.style.display = "";
      });

      // Restore default cursor style
      document.body.style.cursor = "";
    }, 500);
  };

  // Close popup when clicking outside
  window.onclick = function (event) {
    const popup = document.getElementById("popupForm");
    if (event.target === popup) {
      closePopup();
    }
  };

  // For animated cursor
  const coords = { x: 0, y: 0 };
  const circles = document.querySelectorAll(".circle");

  if (circles.length > 0) {
    const colors = [
      "#ffb56b",
      "#fdaf69",
      "#f89d63",
      "#f59761",
      "#ef865e",
      "#ec805d",
      "#e36e5c",
      "#df685c",
      "#d5585c",
      "#d1525c",
      "#c5415d",
      "#c03b5d",
      "#b22c5e",
      "#ac265e",
      "#9c155f",
      "#950f5f",
      "#830060",
      "#7c0060",
      "#680060",
      "#60005f",
      "#48005f",
      "#3d005e",
    ];

    circles.forEach(function (circle, index) {
      circle.x = 0;
      circle.y = 0;
      circle.style.backgroundColor = colors[index % colors.length];
    });

    window.addEventListener("mousemove", function (e) {
      coords.x = e.clientX;
      coords.y = e.clientY;
    });

    function animateCircles() {
      let x = coords.x;
      let y = coords.y;

      circles.forEach(function (circle, index) {
        circle.style.left = x - 12 + "px";
        circle.style.top = y - 12 + "px";
        circle.style.scale = (circles.length - index) / circles.length;

        circle.x = x;
        circle.y = y;

        const nextCircle = circles[index + 1] || circles[0];
        x += (nextCircle.x - x) * 0.4;
        y += (nextCircle.y - y) * 0.4;
      });

      requestAnimationFrame(animateCircles);
    }

    animateCircles();
  }
});
