document.addEventListener('DOMContentLoaded', function() {

    const GITHUB_USERNAME = 'manh2903';

    // --- Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- Navbar & Back to Top Logic ---
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Intersection Observer for Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- GitHub Data ---
    async function fetchGitHubData() {
        try {
            const [profileRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
                fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`)
            ]);

            if (!profileRes.ok || !reposRes.ok) throw new Error('GitHub API response not OK');

            const profile = await profileRes.json();
            const repos = await reposRes.json();

            renderProjects(repos);
            renderContact(profile);
        } catch (error) {
            console.error('Data loading error:', error);
            renderError('Không thể tải dữ liệu từ GitHub. Vui lòng kiểm tra kết nối mạng.');
        }
    }

    function renderProjects(repos) {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;

        // Lọc bỏ forks và repos rác
        const filteredRepos = repos
            .filter(repo => !repo.fork && repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
            .slice(0, 6);

        if (filteredRepos.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Chưa có dự án nào được hiển thị.</p>';
            return;
        }

        grid.innerHTML = filteredRepos.map(repo => `
            <div class="project-card">
                <div class="project-thumbnail">
                    <img src="https://opengraph.githubassets.com/1/${repo.full_name}" alt="${repo.name}" onerror="this.src='./images/project-default.jpg'">
                </div>
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Giải pháp phát triển phần mềm tập trung vào tối ưu hóa hiệu suất và trải nghiệm người dùng.'}</p>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="btn-secondary">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn-secondary"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                </div>
            </div>
        `).join('');
    }

    function renderContact(profile) {
        const contactArea = document.querySelector('.contact-info');
        if (!contactArea) return;

        contactArea.innerHTML = `
            <div class="contact-card">
                <i class="fab fa-github"></i>
                <h3>GitHub</h3>
                <p><a href="${profile.html_url}" target="_blank">@${profile.login}</a></p>
            </div>
            <div class="contact-card">
                <i class="fas fa-envelope"></i>
                <h3>Email</h3>
                <p><a href="mailto:manh.nd@example.com">manh.nd@example.com</a></p>
            </div>
            <div class="contact-card">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Vị Trí</h3>
                <p>${profile.location || 'Hà Nội, Việt Nam'}</p>
            </div>
        `;
    }

    function renderError(message) {
        const grid = document.querySelector('.projects-grid');
        const contact = document.querySelector('.contact-info');
        if (grid) grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: #ef4444;">${message}</p>`;
        if (contact) contact.innerHTML = `<p style="text-align: center; grid-column: 1/-1;">Kết nối thủ công qua GitHub: <a href="https://github.com/${GITHUB_USERNAME}">/manh2903</a></p>`;
    }

    // --- Active Link Highlight ---
    const navLinks = document.querySelectorAll('#navbar ul li a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    fetchGitHubData();
});