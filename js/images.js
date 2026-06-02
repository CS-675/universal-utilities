const handleImageSwap = (event) => {
	const mainImage = document.querySelector("#main_image img");

	mainImage.src = event.target.src;
	mainImage.alt = event.target.alt;
};

const handleImageRollover = (event) => {
    const mainImage = document.querySelector("#main_image img");

    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    event.target.style.backgroundImage = `url(${mainImage.src})`;
    event.target.style.backgroundPosition = `${x}% ${y}%`;
    event.target.style.backgroundSize = "200%";
    event.target.style.backgroundRepeat = "no-repeat";
}