document.addEventListener('DOMContentLoaded', function () {
	var menuToggle = document.querySelector('.menu-toggle');
	var navigation = document.querySelector('.site-nav');
	var filterButtons = document.querySelectorAll('.filters button');
	var projects = document.querySelectorAll('.project-card');
	var enquiryForm = document.querySelector('#enquiry-form');

	menuToggle.addEventListener('click', function () {
		var isOpen = navigation.classList.toggle('open');
		menuToggle.setAttribute('aria-expanded', isOpen);
	});

	navigation.querySelectorAll('a').forEach(function (link) {
		link.addEventListener('click', function () { navigation.classList.remove('open'); });
	});

	filterButtons.forEach(function (button) {
		button.addEventListener('click', function () {
			var filter = button.dataset.filter;
			filterButtons.forEach(function (item) { item.classList.remove('active'); });
			button.classList.add('active');
			projects.forEach(function (project) {
				project.classList.toggle('is-hidden', filter !== 'all' && project.dataset.category !== filter);
			});
		});
	});

	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add('visible'); });
	}, { threshold: 0.12 });
	document.querySelectorAll('.reveal').forEach(function (element) { observer.observe(element); });

	enquiryForm.addEventListener('submit', function (event) {
		event.preventDefault();
		enquiryForm.querySelector('.form-status').textContent = 'Thank you. We will be in touch within two working days.';
		enquiryForm.reset();
	});
});