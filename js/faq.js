// faq.js: Logic for the collapsible FAQ sections.
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parentItem = question.closest('.faq-item');

            // Close all other open items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').classList.remove('active');
                }
            });

            // Toggle current item
            parentItem.classList.toggle('active');
            question.classList.toggle('active');
        });
    });
});