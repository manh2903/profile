document.addEventListener('DOMContentLoaded', function() {

    // --- Cập nhật năm hiện tại cho footer ---
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }

    // --- Hiệu ứng Fade-in khi cuộn đến section ---
    const sections = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // Quan sát so với viewport
        rootMargin: '0px',
        threshold: 0.1 // Kích hoạt khi 10% section hiển thị
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Ngừng quan sát khi đã hiển thị
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });


    // --- (Tùy chọn) Active class cho Navigation khi cuộn ---
    const navLinks = document.querySelectorAll('#navbar ul li a');
    const pageSections = document.querySelectorAll('main section'); // Chọn các section trong main

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        pageSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Thêm một khoảng offset nhỏ để kích hoạt sớm hơn một chút
            const offset = 50;
            if (pageYOffset >= sectionTop - sectionHeight / 3 - offset) {
                 currentSectionId = section.getAttribute('id');
            }
        });

         // Xử lý trường hợp đang ở section Hero (header)
        const heroSection = document.getElementById('hero');
        if (heroSection && pageYOffset < heroSection.offsetHeight - 50) {
             currentSectionId = ''; // Không active link nào khi ở trên cùng
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
             // Kiểm tra nếu href của link khớp với id section hiện tại
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
         // Nếu không có section nào được xác định (ở top), bỏ active tất cả
        if (!currentSectionId && pageYOffset < heroSection.offsetHeight - 50) {
             navLinks.forEach(link => link.classList.remove('active'));
        }
    });


     // --- (Tùy chọn) Xử lý Form Contact (chỉ hiển thị thông báo) ---
     // Lưu ý: Để form thực sự gửi đi, bạn cần backend hoặc dịch vụ như Formspree
     const contactForm = document.getElementById('contact-form');
     if (contactForm) {
         contactForm.addEventListener('submit', function(e) {
             // Ngăn chặn hành vi submit mặc định nếu không dùng dịch vụ ngoài
             // Nếu dùng Formspree hoặc tương tự, bạn có thể không cần dòng này
              e.preventDefault();

             // Chỉ hiển thị thông báo đơn giản
             alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');

             // (Tùy chọn) Xóa nội dung form sau khi gửi
              this.reset();
         });
     }

});