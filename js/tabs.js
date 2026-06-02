const showTabContent = (event) => {
	const selecetedTabId = event.target.getAttribute("data-tab-id");
	const tabLinks = document.querySelectorAll(".tab-link");
	const tabContents = document.querySelectorAll(".tab-content");

	tabLinks.forEach((link) => {
		link.classList.remove("active");
		link.getAttribute("data-tab-id") === selecetedTabId ? link.classList.add("active") : "";
	});

	tabContents.forEach((content) => {
		content.classList.remove("active");
		content.getAttribute("data-tab-id") === selecetedTabId ? content.classList.add("active") : "";
	});
};
