/* =========================================================
   ABDULLAH AL-SHAHAT
   SMART PROCUREMENT ASSISTANT
   App.js
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       GLOBAL APP OBJECT
    ===================================================== */

    window.ProcureX = window.ProcureX || {};

    const APP_NAME =
        "مساعد عبدالله الشحات للمشتريات";

    const STORAGE_KEYS = {

        materials:
            "abdullah_procurement_materials",

        suppliers:
            "abdullah_procurement_suppliers",

        reminders:
            "abdullah_procurement_reminders",

        searches:
            "abdullah_procurement_searches",

        settings:
            "abdullah_procurement_settings"

    };


    /* =====================================================
       STORAGE
    ===================================================== */

    const Storage = {

        get(key, fallback = []) {

            try {

                const value =
                    localStorage.getItem(key);

                if (!value) {
                    return fallback;
                }

                return JSON.parse(value);

            } catch (error) {

                console.error(
                    "Storage read error:",
                    error
                );

                return fallback;
            }
        },


        set(key, value) {

            try {

                localStorage.setItem(
                    key,
                    JSON.stringify(value)
                );

                return true;

            } catch (error) {

                console.error(
                    "Storage write error:",
                    error
                );

                return false;
            }
        },


        remove(key) {

            try {

                localStorage.removeItem(key);

                return true;

            } catch (error) {

                return false;
            }
        }

    };


    /* =====================================================
       HELPERS
       ===================================================== */

    function generateId(prefix = "ID") {

        return (
            prefix +
            "-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );
    }


    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function normalizeText(value) {

        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي");
    }


    function formatDate(date) {

        if (!date) {
            return "غير محدد";
        }

        try {

            return new Intl.DateTimeFormat(
                "ar-SA",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            ).format(new Date(date));

        } catch {

            return date;
        }
    }


    function getElement(id) {

        return document.getElementById(id);
    }


    /* =====================================================
       TOAST
       ===================================================== */

    function ensureToastContainer() {

        let container =
            document.querySelector(
                ".toast-container"
            );

        if (!container) {

            container =
                document.createElement("div");

            container.className =
                "toast-container";

            document.body.appendChild(
                container
            );
        }

        return container;
    }


    function showToast(
        message,
        type = "info",
        duration = 3500
    ) {

        const container =
            ensureToastContainer();

        const toast =
            document.createElement("div");

        toast.className =
            "toast " + type;

        toast.textContent =
            message;

        container.appendChild(
            toast
        );

        setTimeout(() => {

            toast.style.opacity = "0";

            toast.style.transform =
                "translateY(8px)";

            setTimeout(() => {

                toast.remove();

            }, 250);

        }, duration);

    }


    window.ProcureX.showToast =
        showToast;


    /* =====================================================
       MATERIAL DATABASE
       ===================================================== */

    const MaterialDB = {

        all() {

            return Storage.get(
                STORAGE_KEYS.materials,
                []
            );
        },


        save(material) {

            const materials =
                this.all();

            const newMaterial = {

                id:
                    material.id ||
                    generateId("MAT"),

                name:
                    material.name || "",

                type:
                    material.type || "",

                partNumber:
                    material.partNumber || "",

                city:
                    material.city || "",

                model:
                    material.model || "",

                specification:
                    material.specification || "",

                image:
                    material.image || "",

                notes:
                    material.notes || "",

                createdAt:
                    material.createdAt ||
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };

            materials.push(
                newMaterial
            );

            Storage.set(
                STORAGE_KEYS.materials,
                materials
            );

            return newMaterial;
        },


        update(id, changes) {

            const materials =
                this.all();

            const index =
                materials.findIndex(
                    item => item.id === id
                );

            if (index === -1) {
                return null;
            }

            materials[index] = {

                ...materials[index],

                ...changes,

                updatedAt:
                    new Date().toISOString()

            };

            Storage.set(
                STORAGE_KEYS.materials,
                materials
            );

            return materials[index];
        },


        delete(id) {

            const materials =
                this.all()
                    .filter(
                        item =>
                            item.id !== id
                    );

            Storage.set(
                STORAGE_KEYS.materials,
                materials
            );

            return true;
        },


        find(id) {

            return this.all()
                .find(
                    item => item.id === id
                );
        },


        search(query) {

            const q =
                normalizeText(query);

            if (!q) {
                return this.all();
            }

            return this.all()
                .filter(material => {

                    const searchable = [
                        material.name,
                        material.type,
                        material.partNumber,
                        material.city,
                        material.model,
                        material.specification,
                        material.notes
                    ]
                        .join(" ");

                    return normalizeText(
                        searchable
                    ).includes(q);

                });

        }

    };


    window.ProcureX.MaterialDB =
        MaterialDB;


    /* =====================================================
       SUPPLIER DATABASE
       ===================================================== */

    const SupplierDB = {

        all() {

            return Storage.get(
                STORAGE_KEYS.suppliers,
                []
            );
        },


        save(supplier) {

            const suppliers =
                this.all();

            const newSupplier = {

                id:
                    supplier.id ||
                    generateId("SUP"),

                name:
                    supplier.name || "",

                category:
                    supplier.category || "",

                city:
                    supplier.city || "",

                country:
                    supplier.country ||
                    "Saudi Arabia",

                phone:
                    supplier.phone || "",

                email:
                    supplier.email || "",

                website:
                    supplier.website || "",

                address:
                    supplier.address || "",

                contactPerson:
                    supplier.contactPerson || "",

                materials:
                    supplier.materials || [],

                source:
                    supplier.source ||
                    "manual",

                verified:
                    supplier.verified === true,

                notes:
                    supplier.notes || "",

                createdAt:
                    supplier.createdAt ||
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };

            suppliers.push(
                newSupplier
            );

            Storage.set(
                STORAGE_KEYS.suppliers,
                suppliers
            );

            return newSupplier;
        },


        update(id, changes) {

            const suppliers =
                this.all();

            const index =
                suppliers.findIndex(
                    item => item.id === id
                );

            if (index === -1) {
                return null;
            }

            suppliers[index] = {

                ...suppliers[index],

                ...changes,

                updatedAt:
                    new Date().toISOString()

            };

            Storage.set(
                STORAGE_KEYS.suppliers,
                suppliers
            );

            return suppliers[index];
        },


        delete(id) {

            const suppliers =
                this.all()
                    .filter(
                        item =>
                            item.id !== id
                    );

            Storage.set(
                STORAGE_KEYS.suppliers,
                suppliers
            );

            return true;
        },


        find(id) {

            return this.all()
                .find(
                    item => item.id === id
                );
        },


        search(query, city = "") {

            const q =
                normalizeText(query);

            const c =
                normalizeText(city);

            return this.all()
                .filter(supplier => {

                    const text = normalizeText(
                        [
                            supplier.name,
                            supplier.category,
                            supplier.city,
                            supplier.materials?.join(" "),
                            supplier.notes
                        ].join(" ")
                    );

                    const textMatch =
                        !q ||
                        text.includes(q);

                    const cityMatch =
                        !c ||
                        normalizeText(
                            supplier.city
                        ).includes(c);

                    return (
                        textMatch &&
                        cityMatch
                    );

                });

        }

    };


    window.ProcureX.SupplierDB =
        SupplierDB;


    /* =====================================================
       REMINDERS
       ===================================================== */

    const ReminderDB = {

        all() {

            return Storage.get(
                STORAGE_KEYS.reminders,
                []
            );
        },


        save(reminder) {

            const reminders =
                this.all();

            const item = {

                id:
                    reminder.id ||
                    generateId("REM"),

                title:
                    reminder.title || "",

                description:
                    reminder.description || "",

                date:
                    reminder.date || "",

                time:
                    reminder.time || "",

                completed:
                    reminder.completed === true,

                createdAt:
                    reminder.createdAt ||
                    new Date().toISOString()

            };

            reminders.push(item);

            Storage.set(
                STORAGE_KEYS.reminders,
                reminders
            );

            return item;
        },


        complete(id) {

            const reminders =
                this.all();

            const index =
                reminders.findIndex(
                    item => item.id === id
                );

            if (index === -1) {
                return null;
            }

            reminders[index].completed =
                true;

            Storage.set(
                STORAGE_KEYS.reminders,
                reminders
            );

            return reminders[index];
        },


        delete(id) {

            const reminders =
                this.all()
                    .filter(
                        item =>
                            item.id !== id
                    );

            Storage.set(
                STORAGE_KEYS.reminders,
                reminders
            );
        },


        pending() {

            return this.all()
                .filter(
                    item =>
                        !item.completed
                );

        }

    };


    window.ProcureX.ReminderDB =
        ReminderDB;


    /* =====================================================
       SEARCH HISTORY
       ===================================================== */

    const SearchHistory = {

        all() {

            return Storage.get(
                STORAGE_KEYS.searches,
                []
            );
        },


        add(search) {

            const history =
                this.all();

            history.unshift({

                id:
                    generateId("SEARCH"),

                query:
                    search.query || "",

                city:
                    search.city || "",

                type:
                    search.type || "",

                source:
                    search.source ||
                    "external",

                date:
                    new Date().toISOString()

            });

            const limited =
                history.slice(0, 100);

            Storage.set(
                STORAGE_KEYS.searches,
                limited
            );

        }

    };


    window.ProcureX.SearchHistory =
        SearchHistory;


    /* =====================================================
       MATERIAL IDENTIFICATION
       ===================================================== */

    const MaterialKnowledge = {

        categories: {

            "قطع غيار": [
                "Part Number",
                "Manufacturer",
                "Model",
                "Application"
            ],

            "ميكانيكا": [
                "المقاس",
                "الخامة",
                "الموديل",
                "الاستخدام"
            ],

            "كهرباء": [
                "Voltage",
                "Current",
                "Power",
                "Model"
            ],

            "هيدروليك": [
                "Pressure",
                "Diameter",
                "Length",
                "Connection"
            ],

            "خراطيم": [
                "Diameter",
                "Length",
                "Pressure",
                "Material"
            ],

            "فلاتر": [
                "Filter Type",
                "Micron",
                "Size",
                "Part Number"
            ],

            "مواد إنشائية": [
                "Grade",
                "Size",
                "Quantity",
                "Standard"
            ],

            "مواد خام": [
                "Material",
                "Grade",
                "Thickness",
                "Dimensions"
            ],

            "العدد والأدوات": [
                "Size",
                "Brand",
                "Model",
                "Application"
            ],

            "سلامة": [
                "Standard",
                "Size",
                "Protection Level",
                "Certification"
            ],

            "زيوت وشحوم": [
                "Viscosity",
                "Grade",
                "Application",
                "Packaging"
            ]

        },


        getProperties(type) {

            return (
                this.categories[type] ||
                [
                    "المقاس",
                    "الخامة",
                    "الاستخدام"
                ]
            );

        },


        identify(name, type = "") {

            const text =
                normalizeText(name);

            let detectedType =
                type;

            if (!detectedType) {

                if (
                    text.includes("خرطوم") ||
                    text.includes("hose")
                ) {

                    detectedType =
                        "خراطيم";

                } else if (
                    text.includes("فلتر") ||
                    text.includes("filter")
                ) {

                    detectedType =
                        "فلاتر";

                } else if (
                    text.includes("hydraulic") ||
                    text.includes("هيدروليك")
                ) {

                    detectedType =
                        "هيدروليك";

                } else if (
                    text.includes("oil") ||
                    text.includes("زيت")
                ) {

                    detectedType =
                        "زيوت وشحوم";

                } else {

                    detectedType =
                        "أخرى";

                }

            }

            return {

                name,

                type:
                    detectedType,

                properties:
                    this.getProperties(
                        detectedType
                    )

            };

        }

    };


    window.ProcureX.MaterialKnowledge =
        MaterialKnowledge;


    /* =====================================================
       EXTERNAL SEARCH
       ===================================================== */

    const ExternalSearch = {

        searchSuppliers({
            query = "",
            city = "",
            type = ""
        } = {}) {

            const searchText =
                [
                    query,
                    type,
                    city
                ]
                    .filter(Boolean)
                    .join(" ");

            SearchHistory.add({

                query,

                city,

                type,

                source:
                    "external"

            });

            /*
             * البحث الخارجي الحقيقي يتم فتحه
             * في محرك البحث.
             *
             * لا نضع أرقام موردين وهمية.
             */

            const encoded =
                encodeURIComponent(
                    searchText +
                    " suppliers"
                );

            const url =
                "https://www.google.com/search?q=" +
                encoded;

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            return url;
        },


        searchMaterials({
            query = "",
            city = "",
            type = ""
        } = {}) {

            const searchText =
                [
                    query,
                    type,
                    city
                ]
                    .filter(Boolean)
                    .join(" ");

            SearchHistory.add({

                query,

                city,

                type,

                source:
                    "external-material"

            });

            const encoded =
                encodeURIComponent(
                    searchText
                );

            const url =
                "https://www.google.com/search?q=" +
                encoded;

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            return url;
        }

    };


    window.ProcureX.ExternalSearch =
        ExternalSearch;


    /* =====================================================
       VOICE ASSISTANT
       ===================================================== */

    const VoiceAssistant = {

        recognition: null,

        listening: false,


        supported() {

            return !!(
                window.SpeechRecognition ||
                window.webkitSpeechRecognition
            );

        },


        init() {

            if (!this.supported()) {
                return false;
            }

            const Recognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;

            this.recognition =
                new Recognition();

            this.recognition.lang =
                "ar-SA";

            this.recognition.continuous =
                false;

            this.recognition.interimResults =
                false;

            this.recognition.onstart =
                () => {

                    this.listening =
                        true;

                    document
                        .querySelectorAll(
                            ".voice-button"
                        )
                        .forEach(
                            button =>
                                button.classList.add(
                                    "listening"
                                )
                        );

                };


            this.recognition.onend =
                () => {

                    this.listening =
                        false;

                    document
                        .querySelectorAll(
                            ".voice-button"
                        )
                        .forEach(
                            button =>
                                button.classList.remove(
                                    "listening"
                                )
                        );

                };


            this.recognition.onerror =
                error => {

                    console.error(
                        "Voice error:",
                        error
                    );

                    this.listening =
                        false;

                    showToast(
                        "لم أستطع فهم الأمر الصوتي.",
                        "warning"
                    );

                };


            this.recognition.onresult =
                event => {

                    const transcript =
                        event
                            .results[0][0]
                            .transcript
                            .trim();

                    this.handleCommand(
                        transcript
                    );

                };

            return true;
        },


        start() {

            if (!this.recognition) {

                if (!this.init()) {

                    showToast(
                        "المتصفح لا يدعم البحث الصوتي.",
                        "warning"
                    );

                    return;
                }

            }

            try {

                this.recognition.start();

            } catch (error) {

                console.warn(
                    "Voice start:",
                    error
                );

            }

        },


        stop() {

            if (
                this.recognition &&
                this.listening
            ) {

                this.recognition.stop();

            }

        },


        speak(text) {

            if (
                !(
                    "speechSynthesis"
                    in window
                )
            ) {

                return;
            }

            window.speechSynthesis.cancel();

            const utterance =
                new SpeechSynthesisUtterance(
                    text
                );

            utterance.lang =
                "ar-SA";

            utterance.rate =
                0.95;

            window.speechSynthesis.speak(
                utterance
            );

        },


        handleCommand(command) {

            const text =
                normalizeText(command);

            showToast(
                "سمعتك: " + command,
                "info"
            );

            /*
             * تذكير:
             * فكرني بكرة إن عندي ...
             */

            if (
                text.includes("فكرني") ||
                text.includes("ذكرني")
            ) {

                const reminderText =
                    command
                        .replace(
                            /فكرني|ذكرني/gi,
                            ""
                        )
                        .trim();

                if (reminderText) {

                    const tomorrow =
                        new Date();

                    tomorrow.setDate(
                        tomorrow.getDate() + 1
                    );

                    ReminderDB.save({

                        title:
                            reminderText,

                        description:
                            "تم إنشاؤه بالصوت.",

                        date:
                            tomorrow
                                .toISOString()
                                .split("T")[0],

                        time:
                            "09:00"

                    });

                    showToast(
                        "تم حفظ التذكير لبكرة.",
                        "success"
                    );

                    this.speak(
                        "تمام، حفظت لك التذكير لبكرة."
                    );

                    return;
                }

            }


            /*
             * بحث عن مورد
             */

            if (
                text.includes("مورد") ||
                text.includes("موردين")
            ) {

                ExternalSearch.searchSuppliers({

                    query:
                        command,

                    city:
                        "",

                    type:
                        ""

                });

                return;
            }


            /*
             * بحث عن مادة
             */

            if (
                text.includes("مادة") ||
                text.includes("خامة")
            ) {

                ExternalSearch.searchMaterials({

                    query:
                        command

                });

                return;
            }


            this.speak(
                "تمام، فهمت كلامك، لكن الأمر ده محتاج ربط إضافي."
            );

        }

    };


    window.ProcureX.VoiceAssistant =
        VoiceAssistant;


    /* =====================================================
       IMAGE MATERIAL SEARCH
       ===================================================== */

    const ImageMaterialSearch = {

        selectedImage: null,


        handleFile(file) {

            if (!file) {
                return;
            }

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showToast(
                    "من فضلك اختر صورة صحيحة.",
                    "warning"
                );

                return;
            }

            this.selectedImage =
                file;

            const reader =
                new FileReader();

            reader.onload =
                event => {

                    const preview =
                        document.querySelector(
                            ".image-preview"
                        ) ||
                        document.getElementById(
                            "image-preview"
                        );

                    if (preview) {

                        preview.src =
                            event.target.result;

                        preview.style.display =
                            "block";

                    }

                    /*
                     * الصورة يتم حفظها
                     * مع المادة إذا ضغط المستخدم حفظ.
                     */

                    window.ProcureX
                        .currentMaterialImage =
                        event.target.result;

                };

            reader.readAsDataURL(
                file
            );

        },


        search() {

            if (!this.selectedImage) {

                showToast(
                    "ارفع صورة المادة أولاً.",
                    "warning"
                );

                return;
            }

            /*
             * لا ندعي أن الموقع تعرف على
             * القطعة فعلياً بدون AI/API.
             *
             * هنا نفتح بحثاً بصرياً خارجياً
             * أو نترك نقطة الربط جاهزة.
             */

            showToast(
                "تم تجهيز الصورة للبحث الخارجي.",
                "success"
            );

        }

    };


    window.ProcureX.ImageMaterialSearch =
        ImageMaterialSearch;


    /* =====================================================
       DASHBOARD COUNTERS
       ===================================================== */

    function updateDashboardCounters() {

        const materials =
            MaterialDB.all();

        const suppliers =
            SupplierDB.all();

        const reminders =
            ReminderDB.pending();


        const materialCount =
            document.getElementById(
                "material-count"
            );

        if (materialCount) {

            materialCount.textContent =
                materials.length;

        }


        const supplierCount =
            document.getElementById(
                "supplier-count"
            );

        if (supplierCount) {

            supplierCount.textContent =
                suppliers.length;

        }


        const reminderCount =
            document.getElementById(
                "reminder-count"
            );

        if (reminderCount) {

            reminderCount.textContent =
                reminders.length;

        }

    }


    /* =====================================================
       GLOBAL SEARCH
       ===================================================== */

    function initGlobalSearch() {

        const searchInput =
            document.querySelector(
                ".global-search"
            );

        if (!searchInput) {
            return;
        }

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Enter"
                ) {

                    return;
                }

                const query =
                    searchInput.value.trim();

                if (!query) {
                    return;
                }

                const materials =
                    MaterialDB.search(
                        query
                    );

                const suppliers =
                    SupplierDB.search(
                        query
                    );

                if (
                    materials.length ||
                    suppliers.length
                ) {

                    showToast(
                        `تم العثور على ${materials.length} مادة و${suppliers.length} مورد محفوظ.`,
                        "success"
                    );

                } else {

                    ExternalSearch.searchSuppliers({

                        query

                    });

                }

            }
        );

    }


    /* =====================================================
       VOICE BUTTON
       ===================================================== */

    function initVoiceButtons() {

        document
            .querySelectorAll(
                ".voice-button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        VoiceAssistant.start();

                    }
                );

            });

    }


    /* =====================================================
       IMAGE INPUTS
       ===================================================== */

    function initImageInputs() {

        document
            .querySelectorAll(
                'input[type="file"][accept*="image"]'
            )
            .forEach(input => {

                input.addEventListener(
                    "change",
                    event => {

                        const file =
                            event.target.files[0];

                        ImageMaterialSearch
                            .handleFile(
                                file
                            );

                    }
                );

            });

    }


    /* =====================================================
       MOBILE SIDEBAR
       ===================================================== */

    function initMobileMenu() {

        const sidebar =
            document.querySelector(
                ".sidebar"
            );

        const overlay =
            document.querySelector(
                ".sidebar-overlay"
            );

        const button =
            document.querySelector(
                ".mobile-menu-button"
            );

        if (
            !sidebar ||
            !button
        ) {

            return;
        }

        button.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

                if (overlay) {

                    overlay.classList.toggle(
                        "show"
                    );

                }

            }
        );


        if (overlay) {

            overlay.addEventListener(
                "click",
                () => {

                    sidebar.classList.remove(
                        "open"
                    );

                    overlay.classList.remove(
                        "show"
                    );

                }
            );

        }

    }


    /* =====================================================
       INIT
       ===================================================== */

    function init() {

        initGlobalSearch();

        initVoiceButtons();

        initImageInputs();

        initMobileMenu();

        updateDashboardCounters();

        /*
         * تهيئة الصوت بدون تشغيل الميكروفون.
         */

        if (
            VoiceAssistant.supported()
        ) {

            VoiceAssistant.init();

        }

        console.log(
            APP_NAME +
            " initialized successfully."
        );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ProcureX.app = {

        name:
            APP_NAME,

        storage:
            Storage,

        materials:
            MaterialDB,

        suppliers:
            SupplierDB,

        reminders:
            ReminderDB,

        searches:
            SearchHistory,

        materialKnowledge:
            MaterialKnowledge,

        externalSearch:
            ExternalSearch,

        voice:
            VoiceAssistant,

        imageSearch:
            ImageMaterialSearch,

        updateDashboard:
            updateDashboardCounters

    };


    /* =====================================================
       START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
