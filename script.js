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

    // --- Tự động lấy dữ liệu từ GitHub ---
    async function fetchGitHubData() {
        const username = 'manh2903';
        try {
            // Lấy thông tin profile
            const profileResponse = await fetch(`https://api.github.com/users/${username}`);
            const profileData = await profileResponse.json();

            // Lấy thông tin repositories
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
            const reposData = await reposResponse.json();

            // Cập nhật thông tin
            updateProfile(profileData);
            updateProjects(reposData);
            updateContactInfo(profileData);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ GitHub:', error);
        }
    }

    function updateProfile(profileData) {
        // Cập nhật tagline và intro
        const tagline = document.querySelector('.tagline');
        if (tagline) {
            tagline.textContent = 'Software Developer';
        }

        const intro = document.querySelector('.intro');
        if (intro) {
            intro.textContent = `Chào mừng đến với trang cá nhân của tôi! Tôi là một lập trình viên với kinh nghiệm trong Java và phát triển ứng dụng.`;
        }
    }

    function updateProjects(reposData) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        // Sắp xếp repositories theo thời gian cập nhật
        const sortedRepos = reposData
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 4); // Lấy 4 repos mới nhất

        projectsGrid.innerHTML = sortedRepos.map(repo => `
            <div class="project-card">
                <img src="./images/project-default.jpg" alt="${repo.name}">
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Dự án phát triển phần mềm'}</p>
                <div class="project-links">
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn-secondary">Xem Live</a>` : ''}
                    <a href="${repo.html_url}" target="_blank" class="btn-secondary">Mã Nguồn</a>
                </div>
            </div>
        `).join('');
    }

    function updateContactInfo(profileData) {
        const contactInfo = document.querySelector('.contact-info');
        if (!contactInfo) return;

        contactInfo.innerHTML = `
            <p><i class="fab fa-github"></i> GitHub: <a href="${profileData.html_url}" target="_blank">/manh2903</a></p>
            ${profileData.email ? `<p><i class="fas fa-envelope-open-text"></i> Email: <a href="mailto:${profileData.email}">${profileData.email}</a></p>` : ''}
            ${profileData.blog ? `<p><i class="fas fa-globe"></i> Website: <a href="${profileData.blog}" target="_blank">${profileData.blog}</a></p>` : ''}
        `;
    }

    // --- Active class cho Navigation khi cuộn ---
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

    // Gọi hàm fetch data từ GitHub
    fetchGitHubData();

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