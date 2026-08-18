/* =========================================================
   ProcureX
   Main Application JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");

    const pageTitle = document.getElementById("page-title");
    const pageDescription = document.getElementById("page-description");

    const mobileMenu = document.querySelector(".mobile-menu");
    const sidebar = document.querySelector(".sidebar");

    const languageToggle =
        document.getElementById("language-toggle");

    const globalSearch =
        document.getElementById("global-search");

    const globalCity =
        document.getElementById("global-city");

    const globalSearchButton =
        document.getElementById("global-search-button");


    /* =====================================================
       PAGE INFORMATION
    ====================================================== */

    const pageInfo = {

        dashboard: {
            ar: {
                title: "لوحة التحكم",
                description:
                    "مركز المشتريات الذكي الخاص بك"
            },
            en: {
                title: "Dashboard",
                description:
                    "Your procurement intelligence center"
            }
        },

        "supplier-finder": {
            ar: {
                title: "البحث عن الموردين",
                description:
                    "ابحث عن الموردين حسب المادة والمدينة"
            },
            en: {
                title: "Supplier Finder",
                description:
                    "Find suppliers by material and city"
            }
        },

        "material-finder": {
            ar: {
                title: "البحث عن المواد",
                description:
                    "ابحث عن المواد وقطع الغيار"
            },
            en: {
                title: "Material Finder",
                description:
                    "Find materials and spare parts"
            }
        },

        suppliers: {
            ar: {
                title: "مورديّ",
                description:
                    "قاعدة بيانات الموردين الخاصة بك"
            },
            en: {
                title: "My Suppliers",
                description:
                    "Your personal supplier database"
            }
        },

        prices: {
            ar: {
                title: "ذكاء الأسعار",
                description:
                    "تحليل ومقارنة أسعار الشراء"
            },
            en: {
                title: "Price Intelligence",
                description:
                    "Analyze and compare purchasing prices"
            }
        },

        negotiation: {
            ar: {
                title: "مساعد التفاوض",
                description:
                    "تحليل الأسعار ومساعدتك في التفاوض"
            },
            en: {
                title: "Negotiation Assistant",
                description:
                    "Analyze prices and improve negotiations"
            }
        },

        rfq: {
            ar: {
                title: "طلب عرض سعر",
                description:
                    "إنشاء وإدارة طلبات عروض الأسعار"
            },
            en: {
                title: "RFQ Generator",
                description:
                    "Create and manage requests for quotation"
            }
        },

        orders: {
            ar: {
                title: "أوامر الشراء",
                description:
                    "إنشاء وطباعة وتحويل أوامر الشراء"
            },
            en: {
                title: "Purchase Orders",
                description:
                    "Create, print and export purchase orders"
            }
        },

        risk: {
            ar: {
                title: "مخاطر المشتريات",
                description:
                    "اكتشاف مخاطر الموردين والمشتريات"
            },
            en: {
                title: "Risk Radar",
                description:
                    "Monitor supplier and procurement risks"
            }
        },

        alternatives: {
            ar: {
                title: "الموردون البدلاء",
                description:
                    "ابحث عن بدائل للموردين الحاليين"
            },
            en: {
                title: "Alternative Suppliers",
                description:
                    "Find alternatives to current suppliers"
            }
        },

        memory: {
            ar: {
                title: "ذاكرة المشتريات",
                description:
                    "احفظ تاريخ وخبرة عمليات الشراء"
            },
            en: {
                title: "Procurement Memory",
                description:
                    "Store your procurement history and knowledge"
            }
        },

        analytics: {
            ar: {
                title: "التحليلات",
                description:
                    "تحليل أداء المشتريات والتوفير"
            },
            en: {
                title: "Analytics",
                description:
                    "Analyze procurement performance and savings"
            }
        },

        copilot: {
            ar: {
                title: "مساعد المشتريات",
                description:
                    "مساعد ذكي لاتخاذ قرارات الشراء"
            },
            en: {
                title: "Procurement Copilot",
                description:
                    "Your intelligent procurement assistant"
            }
        },

        documents: {
            ar: {
                title: "المستندات",
                description:
                    "طباعة وتحميل وتحويل المستندات"
            },
            en: {
                title: "Documents",
                description:
                    "Print, download and export documents"
            }
        },

        settings: {
            ar: {
                title: "الإعدادات",
                description:
                    "إعدادات النظام والحساب"
            },
            en: {
                title: "Settings",
                description:
                    "System and account settings"
            }
        }

    };


    /* =====================================================
       LANGUAGE
    ====================================================== */

    let currentLanguage =
        localStorage.getItem("procurex_language") || "ar";


    /* =====================================================
       NAVIGATION
    ====================================================== */

    function openPage(pageId) {

        pages.forEach(page => {
            page.classList.remove("active");
        });

        const selectedPage =
            document.getElementById(pageId);

        if (!selectedPage) {
            return;
        }

        selectedPage.classList.add("active");


        navItems.forEach(item => {

            item.classList.remove("active");

            if (
                item.dataset.page === pageId
            ) {
                item.classList.add("active");
            }

        });


        updatePageHeader(pageId);

        closeMobileSidebar();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        localStorage.setItem(
            "procurex_last_page",
            pageId
        );
    }


    /* =====================================================
       UPDATE HEADER
    ====================================================== */

    function updatePageHeader(pageId) {

        const info =
            pageInfo[pageId];

        if (!info) {
            return;
        }

        pageTitle.textContent =
            info[currentLanguage].title;

        pageDescription.textContent =
            info[currentLanguage].description;
    }


    /* =====================================================
       NAVIGATION EVENTS
    ====================================================== */

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const pageId =
                item.dataset.page;

            if (pageId) {
                openPage(pageId);
            }

        });

    });


    /* =====================================================
       "VIEW ALL" / DATA-GO BUTTONS
    ====================================================== */

    document
        .querySelectorAll("[data-go]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const pageId =
                        button.dataset.go;

                    openPage(pageId);

                }
            );

        });


    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle("open");

            }
        );

    }


    function closeMobileSidebar() {

        if (
            window.innerWidth <= 700 &&
            sidebar
        ) {

            sidebar.classList.remove("open");

        }

    }


    /* =====================================================
       CLOSE SIDEBAR WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            if (window.innerWidth > 700) {
                return;
            }

            if (!sidebar.classList.contains("open")) {
                return;
            }

            const clickedInsideSidebar =
                sidebar.contains(event.target);

            const clickedMenu =
                mobileMenu &&
                mobileMenu.contains(event.target);

            if (
                !clickedInsideSidebar &&
                !clickedMenu
            ) {

                closeMobileSidebar();

            }

        }
    );


    /* =====================================================
       LANGUAGE TOGGLE
    ====================================================== */

    if (languageToggle) {

        languageToggle.addEventListener(
            "click",
            () => {

                toggleLanguage();

            }
        );

    }


    function toggleLanguage() {

        currentLanguage =
            currentLanguage === "ar"
                ? "en"
                : "ar";

        localStorage.setItem(
            "procurex_language",
            currentLanguage
        );

        document.documentElement.lang =
            currentLanguage;

        document.documentElement.dir =
            currentLanguage === "ar"
                ? "rtl"
                : "ltr";

        languageToggle.innerHTML =
            currentLanguage === "ar"
                ? `العربية <span>⌄</span>`
                : `English <span>⌄</span>`;

        const activePage =
            document.querySelector(
                ".page.active"
            );

        if (activePage) {

            updatePageHeader(
                activePage.id
            );

        }

    }


    /* =====================================================
       GLOBAL SEARCH
    ====================================================== */

    if (globalSearchButton) {

        globalSearchButton.addEventListener(
            "click",
            performGlobalSearch
        );

    }


    if (globalSearch) {

        globalSearch.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    performGlobalSearch();

                }

            }
        );

    }


    function performGlobalSearch() {

        const searchValue =
            globalSearch.value.trim();

        const cityValue =
            globalCity
                ? globalCity.value
                : "كل المدن";


        if (!searchValue) {

            showToast(
                "اكتب اسم المادة أو المورد أو رقم القطعة أولاً",
                "warning"
            );

            globalSearch.focus();

            return;
        }


        /*
         * حالياً نوجه البحث إلى Material Finder.
         * لاحقاً سيتم ربطه بقاعدة البيانات ومحرك
         * البحث الحقيقي عن الموردين والمواد.
         */

        openPage("material-finder");


        showToast(
            `جاري البحث عن "${searchValue}" في ${cityValue}`,
            "info"
        );


        localStorage.setItem(
            "procurex_last_search",
            JSON.stringify({
                query: searchValue,
                city: cityValue,
                date: new Date().toISOString()
            })
        );

    }


    /* =====================================================
       TOAST NOTIFICATION
    ====================================================== */

    function showToast(
        message,
        type = "info"
    ) {

        let container =
            document.getElementById(
                "toast-container"
            );


        if (!container) {

            container =
                document.createElement("div");

            container.id =
                "toast-container";

            document.body.appendChild(
                container
            );

            applyToastContainerStyle(
                container
            );

        }


        const toast =
            document.createElement("div");

        toast.className =
            `procurex-toast ${type}`;

        toast.textContent =
            message;


        applyToastStyle(toast);


        container.appendChild(toast);


        requestAnimationFrame(() => {

            toast.classList.add(
                "show"
            );

        });


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3500);

    }


    function applyToastContainerStyle(
        container
    ) {

        Object.assign(
            container.style,
            {
                position: "fixed",
                bottom: "25px",
                left: "25px",
                zIndex: "99999",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }
        );

    }


    function applyToastStyle(toast) {

        Object.assign(
            toast.style,
            {
                minWidth: "260px",
                maxWidth: "380px",
                padding: "13px 16px",
                borderRadius: "10px",
                background: "#101828",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "600",
                boxShadow:
                    "0 12px 30px rgba(0,0,0,.18)",
                transform:
                    "translateY(15px)",
                opacity: "0",
                transition:
                    "all .3s ease",
                cursor: "pointer"
            }
        );


        if (toast.classList.contains("success")) {

            toast.style.borderRight =
                "4px solid #12b76a";

        }

        if (toast.classList.contains("warning")) {

            toast.style.borderRight =
                "4px solid #f79009";

        }

        if (toast.classList.contains("danger")) {

            toast.style.borderRight =
                "4px solid #f04438";

        }

        if (toast.classList.contains("info")) {

            toast.style.borderRight =
                "4px solid #2e90fa";

        }


        setTimeout(() => {

            toast.style.transform =
                "translateY(0)";

            toast.style.opacity =
                "1";

        }, 20);

    }


    /* =====================================================
       LOAD LAST PAGE
    ====================================================== */

    const lastPage =
        localStorage.getItem(
            "procurex_last_page"
        );


    if (
        lastPage &&
        document.getElementById(lastPage)
    ) {

        openPage(lastPage);

    } else {

        openPage("dashboard");

    }


    /* =====================================================
       INITIAL LANGUAGE
    ====================================================== */

    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    if (languageToggle) {

        languageToggle.innerHTML =
            currentLanguage === "ar"
                ? `العربية <span>⌄</span>`
                : `English <span>⌄</span>`;

    }


    /* =====================================================
       NOTIFICATION BUTTON
    ====================================================== */

    const notificationButton =
        document.querySelector(
            ".icon-button"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                showToast(
                    "لديك 5 تنبيهات تحتاج إلى مراجعة",
                    "warning"
                );

            }
        );

    }


    /* =====================================================
       USER MENU
    ====================================================== */

    const userMenu =
        document.querySelector(
            ".user-menu"
        );


    if (userMenu) {

        userMenu.addEventListener(
            "click",
            () => {

                showToast(
                    "قائمة المستخدم سيتم تطويرها لاحقاً",
                    "info"
                );

            }
        );

    }


    /* =====================================================
       WINDOW RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 700 &&
                sidebar
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );


    /* =====================================================
       KEYBOARD SHORTCUT
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Ctrl + K
             * يفتح البحث السريع
             */

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                if (globalSearch) {

                    globalSearch.focus();

                }

            }

        }
    );


    /* =====================================================
       EXPORT HELPER
       سيتم استخدامه لاحقاً مع Excel / PDF / Word
    ====================================================== */

    window.ProcureX = {

        openPage,

        showToast,

        getLanguage: () => currentLanguage,

        getLastSearch: () => {

            const data =
                localStorage.getItem(
                    "procurex_last_search"
                );

            return data
                ? JSON.parse(data)
                : null;

        }

    };


    /* =====================================================
       STARTUP MESSAGE
    ====================================================== */

    console.log(
        "%cProcureX initialized successfully.",
        "color:#1769e0;font-weight:bold;font-size:14px;"
    );

});
