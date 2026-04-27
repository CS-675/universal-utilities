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
		hasIndicators = false,
		hasArrows = false,
	}) {
		this.carousel = document.getElementById(carouselId);
		this.innerContainer = this.carousel.querySelector(".custom-carousel-inner");
		this.slidesContainer = this.carousel.querySelector(".custom-carousel-slides");
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
		this.isDragging = false;
		this.startX = 0;
		this.endX = 0;
		this.indicatorsContainer = null;
	}

	getTranslateX() {
		return -(this.currentSlideIndex * (100 / this.itemsInView));
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

		this.slidesContainer.style.transform = `translateX(${this.getTranslateX()}%)`;

		if (this.indicatorsContainer) {
			const indicators = this.indicatorsContainer.querySelectorAll(".custom-carousel-indicator");
			indicators.forEach((ind) => ind.classList.remove("active"));
			if (indicators[this.currentSlideIndex]) {
				indicators[this.currentSlideIndex].classList.add("active");
			}
		}
	}

	handleDragStart(event) {
		this.isDragging = true;
		this.startX = event.type.includes("mouse") ? event.clientX : event.touches[0].clientX;
		this.slidesContainer.style.transition = "none";
	}

	handleDrag(event) {
		if (!this.isDragging) return;
		this.endX = event.type.includes("mouse") ? event.clientX : event.touches[0].clientX;
		const distance = this.endX - this.startX;
		const dragPercent = (distance / window.innerWidth) * 100;

		this.slidesContainer.style.transform = `translateX(${this.getTranslateX() + dragPercent}%)`;
	}

	handleDragEnd(event) {
		this.isDragging = false;
		this.endX = event.type.includes("mouse") ? event.clientX : event.changedTouches[0].clientX;
		const distance = this.endX - this.startX;

		this.slidesContainer.style.transition = "transform 0.3s ease-out";

		if (distance > 50) {
			this.handleMoveSlide("left");
		} else if (distance < -50) {
			this.handleMoveSlide("right");
		} else {
			this.slidesContainer.style.transform = `translateX(${this.getTranslateX()}%)`;
		}
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

	initialiseEventListeners() {
		if (this.itemsInView < this.totalItems) {
			this.slidesContainer.style.cursor = "grab";

			this.slidesContainer.addEventListener("mousedown", () => (this.slidesContainer.style.cursor = "grabbing"));
			this.slidesContainer.addEventListener("mouseup", () => (this.slidesContainer.style.cursor = "grab"));

			this.slidesContainer.addEventListener("mousedown", (event) => this.handleDragStart(event));
			this.slidesContainer.addEventListener("touchstart", (event) => this.handleDragStart(event));
			this.slidesContainer.addEventListener("mousemove", (event) => this.handleDrag(event));
			this.slidesContainer.addEventListener("touchmove", (event) => this.handleDrag(event));
			this.slidesContainer.addEventListener("mouseup", (event) => this.handleDragEnd(event));
			this.slidesContainer.addEventListener("touchend", (event) => this.handleDragEnd(event));
		} else {
			this.slidesContainer.style.cursor = "default";

			this.slidesContainer.removeEventListener("mousedown", (event) => this.handleDragStart(event));
			this.slidesContainer.removeEventListener("touchstart", (event) => this.handleDragStart(event));
			this.slidesContainer.removeEventListener("mousemove", (event) => this.handleDrag(event));
			this.slidesContainer.removeEventListener("touchmove", (event) => this.handleDrag(event));
			this.slidesContainer.removeEventListener("mouseup", (event) => this.handleDragEnd(event));
			this.slidesContainer.removeEventListener("touchend", (event) => this.handleDragEnd(event));
		}
	}

	initialiseIndicators() {
		const indicatorsContainer = document.createElement("div");
		indicatorsContainer.classList.add("custom-carousel-indicators");

		indicatorsContainer.innerHTML = `
			${Array.from({ length: this.totalItems - this.itemsInView + 1 }, (_, index) => `<button class="custom-carousel-indicator ${index === 0 ? "active" : ""}" data-index="${index}"></button>`).join("")}
		`;

		this.innerContainer.appendChild(indicatorsContainer);
		this.indicatorsContainer = indicatorsContainer;

		const indicators = indicatorsContainer.querySelectorAll(".custom-carousel-indicator");

		indicators.forEach((indicator) => {
			indicator.addEventListener("click", () => {
				this.currentSlideIndex = parseInt(indicator.getAttribute("data-index"));
				this.slidesContainer.style.transform = `translateX(${this.getTranslateX()}%)`;
				indicators.forEach((ind) => ind.classList.remove("active"));
				indicator.classList.add("active");
			});
		});
	}

	initialiseArrows() {
		const arrowLeft = document.createElement("button");
		const arrowRight = document.createElement("button");

		arrowLeft.classList.add("custom-carousel-arrow-left");
		arrowRight.classList.add("custom-carousel-arrow-right");

		arrowLeft.innerHTML = `<i class="fa-solid fa-angle-left"></i>`;
		arrowRight.innerHTML = `<i class="fa-solid fa-angle-right"></i>`;

		arrowLeft.addEventListener("click", () => this.handleMoveSlide("left"));
		arrowRight.addEventListener("click", () => this.handleMoveSlide("right"));

		this.carousel.insertBefore(arrowLeft, this.carousel.firstChild);
		this.carousel.appendChild(arrowRight);

		this.arrowLeft = arrowLeft;
		this.arrowRight = arrowRight;
	}

	initialise() {
		this.initialiseItemsInView();
		this.initialiseEventListeners();

		if (this.hasArrows) this.initialiseArrows();
		if (this.hasIndicators) this.initialiseIndicators();
	}
}
