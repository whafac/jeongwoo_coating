<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>정우특수코팅 - 인쇄코팅 후가공 전문</title>
    <meta name="description" content="정우특수코팅은 인쇄코팅 후가공 전문 업체입니다. UV코팅, 라미네이팅, 박 등 다양한 코팅 서비스를 제공합니다.">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <style>
        /* CSS Variables */
        :root {
            --primary-color: #2C5F8D;      /* 신뢰감 있는 블루 */
            --primary-dark: #1A3A5C;       /* 진한 블루 */
            --accent-color: #E67E22;        /* 활기찬 오렌지 */
            --accent-light: #F39C12;        /* 밝은 오렌지 */
            --white: #FFFFFF;
            --dark-gray: #2C3E50;
            --light-gray: #F8F9FA;
            --text-primary: #2C3E50;
            --text-secondary: #6C757D;
            --border-color: #E5E7EB;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background-color: var(--white);
        }

        /* Header */
        header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: var(--white);
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--white);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logo-icon {
            font-size: 1.8rem;
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 0.5rem;
        }

        .nav-links a {
            color: var(--white);
            text-decoration: none;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: 500;
        }

        .nav-links a:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }

        /* Hamburger Menu */
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            z-index: 1002;
            position: relative;
        }

        .hamburger span {
            width: 25px;
            height: 3px;
            background: var(--white);
            margin: 3px 0;
            transition: all 0.3s ease-in-out;
            transform-origin: center;
        }

        .hamburger.active span:nth-child(1) {
            transform: translate(0px, 9px) rotate(45deg);
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
            transform: translate(0px, -9px) rotate(-45deg);
        }

        /* Mobile Menu */
        .mobile-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 70%;
            max-width: 300px;
            height: 100vh;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            padding: 1rem 0;
            box-shadow: -2px 0 10px rgba(0,0,0,0.3);
            transition: right 0.3s ease-in-out;
            z-index: 1001;
            overflow-y: auto;
        }

        .mobile-menu.active {
            right: 0;
        }

        .mobile-menu ul {
            list-style: none;
            padding: 0;
            margin-top: 70px;
        }

        .mobile-menu li {
            margin: 0;
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.3s ease;
        }

        .mobile-menu.active li {
            opacity: 1;
            transform: translateX(0);
        }

        .mobile-menu li:nth-child(1) { transition-delay: 0.1s; }
        .mobile-menu li:nth-child(2) { transition-delay: 0.2s; }
        .mobile-menu li:nth-child(3) { transition-delay: 0.3s; }
        .mobile-menu li:nth-child(4) { transition-delay: 0.4s; }
        .mobile-menu li:nth-child(5) { transition-delay: 0.5s; }
        .mobile-menu li:nth-child(6) { transition-delay: 0.6s; }

        .mobile-menu a {
            display: block;
            color: var(--white);
            text-decoration: none;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
        }

        .mobile-menu a:hover,
        .mobile-menu a.active {
            background-color: rgba(255, 255, 255, 0.1);
            border-left-color: var(--accent-color);
            padding-left: 2.5rem;
        }

        /* Overlay for mobile menu */
        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .overlay.active {
            display: block;
            opacity: 1;
        }

        /* Main Content */
        main {
            margin-top: 70px;
            min-height: calc(100vh - 70px);
        }

        /* Buttons */
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: var(--primary-color);
            color: var(--white);
            text-decoration: none;
            border-radius: 5px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
        }

        .btn:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(44, 95, 141, 0.3);
        }

        .btn-secondary {
            background: var(--accent-color);
            color: var(--white);
        }

        .btn-secondary:hover {
            background: var(--accent-light);
        }

        /* Cards */
        .card {
            background: var(--white);
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid var(--border-color);
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        /* Sections */
        .section {
            padding: 4rem 0;
        }

        .section-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-header h2 {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }

        .section-header p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }

        /* Footer */
        footer {
            background: var(--primary-dark);
            color: var(--white);
            padding: 3rem 0 1rem;
            margin-top: 4rem;
        }

        footer h3 {
            color: var(--accent-color);
            margin-bottom: 1rem;
        }

        footer a {
            color: var(--white);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        footer a:hover {
            color: var(--accent-color);
        }

        .footer-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .footer-info p {
            margin: 0.5rem 0;
            line-height: 1.8;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .hamburger {
                display: flex;
            }

            .mobile-menu {
                width: 75%;
            }

            .container {
                padding: 0 1rem;
            }

            .section {
                padding: 3rem 0;
            }

            .section-header h2 {
                font-size: 2rem;
            }

            .logo {
                font-size: 1.3rem;
            }
        }

        @media (max-width: 480px) {
            .mobile-menu {
                width: 85%;
            }

            .section {
                padding: 2rem 0;
            }

            .section-header h2 {
                font-size: 1.8rem;
            }

            .logo {
                font-size: 1.2rem;
            }
        }

        /* Utility Classes */
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .mb-1 { margin-bottom: 0.5rem; }
        .mb-2 { margin-bottom: 1rem; }
        .mb-3 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 2rem; }
        .mt-1 { margin-top: 0.5rem; }
        .mt-2 { margin-top: 1rem; }
        .mt-3 { margin-top: 1.5rem; }
        .mt-4 { margin-top: 2rem; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <a href="/" class="logo">
                    <span class="logo-icon">✨</span>
                    <span>정우특수코팅</span>
                </a>
                <ul class="nav-links">
                    <li><a href="/">홈</a></li>
                    <li><a href="/services">코팅서비스</a></li>
                    <li><a href="/process">작업프로세스</a></li>
                    <li><a href="/portfolio">작업사례</a></li>
                    <li><a href="/about">회사소개</a></li>
                    <li><a href="/contact">문의하기</a></li>
                </ul>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </div>
    </header>

    <div class="overlay"></div>

    <div class="mobile-menu">
        <ul>
            <li><a href="/">홈</a></li>
            <li><a href="/services">코팅서비스</a></li>
            <li><a href="/process">작업프로세스</a></li>
            <li><a href="/portfolio">작업사례</a></li>
            <li><a href="/about">회사소개</a></li>
            <li><a href="/contact">문의하기</a></li>
        </ul>
    </div>

    <main>
        <?= $this->renderSection('content') ?>
    </main>

    <footer>
        <div class="container">
            <div class="footer-info">
                <div>
                    <h3>정우특수코팅</h3>
                    <p>인쇄코팅 후가공 전문 업체</p>
                    <p>고품질 코팅 서비스로 귀사의 인쇄물을<br>더욱 완벽하게 만들어드립니다.</p>
                </div>
                <div>
                    <h3>서비스</h3>
                    <p><a href="/services">UV 코팅</a></p>
                    <p><a href="/services">라미네이팅</a></p>
                    <p><a href="/services">박 코팅</a></p>
                    <p><a href="/services">형압 가공</a></p>
                </div>
                <div>
                    <h3>회사 정보</h3>
                    <p><a href="/about">회사소개</a></p>
                    <p><a href="/portfolio">작업사례</a></p>
                    <p><a href="/contact">문의하기</a></p>
                </div>
                <div>
                    <h3>연락처</h3>
                    <p>📞 전화: 02-XXXX-XXXX</p>
                    <p>📧 이메일: info@jeongwoo.co.kr</p>
                    <p>📍 주소: 서울시 XX구 XX동</p>
                    <p>⏰ 영업시간: 평일 09:00 - 18:00</p>
                </div>
            </div>
            <div style="text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <p>&copy; 2025 정우특수코팅. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Hamburger Menu Toggle
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.overlay');
        let isMenuOpen = false;

        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        }

        function closeMenu() {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking on overlay
        overlay.addEventListener('click', closeMenu);

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // ESC key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });

        // Reset menu state on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        });
    </script>
</body>
</html>

