window.addEventListener("hashchange", function () {
  window.scrollTo(window.scrollX, window.scrollY - 65);
});

// ############################# Menu icon & navigation bar #############################
var menuIcon = document.querySelector(".menuIcon");
var navListBackground = document.querySelector(".navListBackground");
var navList = document.querySelector(".navList");
var closeMenu = document.querySelector(".closeMenu i");

menuIcon.addEventListener("click", () => {
  navListBackground.style.display = "flex";
  navList.style.display = "flex";
  disableScorlling();
});

closeMenu.addEventListener("click", () => {
  navListBackground.style.display = "none";
  navList.style.display = "none";

  enableScrolling();
});

var albums = document.querySelectorAll('[class*="album-"]');
albums.forEach((album) => {
  album.addEventListener("click", openGallery);
});

var albumNumber;

// Create a localStorage variable
localStorage.galleryIndex = 0;
var galleryINDEX = localStorage.galleryIndex;

// ############################# Disable Scorlling #############################
function disableScorlling() {
  document.body.classList.add("stop-scrolling");
}

// ############################# Enable Scorlling #############################
function enableScrolling() {
  document.body.classList.remove("stop-scrolling");
}

// ############################# Get Album Number #############################
function getAlbumNumber(e) {
  var currentAlbum = e.target.src;
  const pattern = /img\/album-(.*)\/image/;
  albumNumber = currentAlbum.match(pattern)[1];
  return albumNumber;
}

// ############################# Gallery Full Screen #############################
function galleryFullScreen(albumNumber) {
  const closeGallery = document.createElement("div");
  closeGallery.classList = "closeGallery";
  const close = document.createElement("i");
  close.classList.add("fa-solid");
  close.classList.add("fa-xmark");
  closeGallery.appendChild(close);

  const gallerySlider = document.createElement("div");
  gallerySlider.id = "gallerySlider";

  const left = document.createElement("div");
  left.className = "left";
  const leftIcon = document.createElement("i");
  leftIcon.classList.add("fa-solid");
  leftIcon.classList.add("fa-chevron-left");
  leftIcon.classList.add("fa-2xl");
  left.appendChild(leftIcon);

  const mainImage = document.createElement("div");
  mainImage.id = "mainImage";
  const img = document.createElement("img");
  img.src = `img/album-${albumNumber}/image1.jpg`;
  mainImage.appendChild(img);

  const right = document.createElement("div");
  right.className = "right";
  const rightIcon = document.createElement("i");
  rightIcon.classList.add("fa-solid");
  rightIcon.classList.add("fa-chevron-right");
  rightIcon.classList.add("fa-2xl");
  right.appendChild(rightIcon);

  gallerySlider.appendChild(left);
  gallerySlider.appendChild(mainImage);
  gallerySlider.appendChild(right);

  const thumbnailContainer = document.createElement("div");
  thumbnailContainer.id = "thumbnailContainer";
  const thumbnails = document.createElement("div");
  thumbnails.id = "thumbnails";
  thumbnailContainer.appendChild(thumbnails);

  var size = document.querySelector(`.album-${albumNumber}`).dataset.size - 1;
  for (let i = 1; i <= size; i++) {
    const thumbnail = document.createElement("div");
    thumbnail.className = "thumbnail";
    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = `img/album-${albumNumber}/image${i}.jpg`;
    thumbnail.appendChild(thumbnailImage);
    thumbnails.appendChild(thumbnail);
  }

  const galleryFullScreen = document.createElement("div");
  galleryFullScreen.id = "galleryFullScreen";
  galleryFullScreen.appendChild(closeGallery);
  galleryFullScreen.appendChild(gallerySlider);
  galleryFullScreen.appendChild(thumbnailContainer);

  document.body.appendChild(galleryFullScreen);

  // ############### close the gallery full screen ###############
  closeGallery.onclick = () => {
    enableScrolling();
    galleryFullScreen.remove();
  };
  // or
  document.addEventListener("keyup", function () {
    evt = window.event;
    if (evt.key === "Escape") {
      enableScrolling();
      galleryFullScreen.remove();
    }
  });

  // ############### left & right arrow ###############
  var thumbnailWidth = thumbnails.offsetWidth;
  left.onclick = () => {
    if (galleryINDEX <= 0) {
      galleryINDEX = size - 1;
      thumbnails.scrollLeft = thumbnailWidth;
    } else {
      galleryINDEX--;
      // thumbnails.scrollLeft = galleryINDEX * (thumbnailWidth / size);
      thumbnails.scrollLeft -= thumbnailWidth / size;
    }
    Selected(galleryINDEX);
  };

  right.onclick = () => {
    if (galleryINDEX >= size - 1) {
      galleryINDEX = 0;
      thumbnails.scrollLeft = 0;
    } else {
      galleryINDEX++;
      // thumbnails.scrollLeft = galleryINDEX * (thumbnailWidth / size);
      thumbnails.scrollLeft += thumbnailWidth / size;
    }
    Selected(galleryINDEX);
  };
}

// ############################# Drag Thumbnails #############################
function dragThumbnails() {
  const slider = document.querySelector("#thumbnails");
  var isDown = false;
  var startX;
  var scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) {
      return;
    }
    e.preventDefault();
    var x = e.pageX - slider.offsetLeft;
    var walk = x - startX;
    slider.scrollLeft = scrollLeft - walk;
  });
}

// ############################# selected thumbnail #############################
function Selected(index) {
  var thumbnails = document.querySelectorAll(".thumbnail");
  var thumbnailImage = document.querySelectorAll(".thumbnail img");
  var mainImage = document.querySelector("#mainImage img");
  for (let i = 0; i < thumbnails.length; i++) {
    if (i == index) {
      mainImage.src = thumbnailImage[galleryINDEX].src;
      thumbnails[index].classList.add("selected");
      thumbnailImage[index].style.filter = "opacity(1)";
    } else {
      thumbnails[i].classList.remove("selected");
      thumbnailImage[i].style.filter = "opacity(0.2)";
    }
  }
}

// ############################# current thumbnail #############################
function currentThumbnail() {
  var thumbnailImage = document.querySelectorAll(".thumbnail img");
  Selected(galleryINDEX);

  thumbnailImage.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      var thumbnailsList = Array.from(thumbnailImage);
      var thumbnailIndex = thumbnailsList.indexOf(thumbnail);
      galleryINDEX = thumbnailIndex;
      Selected(galleryINDEX);
    });

    // Hover on an thumbnail
    thumbnail.addEventListener("mouseover", () => {
      thumbnail.style.filter = "opacity(1)";
    });

    thumbnail.addEventListener("mouseout", () => {
      Selected(galleryINDEX);
    });
  });
}

// ############################# create the gallery full screen #############################
function openGallery(e) {
  galleryINDEX = 0;
  disableScorlling();
  getAlbumNumber(e);
  galleryFullScreen(albumNumber);
  dragThumbnails();
  currentThumbnail();
}

// ############################# Go-UP #############################  //
var goUP = document.getElementById("goUP");
window.addEventListener("scroll", function () {
  if (scrollY >= 240) {
    goUP.style.display = "flex";
  } else {
    goUP.style.display = "none";
  }
});

function goUPFunction() {
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
goUP.addEventListener("click", goUPFunction);
