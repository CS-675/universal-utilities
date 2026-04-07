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
		this.isDragging = false;
		this.startX = 0;
		this.endX = 0;
		this.requiresDrag = false;
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
	}

	handleDragStart(event) {
		this.isDragging = true;
		this.startX = event.type.includes("mouse") ? event.pageX : event.touches[0].pageX;
	}

	handleDrag(event) {
		if (!this.isDragging) return;
		this.endX =  event.type.includes("mouse") ? event.pageX : event.touches[0].pageX;
		const distance = this.endX - this.startX;

		if (distance > 50) {
			this.handleMoveSlide("left");
			this.isDragging = false;
		} else if (distance < -50) {
			this.handleMoveSlide("right");
			this.isDragging = false;
		}
	}

	handleDragEnd(event) {
		this.isDragging = false;
		this.endX = event.type.includes("mouse") ? event.pageX : event.changedTouches[0].pageX;
	}

	initialiseItemsInView() {
		const windowWidth = window.innerWidth;

		this.breakpoints.forEach((breakpoint) => {
			if (windowWidth <= breakpoint.size) {
				this.slidesContainer.style.setProperty("--items-in-view", breakpoint.itemsInView);
				this.itemsInView = breakpoint.itemsInView;
			}
		});

		if (this.itemsInView === this.totalItems) {
			this.requiresDrag = false;
		} else {
			this.requiresDrag = true;
		}
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

		if (this.requiresDrag) {
			this.slidesContainer.style.cursor = "grab";
			
			this.slidesContainer.addEventListener("mousedown", () => (this.slidesContainer.style.cursor = "grabbing"));
			this.slidesContainer.addEventListener("mouseup", () => (this.slidesContainer.style.cursor = "grab"));

			this.slidesContainer.addEventListener("mousedown", (event) => this.handleDragStart(event));
			this.slidesContainer.addEventListener("touchstart", (event) => this.handleDragStart(event));
			this.slidesContainer.addEventListener("mousemove", (event) => this.handleDrag(event));
			this.slidesContainer.addEventListener("touchmove", (event) => this.handleDrag(event));
			this.slidesContainer.addEventListener("mouseup", (event) => this.handleDragEnd(event));
			this.slidesContainer.addEventListener("touchend", (event) => this.handleDragEnd(event));
		}
	}
}
