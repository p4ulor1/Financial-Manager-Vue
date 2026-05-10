class Carousel {
  constructor(element) {
    this._carousel = element;
    this._carouselItems = Array.from(
      this._carousel.querySelectorAll(".carousel-item")
    );
    this._activeCarouselIndex = this._getActiveItemIndex();
    this._isSwitching = false;

    this._setPrevNext();
    this._setEventListeners();
  }

  prev() {
    if (this._isSwitching) {
      return;
    }

    this._isSwitching = true;
    const prev = this._findPrev();
    const next = this._findNext();

    this._carouselItems[this._activeCarouselIndex].classList.add("move-r");
    this._carouselItems[prev].classList.add("move");
    this._carouselItems[next].classList.remove("next");

    setTimeout(() => {
      this._carouselItems[prev].classList.add("active");
      this._carouselItems[this._activeCarouselIndex].classList.remove(
        "active",
        "move-r"
      );
      this._carouselItems[prev].classList.remove("prev", "move");

      this._activeCarouselIndex = prev;
      this._setPrevNext();
      this._isSwitching = false;
    }, 500);
  }

  next() {
    if (this._isSwitching) {
      return;
    }

    this._isSwitching = true;
    const prev = this._findPrev();
    const next = this._findNext();

    this._carouselItems[this._activeCarouselIndex].classList.add("move-l");
    this._carouselItems[next].classList.add("move");
    this._carouselItems[prev].classList.remove("prev");

    setTimeout(() => {
      this._carouselItems[next].classList.add("active");
      this._carouselItems[this._activeCarouselIndex].classList.remove(
        "active",
        "move-l"
      );
      this._carouselItems[next].classList.remove("next", "move");

      this._activeCarouselIndex = next;
      this._setPrevNext();
      this._isSwitching = false;
    }, 500);
  }

  // PRIVATE
  _getActiveItemIndex() {
    let activeIndex = this._carouselItems.findIndex((el) =>
      el.classList.contains("active")
    );

    if (activeIndex === -1) {
      activeIndex = 0;
      this._carouselItems[activeIndex].classList.add("active");
    }

    return activeIndex;
  }

  _setPrevNext() {
    const prev = this._findPrev();
    const next = this._findNext();

    this._carouselItems[prev].classList.add("prev");
    this._carouselItems[next].classList.add("next");
  }

  _findPrev() {
    return this._activeCarouselIndex - 1 < 0
      ? this._carouselItems.length - 1
      : this._activeCarouselIndex - 1;
  }

  _findNext() {
    return this._activeCarouselIndex + 1 >= this._carouselItems.length
      ? 0
      : this._activeCarouselIndex + 1;
  }

  _setEventListeners() {
    this._carousel.querySelector(".carousel-prev-btn").onclick = () => {
      this.prev();
    };
    this._carousel.querySelector(".carousel-next-btn").onclick = () => {
      this.next();
    };
  }
}

window.onload = () => {
  const carouselEls = document.querySelectorAll(".carousel");
  let carousel = null;

  carouselEls.forEach((el) => {
    carousel = new Carousel(el);
  });
};
