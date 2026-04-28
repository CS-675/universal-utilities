class CustomCarousel {
	constructor({
		carouselId,
		breakpoints = [
			{ size: 2560, itemsInView: 3 },
			{ size: 1024, itemsInView: 2 },
			{ size: 768, itemsInView: 1 },
		],
		infinite = true,
		autoplay = false,
		hasDrag = false,
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
		this.hasDrag = hasDrag;
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

	getTranslateX = () => -(this.currentSlideIndex * (100 / this.itemsInView));

	toggleDisabledClass = (arrow, condition) => arrow.classList[condition]("disabled");

	handleDisabledArrows() {
		if (this.currentSlideIndex === 0) {
			this.toggleDisabledClass(this.arrowLeft, "add");
		} else {
			this.toggleDisabledClass(this.arrowLeft, "remove");
		}
		if (this.currentSlideIndex === this.totalItems - this.itemsInView) {
			this.toggleDisabledClass(this.arrowRight, "add");
		} else {
			this.toggleDisabledClass(this.arrowRight, "remove");
		}
	}

	handleMoveSlide(direction) {
		if (direction === "left") {
			if (this.currentSlideIndex === 0) {
				if (this.infinite) {
					this.currentSlideIndex = this.totalItems - this.itemsInView;
				}
			} else {
				this.currentSlideIndex--;
			}
		} else {
			if (this.currentSlideIndex === this.totalItems - this.itemsInView) {
				if (this.infinite) {
					this.currentSlideIndex = 0;
				}
			} else {
				this.currentSlideIndex++;
			}
		}

		if (!this.infinite && this.hasArrows) {
			this.handleDisabledArrows();
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

	initialiseDrag() {
		this.removeDrag();

		if (this.itemsInView < this.totalItems) {
			this.slidesContainer.style.cursor = "grab";

			this.slidesContainer.addEventListener("mousedown", () => (this.slidesContainer.style.cursor = "grabbing"));
			this.slidesContainer.addEventListener("mouseup", () => (this.slidesContainer.style.cursor = "grab"));

			this.slidesContainer.addEventListener("mousedown", (this.dragStartHandler = this.dragStartHandler || ((event) => this.handleDragStart(event))));
			this.slidesContainer.addEventListener("touchstart", (this.dragStartHandlerTouch = this.dragStartHandlerTouch || ((event) => this.handleDragStart(event))));
			this.slidesContainer.addEventListener("mousemove", (this.dragHandler = this.dragHandler || ((event) => this.handleDrag(event))));
			this.slidesContainer.addEventListener("touchmove", (this.dragHandlerTouch = this.dragHandlerTouch || ((event) => this.handleDrag(event))));
			this.slidesContainer.addEventListener("mouseup", (this.dragEndHandler = this.dragEndHandler || ((event) => this.handleDragEnd(event))));
			this.slidesContainer.addEventListener("touchend", (this.dragEndHandlerTouch = this.dragEndHandlerTouch || ((event) => this.handleDragEnd(event))));
		}
	}

	removeDrag() {
		this.slidesContainer.style.cursor = "default";

		if (this.dragStartHandler) this.slidesContainer.removeEventListener("mousedown", this.dragStartHandler);
		if (this.dragStartHandlerTouch) this.slidesContainer.removeEventListener("touchstart", this.dragStartHandlerTouch);
		if (this.dragHandler) this.slidesContainer.removeEventListener("mousemove", this.dragHandler);
		if (this.dragHandlerTouch) this.slidesContainer.removeEventListener("touchmove", this.dragHandlerTouch);
		if (this.dragEndHandler) this.slidesContainer.removeEventListener("mouseup", this.dragEndHandler);
		if (this.dragEndHandlerTouch) this.slidesContainer.removeEventListener("touchend", this.dragEndHandlerTouch);
	}

	initialiseArrows() {
		const arrowLeft = document.createElement("button");
		const arrowRight = document.createElement("button");

		arrowLeft.classList.add("custom-carousel-arrow-left");
		arrowLeft.innerHTML = `<i class="fa-solid fa-angle-left"></i>`;
		arrowLeft.addEventListener("click", () => this.handleMoveSlide("left"));

		arrowRight.classList.add("custom-carousel-arrow-right");
		arrowRight.innerHTML = `<i class="fa-solid fa-angle-right"></i>`;
		arrowRight.addEventListener("click", () => this.handleMoveSlide("right"));

		if (!this.infinite && this.hasArrows) {
			if (this.currentSlideIndex === 0) {
				this.toggleDisabledClass(arrowLeft, "add");
			} else if (this.currentSlideIndex === this.totalItems - this.itemsInView) {
				this.toggleDisabledClass(arrowRight, "add");
			}
		}

		this.removeArrows();

		this.carousel.insertBefore(arrowLeft, this.carousel.firstChild);
		this.carousel.appendChild(arrowRight);

		this.arrowLeft = arrowLeft;
		this.arrowRight = arrowRight;
	}

	removeArrows() {
		if (this.hasArrows) {
			if (this.arrowLeft) this.arrowLeft.remove();
			if (this.arrowRight) this.arrowRight.remove();
		}
	}

	initialiseIndicators() {
		const indicatorsContainer = document.createElement("div");
		indicatorsContainer.classList.add("custom-carousel-indicators");

		indicatorsContainer.innerHTML = `
			${Array.from({ length: this.totalItems - this.itemsInView + 1 }, (_, index) => `<button class="custom-carousel-indicator ${index === 0 ? "active" : ""}" data-index="${index}"></button>`).join("")}
		`;

		this.removeIndicators();

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

	removeIndicators() {
		if (this.hasIndicators && this.indicatorsContainer) {
			this.indicatorsContainer.remove();
			this.indicatorsContainer = null;
		}
	}

	initialise() {
		this.initialiseItemsInView();

		if (this.itemsInView < this.totalItems) {
			if (this.hasDrag || !this.hasArrows) this.initialiseDrag();
			if (this.hasArrows) this.initialiseArrows();
			if (this.hasIndicators) this.initialiseIndicators();
		}

		window.addEventListener("resize", () => {
			this.currentSlideIndex = 0;
			this.slidesContainer.style.transform = `translateX(0%)`;
			this.initialiseItemsInView();

			if (this.itemsInView < this.totalItems) {
				if (this.hasDrag) {
					this.initialiseDrag();
				}

				if (this.hasArrows) {
					this.initialiseArrows();
				}

				if (this.hasIndicators) {
					this.initialiseIndicators();
				}
			} else {
				if (this.hasDrag) {
					this.removeDrag();
				}
				if (this.hasArrows) {
					this.removeArrows();
				}
				if (this.hasIndicators) {
					this.removeIndicators();
				}
			}
		});
	}
}
