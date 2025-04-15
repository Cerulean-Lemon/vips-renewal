let currentSlide = 1;
const totalSlides = 3;
let slideInterval;

/* =============================
   배너 슬라이드 관련 함수
============================= */

// 슬라이드 변경 함수
function changeSlide(index) {
  const bannerContainer = document.querySelector(".banner-container");
  const slideWidth = document.querySelector(".banner-slide").offsetWidth;
  const gap = 40;
  const indicators = document.querySelectorAll(".indicator-dot");

  currentSlide = index;
  const offset = (bannerContainer.offsetWidth - slideWidth) / 2;

  bannerContainer.style.transform = `translateX(-${
    currentSlide * (slideWidth + gap) - offset
  }px)`;

  indicators.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

// 자동 슬라이드 시작
function startAutoSlide() {
  stopAutoSlide();
  slideInterval = setInterval(() => {
    const nextSlide = (currentSlide + 1) % totalSlides;
    changeSlide(nextSlide);
  }, 2500);
}

// 자동 슬라이드 정지
function stopAutoSlide() {
  if (slideInterval) clearInterval(slideInterval);
}

// 인디케이터 클릭 이벤트
document.querySelectorAll(".indicator-dot").forEach((dot, index) => {
  dot.addEventListener("click", () => {
    changeSlide(index);
    stopAutoSlide();
    startAutoSlide();
  });
});

// 마우스 호버 시 자동 슬라이드 멈춤 / 복귀
const bannerSection = document.querySelector(".banner-section");
bannerSection.addEventListener("mouseenter", stopAutoSlide);
bannerSection.addEventListener("mouseleave", startAutoSlide);

// 터치 슬라이드
let touchStartX = 0;

bannerSection.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  stopAutoSlide();
});

bannerSection.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const threshold = 50;

  if (touchStartX - touchEndX > threshold) {
    changeSlide((currentSlide + 1) % totalSlides);
  } else if (touchEndX - touchStartX > threshold) {
    changeSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }

  startAutoSlide();
});

// 페이지 로드 시 두 번째 슬라이드로 설정
changeSlide(currentSlide);
startAutoSlide();

/* =============================
   스크롤 애니메이션 관련
============================= */

window.addEventListener("scroll", function () {
  const nav = document.querySelector(".nav");
  const stickyClass = "sticky-nav";
  if (window.scrollY > 0) {
    nav.classList.add(stickyClass);
  } else {
    nav.classList.remove(stickyClass);
  }

  // VIPS Menu 텍스트 애니메이션
  const menuTitle = document.querySelector(".vips-menu h2");
  const menuTitlePosition = menuTitle.getBoundingClientRect().top;
  const screenPosition = window.innerHeight / 1.2; // 화면의 1/1.2 지점에서 애니메이션 시작

  if (menuTitlePosition < screenPosition) {
    menuTitle.classList.add("visible"); // 텍스트에 페이드 인 효과 추가
  } else {
    menuTitle.classList.remove("visible"); // 스크롤이 맨 위로 올라가면 초기화
  }

  // About VIPS 섹션 애니메이션
  const aboutSection = document.querySelector(".about-vips");
  if (aboutSection) {
    const sectionPosition = aboutSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;

    if (sectionPosition < screenPosition) {
      document.querySelector(".about-text")?.classList.add("fade-in-left");
      document.querySelector(".about-image")?.classList.add("fade-in");
    } else {
      document.querySelector(".about-text")?.classList.remove("fade-in-left"); // 초기화
      document.querySelector(".about-image")?.classList.remove("fade-in"); // 초기화
    }
  }

  // VIPS Menu 섹션 애니메이션
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    const itemPosition = item.getBoundingClientRect().top;

    if (itemPosition < screenPosition) {
      item.classList.add("visible"); // 각 메뉴 아이템에 애니메이션 추가
    } else {
      item.classList.remove("visible"); // 스크롤이 맨 위로 올라가면 초기화
    }
  });
});

/* =============================
   부드러운 스크롤 기능
============================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();

    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let startTime = null;

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  });
});
