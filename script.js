document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const aboutBox = document.querySelector(".about-box");

  ScrollTrigger.create({
    trigger: ".about-website",
    start: "top 75%",
    onEnter: () => {
      aboutBox.classList.add("show");
    }
  });

  new SplitType(".text4", {
    types: "lines, words, chars",
    tagName: "span"
  });

  gsap.from(".text4 .char", {
    opacity: 0,
    y: 40,
    rotationZ: 8,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.02,
    scrollTrigger: {
      trigger: ".about-website",
      start: "top 70%",
      once: true
    }
  });
});