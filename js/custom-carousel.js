class CustomCarousel {
	constructor({
		carouselId,
		breakpoints = [
			{ size: 2560, itemsInView: 3 },
			{ size: 1440, itemsInView: 3 },
			{ size: 1024, itemsInView: 2 },
			{ size: 768, itemsInView: 1 },
			{ size: 425, itemsInView: 1 },
			{ size: 375, itemsInView: 1 },
			{ size: 320, itemsInView: 1 },
		],
		infinite = true,
		autoplay = false,
		hasIndicators = true,
		hasArrows = true,
	}) {
		this.carousel = document.getElementById(carouselId);
		this.slidesContainer = this.carousel.querySelector(".carousel-slides");
		this.totalItems = this.slidesContainer.children.length;
		this.breakpoints = breakpoints;
		this.infinite = infinite;
		this.autoplay = autoplay;
		this.hasIndicators = hasIndicators;
		this.hasArrows = hasArrows;
		this.currentSlideIndex = 0;
		this.arrowLeft = null;
		this.arrowRight = null;
		this.itemsInView = 1;
	}

	toggleDisabledClass(arrow, condition) {
		if (condition) {
			arrow.classList.add("disabled");
		} else {
			arrow.classList.remove("disabled");
		}
	}

	handleMoveSlide(direction) {
		if (direction === "left") {
			if (this.currentSlideIndex === 0) {
				if (this.infinite) {
					this.currentSlideIndex = this.totalItems - this.itemsInView;
				} else {
					this.toggleDisabledClass(this.arrowRight, false);
				}
			} else {
				this.currentSlideIndex--;
			}
		} else {
			if (this.currentSlideIndex === this.totalItems - this.itemsInView) {
				if (this.infinite) {
					this.currentSlideIndex = 0;
				} else {
					this.toggleDisabledClass(this.arrowLeft, false);
				}
			} else {
				this.currentSlideIndex++;
			}
		}

		this.slidesContainer.style.transform = `translateX(-${this.currentSlideIndex * (100 / this.itemsInView)}%)`;
	}

	initialiseItemsInView() {
		const windowWidth = window.innerWidth;

		this.breakpoints.forEach((breakpoint) => {
			if (windowWidth <= breakpoint.size) {
				this.slidesContainer.style.setProperty("--items-in-view", breakpoint.itemsInView);
				this.itemsInView = breakpoint.itemsInView;
			}
		});
	}

	initialiseIndicators() {}

	initialiseArrows() {
		const arrowLeft = document.createElement("button");
		const arrowRight = document.createElement("button");

		arrowLeft.classList.add("carousel-arrow-left");
		arrowRight.classList.add("carousel-arrow-right");

		arrowLeft.innerHTML = `
			<i class="fa-solid fa-arrow-left"></i>
		`;

		arrowRight.innerHTML = `
			<i class="fa-solid fa-arrow-right"></i>
        `;

		arrowLeft.addEventListener("click", () => this.handleMoveSlide("left"));
		arrowRight.addEventListener("click", () => this.handleMoveSlide("right"));

		this.carousel.insertBefore(arrowLeft, this.carousel.firstChild);
		this.carousel.appendChild(arrowRight);

		this.arrowLeft = arrowLeft;
		this.arrowRight = arrowRight;
	}

	initialise() {
		this.initialiseItemsInView();
		this.initialiseArrows();
	}
}
