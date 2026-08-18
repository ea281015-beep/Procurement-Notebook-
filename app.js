/* =========================================================
   ProcureX - App Controller
   File: App.js
   ========================================================= */

"use strict";

(function (window, document) {

    /* =====================================================
       PROCUREX CORE
    ====================================================== */

    const ProcureX = {

        version: "1.0.0",

        initialized: false,

        /* ================================================
           STORAGE KEYS
        ================================================= */

        storage: {

            suppliers:
                "procurex_suppliers",

            materials:
                "procurex_materials",

            searches:
                "procurex_search_history",

            currentSearch:
                "procurex_material_search"

        },


        /* ================================================
           INIT
        ================================================= */

        init() {

            if (this.initialized) {
                return;
            }

            this.initialized = true;

            this.prepareStorage();

            this.bindGlobalEvents();

            console.log(
                "ProcureX App initialized."
            );

        },


        /* ================================================
           STORAGE
        ================================================= */

        prepareStorage() {

            if (
                !localStorage.getItem(
                    this.storage.suppliers
                )
            ) {

                localStorage.setItem(
                    this.storage.suppliers,
                    JSON.stringify([])
                );

            }


            if (
                !localStorage.getItem(
                    this.storage.materials
                )
            ) {

                localStorage.setItem(
                    this.storage.materials,
                    JSON.stringify([])
                );

            }


            if (
                !localStorage.getItem(
                    this.storage.searches
                )
            ) {

                localStorage.setItem(
                    this.storage.searches,
                    JSON.stringify([])
                );

            }

        },


        /* ================================================
           SUPPLIERS
        ================================================= */

        getSuppliers() {

            try {

                const data =
                    JSON.parse(
                        localStorage.getItem(
                            this.storage.suppliers
                        )
                    );

                return Array.isArray(data)
                    ? data
                    : [];

            }

            catch (error) {

                console.error(
                    "Supplier storage error:",
                    error
                );

                return [];

            }

        },


        saveSupplier(supplier) {

            if (!supplier) {

                return {
                    success: false,
                    message:
                        "بيانات المورد غير صحيحة."
                };

            }


            if (
                window.ProcureXSearch &&
                typeof window.ProcureXSearch.saveSupplier ===
                    "function"
            ) {

                return window.ProcureXSearch.saveSupplier(
                    supplier
                );

            }


            const suppliers =
                this.getSuppliers();


            const duplicate =
                suppliers.some(
                    item =>
                        this.normalize(
                            item.name
                        ) ===
                        this.normalize(
                            supplier.name
                        ) &&
                        this.normalize(
                            item.city
                        ) ===
                        this.normalize(
                            supplier.city
                        )
                );


            if (duplicate) {

                return {

                    success: false,

                    duplicate: true,

                    message:
                        "المورد موجود بالفعل."

                };

            }


            const newSupplier = {

                ...supplier,

                id:
                    supplier.id ||
                    "SUP-" +
                    Date.now(),

                createdAt:
                    new Date().toISOString()

            };


            suppliers.push(
                newSupplier
            );


            localStorage.setItem(
                this.storage.suppliers,
                JSON.stringify(
                    suppliers
                )
            );


            return {

                success: true,

                supplier:
                    newSupplier,

                message:
                    "تم حفظ المورد بنجاح."

            };

        },


        /* ================================================
           MATERIALS
        ================================================= */

        getMaterials() {

            try {

                const data =
                    JSON.parse(
                        localStorage.getItem(
                            this.storage.materials
                        )
                    );

                return Array.isArray(data)
                    ? data
                    : [];

            }

            catch {

                return [];

            }

        },


        saveMaterial(material) {

            if (!material) {

                return {

                    success: false,

                    message:
                        "بيانات المادة غير صحيحة."

                };

            }


            const materials =
                this.getMaterials();


            const newMaterial = {

                ...material,

                id:
                    material.id ||
                    "MAT-" +
                    Date.now(),

                createdAt:
                    material.createdAt ||
                    new Date().toISOString()

            };


            materials.push(
                newMaterial
            );


            localStorage.setItem(
                this.storage.materials,
                JSON.stringify(
                    materials
                )
            );


            return {

                success: true,

                material:
                    newMaterial,

                message:
                    "تم حفظ المادة بنجاح."

            };

        },


        /* ================================================
           SEARCH HISTORY
        ================================================= */

        saveSearch(searchData) {

            if (!searchData) {
                return;
            }


            let searches = [];


            try {

                searches =
                    JSON.parse(
                        localStorage.getItem(
                            this.storage.searches
                        )
                    ) || [];

            }

            catch {

                searches = [];

            }


            if (!Array.isArray(searches)) {

                searches = [];

            }


            searches.unshift({

                ...searchData,

                searchedAt:
                    new Date().toISOString()

            });


            /*
             * نحتفظ بآخر 100 عملية بحث فقط
             */

            searches =
                searches.slice(
                    0,
                    100
                );


            localStorage.setItem(
                this.storage.searches,
                JSON.stringify(
                    searches
                )
            );

        },


        getSearchHistory() {

            try {

                const data =
                    JSON.parse(
                        localStorage.getItem(
                            this.storage.searches
                        )
                    );

                return Array.isArray(data)
                    ? data
                    : [];

            }

            catch {

                return [];

            }

        },


        /* ================================================
           CURRENT SEARCH
        ================================================= */

        setCurrentSearch(data) {

            localStorage.setItem(
                this.storage.currentSearch,
                JSON.stringify(
                    data
                )
            );

        },


        getCurrentSearch() {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        this.storage.currentSearch
                    )
                );

            }

            catch {

                return null;

            }

        },


        /* ================================================
           NORMALIZE
        ================================================= */

        normalize(value) {

            if (
                value === null ||
                value === undefined
            ) {

                return "";

            }


            return String(value)
                .toLowerCase()
                .trim()
                .replace(/[أإآ]/g, "ا")
                .replace(/ة/g, "ه")
                .replace(/ى/g, "ي")
                .replace(/\s+/g, " ");

        },


        /* ================================================
           TOAST
        ================================================= */

        showToast(
            message,
            type = "info"
        ) {

            /*
             * لو النظام الأساسي عندك فيه Toast
             * هنستخدمه بدل ما نعمل واحد جديد.
             */

            if (
                window.ProcureXToast &&
                typeof window.ProcureXToast ===
                    "function"
            ) {

                window.ProcureXToast(
                    message,
                    type
                );

                return;

            }


            /*
             * إنشاء Toast بسيط لو مفيش واحد.
             */

            let container =
                document.getElementById(
                    "procurex-toast-container"
                );


            if (!container) {

                container =
                    document.createElement(
                        "div"
                    );

                container.id =
                    "procurex-toast-container";


                container.style.cssText = `
                    position:fixed;
                    bottom:25px;
                    right:25px;
                    z-index:99999;
                    display:flex;
                    flex-direction:column;
                    gap:8px;
                `;


                document.body.appendChild(
                    container
                );

            }


            const toast =
                document.createElement(
                    "div"
                );


            let background =
                "#1769e0";


            if (type === "success") {
                background = "#087443";
            }


            if (type === "warning") {
                background = "#b54708";
            }


            if (type === "error") {
                background = "#d92d20";
            }


            toast.textContent =
                message;


            toast.style.cssText = `
                background:${background};
                color:#fff;
                padding:12px 16px;
                border-radius:9px;
                font-size:12px;
                font-weight:600;
                box-shadow:0 8px 25px rgba(0,0,0,.15);
                max-width:350px;
                direction:rtl;
                animation:procurexToastIn .25s ease;
            `;


            container.appendChild(
                toast
            );


            setTimeout(
                () => {

                    toast.style.opacity =
                        "0";

                    toast.style.transform =
                        "translateY(10px)";


                    setTimeout(
                        () => {

                            toast.remove();

                        },
                        250
                    );

                },
                3500
            );

        },


        /* ================================================
           GLOBAL EVENTS
        ================================================= */

        bindGlobalEvents() {

            /*
             * استقبال حدث البحث من Material Finder
             */

            window.addEventListener(
                "ProcureXMaterialSearch",
                event => {

                    if (
                        event.detail
                    ) {

                        this.handleMaterialSearch(
                            event.detail
                        );

                    }

                }
            );


            /*
             * استقبال المورد الجديد
             */

            window.addEventListener(
                "ProcureXSupplierSaved",
                event => {

                    if (
                        event.detail
                    ) {

                        console.log(
                            "Supplier saved:",
                            event.detail
                        );

                    }

                }
            );

        },


        /* ================================================
           MATERIAL SEARCH
        ================================================= */

        async handleMaterialSearch(
            criteria
        ) {

            if (
                !window.ProcureXSearch
            ) {

                this.showToast(
                    "محرك البحث غير محمل.",
                    "error"
                );

                return {

                    success: false,

                    results: []

                };

            }


            try {

                const result =
                    await window.ProcureXSearch.search(
                        criteria
                    );


                this.setCurrentSearch({
                    ...criteria,

                    resultCount:
                        result.total,

                    results:
                        result.results,

                    searchedAt:
                        new Date().toISOString()

                });


                this.saveSearch({

                    ...criteria,

                    resultCount:
                        result.total

                });


                return result;

            }

            catch (error) {

                console.error(
                    "Material search error:",
                    error
                );


                this.showToast(
                    "حدث خطأ أثناء البحث.",
                    "error"
                );


                return {

                    success: false,

                    results: [],

                    total: 0

                };

            }

        },


        /* ================================================
           LOAD SCRIPT
        ================================================= */

        loadScript(
            src
        ) {

            return new Promise(
                (
                    resolve,
                    reject
                ) => {

                    /*
                     * لو الملف موجود بالفعل
                     * لا نحمله مرة ثانية.
                     */

                    const existing =
                        document.querySelector(
                            `script[src="${src}"]`
                        );


                    if (existing) {

                        resolve();

                        return;

                    }


                    const script =
                        document.createElement(
                            "script"
                        );


                    script.src =
                        src;

                    script.async =
                        false;


                    script.onload =
                        () => resolve();


                    script.onerror =
                        () =>
                            reject(
                                new Error(
                                    "Failed to load " +
                                    src
                                )
                            );


                    document.head.appendChild(
                        script
                    );

                }
            );

        }

    };


    /* =====================================================
       GLOBAL OBJECT
    ====================================================== */

    window.ProcureX =
        ProcureX;


    /* =====================================================
       AUTO INIT
    ====================================================== */

    function startApp() {

        ProcureX.init();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startApp
        );

    }

    else {

        startApp();

    }


    /* =====================================================
       TOAST ANIMATION
    ====================================================== */

    if (
        !document.getElementById(
            "procurex-toast-style"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "procurex-toast-style";


        style.textContent = `
            @keyframes procurexToastIn {
                from {
                    opacity:0;
                    transform:translateY(10px);
                }

                to {
                    opacity:1;
                    transform:translateY(0);
                }
            }
        `;


        document.head.appendChild(
            style
        );

    }


})(window, document);
