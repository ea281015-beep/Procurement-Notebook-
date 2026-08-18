/* =========================================================
   ProcureX - Search Engine
   File: search.engine.js
   Version: 1.0
   ========================================================= */

(function (window) {

    "use strict";

    /* =====================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = {
        apiBaseUrl: "/api",
        supplierEndpoint: "/suppliers/search",

        /*
         * لو الـ Backend لسه مش موجود، البحث المحلي
         * يشتغل من قاعدة الموردين الموجودة في المتصفح.
         */
        enableLocalSearch: true,
        enableExternalSearch: true,

        maxResults: 50
    };


    /* =====================================================
       SEARCH ENGINE
    ====================================================== */

    class ProcureXSearchEngine {

        constructor() {

            this.config = CONFIG;

        }


        /* =================================================
           NORMALIZE TEXT
        ================================================== */

        normalize(value) {

            if (value === null || value === undefined) {
                return "";
            }

            return String(value)
                .toLowerCase()
                .trim()
                .replace(/[أإآ]/g, "ا")
                .replace(/ة/g, "ه")
                .replace(/ى/g, "ي")
                .replace(/\s+/g, " ");

        }


        /* =================================================
           BUILD QUERY
        ================================================== */

        buildQuery(criteria = {}) {

            return {

                materialName:
                    this.clean(criteria.materialName),

                materialType:
                    this.clean(criteria.materialType),

                city:
                    this.clean(criteria.city),

                partNumber:
                    this.clean(criteria.partNumber),

                model:
                    this.clean(criteria.model),

                specification:
                    this.clean(criteria.specification),

                keyword:
                    this.clean(criteria.keyword)

            };

        }


        /* =================================================
           CLEAN VALUE
        ================================================== */

        clean(value) {

            if (
                value === null ||
                value === undefined
            ) {

                return "";

            }

            return String(value).trim();

        }


        /* =================================================
           MAIN SEARCH
        ================================================== */

        async search(criteria = {}) {

            const query =
                this.buildQuery(criteria);


            if (
                !query.materialName &&
                !query.partNumber &&
                !query.keyword
            ) {

                return {

                    success: false,

                    source: null,

                    total: 0,

                    results: [],

                    message:
                        "اكتب اسم المادة أو رقم القطعة أو كلمة البحث."

                };

            }


            let localResults = [];

            let externalResults = [];


            /* =============================================
               LOCAL DATABASE
               ============================================== */

            if (this.config.enableLocalSearch) {

                localResults =
                    this.searchLocalDatabase(query);

            }


            /* =============================================
               EXTERNAL SEARCH
               ============================================== */

            if (this.config.enableExternalSearch) {

                try {

                    externalResults =
                        await this.searchExternal(query);

                }

                catch (error) {

                    console.error(
                        "ProcureX external search error:",
                        error
                    );

                    externalResults = [];

                }

            }


            /* =============================================
               MERGE RESULTS
               ============================================== */

            const mergedResults =
                this.mergeResults(
                    localResults,
                    externalResults
                );


            return {

                success: true,

                source: {
                    local:
                        localResults.length > 0,

                    external:
                        externalResults.length > 0
                },

                total:
                    mergedResults.length,

                results:
                    mergedResults.slice(
                        0,
                        this.config.maxResults
                    ),

                query

            };

        }


        /* =================================================
           LOCAL DATABASE SEARCH
        ================================================== */

        searchLocalDatabase(query) {

            let suppliers = [];


            try {

                const stored =
                    localStorage.getItem(
                        "procurex_suppliers"
                    );


                if (stored) {

                    const parsed =
                        JSON.parse(stored);


                    if (Array.isArray(parsed)) {

                        suppliers = parsed;

                    }

                }

            }

            catch (error) {

                console.error(
                    "ProcureX local supplier database error:",
                    error
                );

            }


            if (!suppliers.length) {

                return [];

            }


            return suppliers

                .map(
                    supplier =>
                        this.scoreSupplier(
                            supplier,
                            query
                        )
                )

                .filter(
                    supplier =>
                        supplier._score > 0
                )

                .sort(
                    (a, b) =>
                        b._score - a._score
                )

                .map(
                    supplier =>
                        this.formatResult(
                            supplier,
                            "local"
                        )
                );

        }


        /* =================================================
           SUPPLIER SCORING
        ================================================== */

        scoreSupplier(
            supplier,
            query
        ) {

            let score = 0;


            const searchableText =
                this.normalize(
                    [
                        supplier.name,
                        supplier.companyName,
                        supplier.businessName,
                        supplier.activity,
                        supplier.category,
                        supplier.type,
                        supplier.materials,
                        supplier.products,
                        supplier.city,
                        supplier.address,
                        supplier.phone,
                        supplier.website
                    ]
                    .filter(Boolean)
                    .join(" ")
                );


            /* =============================================
               MATERIAL NAME
               ============================================== */

            if (query.materialName) {

                const material =
                    this.normalize(
                        query.materialName
                    );


                if (
                    searchableText.includes(
                        material
                    )
                ) {

                    score += 40;

                }

            }


            /* =============================================
               KEYWORD
               ============================================== */

            if (query.keyword) {

                const keyword =
                    this.normalize(
                        query.keyword
                    );


                if (
                    searchableText.includes(
                        keyword
                    )
                ) {

                    score += 30;

                }

            }


            /* =============================================
               MATERIAL TYPE
               ============================================== */

            if (query.materialType) {

                const type =
                    this.normalize(
                        query.materialType
                    );


                if (
                    searchableText.includes(
                        type
                    )
                ) {

                    score += 20;

                }

            }


            /* =============================================
               CITY
               ============================================== */

            if (query.city) {

                const city =
                    this.normalize(
                        query.city
                    );


                const supplierCity =
                    this.normalize(
                        supplier.city
                    );


                if (
                    supplierCity === city
                ) {

                    score += 25;

                }
                else if (
                    searchableText.includes(
                        city
                    )
                ) {

                    score += 10;

                }

            }


            /* =============================================
               PART NUMBER
               ============================================== */

            if (query.partNumber) {

                const part =
                    this.normalize(
                        query.partNumber
                    );


                const supplierPart =
                    this.normalize(
                        supplier.partNumber
                    );


                if (
                    supplierPart &&
                    supplierPart === part
                ) {

                    score += 60;

                }
                else if (
                    searchableText.includes(
                        part
                    )
                ) {

                    score += 30;

                }

            }


            /* =============================================
               MODEL
               ============================================== */

            if (query.model) {

                const model =
                    this.normalize(
                        query.model
                    );


                if (
                    searchableText.includes(
                        model
                    )
                ) {

                    score += 15;

                }

            }


            /* =============================================
               SPECIFICATION
               ============================================== */

            if (query.specification) {

                const specification =
                    this.normalize(
                        query.specification
                    );


                const words =
                    specification
                        .split(" ")
                        .filter(
                            word =>
                                word.length >= 2
                        );


                words.forEach(
                    word => {

                        if (
                            searchableText.includes(
                                word
                            )
                        ) {

                            score += 5;

                        }

                    }
                );

            }


            supplier._score =
                score;


            return supplier;

        }


        /* =================================================
           EXTERNAL SEARCH
        ================================================== */

        async searchExternal(query) {

            /*
             * مهم:
             *
             * هنا لا نضع أرقام موردين أو بيانات وهمية.
             *
             * الـ Backend هو المسؤول عن الاتصال
             * بمصدر البحث الحقيقي.
             */


            const url =
                this.buildExternalUrl(query);


            try {

                const response =
                    await fetch(url, {

                        method: "GET",

                        headers: {

                            "Accept":
                                "application/json"

                        }

                    });


                if (!response.ok) {

                    throw new Error(
                        `Search API error: ${response.status}`
                    );

                }


                const data =
                    await response.json();


                return this.normalizeExternalResults(
                    data
                );

            }

            catch (error) {

                console.warn(
                    "External supplier search unavailable:",
                    error.message
                );


                return [];

            }

        }


        /* =================================================
           BUILD API URL
        ================================================== */

        buildExternalUrl(query) {

            const params =
                new URLSearchParams();


            if (query.materialName) {

                params.set(
                    "material",
                    query.materialName
                );

            }


            if (query.materialType) {

                params.set(
                    "type",
                    query.materialType
                );

            }


            if (query.city) {

                params.set(
                    "city",
                    query.city
                );

            }


            if (query.partNumber) {

                params.set(
                    "partNumber",
                    query.partNumber
                );

            }


            if (query.model) {

                params.set(
                    "model",
                    query.model
                );

            }


            if (query.specification) {

                params.set(
                    "specification",
                    query.specification
                );

            }


            if (query.keyword) {

                params.set(
                    "keyword",
                    query.keyword
                );

            }


            return (
                this.config.apiBaseUrl +
                this.config.supplierEndpoint +
                "?" +
                params.toString()
            );

        }


        /* =================================================
           NORMALIZE EXTERNAL RESULTS
        ================================================== */

        normalizeExternalResults(data) {

            if (!data) {

                return [];

            }


            let results = [];


            if (Array.isArray(data)) {

                results = data;

            }

            else if (
                Array.isArray(
                    data.results
                )
            ) {

                results =
                    data.results;

            }

            else if (
                Array.isArray(
                    data.suppliers
                )
            ) {

                results =
                    data.suppliers;

            }


            return results.map(
                supplier =>
                    this.formatResult(
                        supplier,
                        "external"
                    )
            );

        }


        /* =================================================
           FORMAT RESULT
        ================================================== */

        formatResult(
            supplier,
            source
        ) {

            return {

                id:
                    supplier.id ||
                    supplier.supplierId ||
                    null,

                name:
                    supplier.name ||
                    supplier.companyName ||
                    supplier.businessName ||
                    "غير معروف",


                activity:
                    supplier.activity ||
                    supplier.category ||
                    supplier.type ||
                    "غير محدد",


                materials:
                    supplier.materials ||
                    supplier.products ||
                    "",


                city:
                    supplier.city ||
                    "",


                address:
                    supplier.address ||
                    "",


                phone:
                    supplier.phone ||
                    supplier.mobile ||
                    "",


                email:
                    supplier.email ||
                    "",


                website:
                    supplier.website ||
                    supplier.url ||
                    "",


                latitude:
                    supplier.latitude ||
                    supplier.lat ||
                    null,


                longitude:
                    supplier.longitude ||
                    supplier.lng ||
                    null,


                source,


                sourceUrl:
                    supplier.sourceUrl ||
                    supplier.url ||
                    "",


                score:
                    supplier._score ||
                    supplier.score ||
                    0,


                raw:
                    supplier

            };

        }


        /* =================================================
           MERGE RESULTS
        ================================================== */

        mergeResults(
            localResults,
            externalResults
        ) {

            const all =
                [
                    ...localResults,
                    ...externalResults
                ];


            const unique =
                new Map();


            all.forEach(
                supplier => {

                    const key =
                        this.normalize(
                            [
                                supplier.name,
                                supplier.city,
                                supplier.phone
                            ]
                            .filter(Boolean)
                            .join("|")
                        );


                    if (!key) {

                        return;

                    }


                    if (
                        !unique.has(key)
                    ) {

                        unique.set(
                            key,
                            supplier
                        );

                    }

                }
            );


            return Array
                .from(
                    unique.values()
                )
                .sort(
                    (a, b) =>
                        (b.score || 0) -
                        (a.score || 0)
                );

        }


        /* =================================================
           SAVE SUPPLIER
        ================================================== */

        saveSupplier(
            supplier
        ) {

            if (!supplier) {

                return {

                    success: false,

                    message:
                        "بيانات المورد غير صحيحة."

                };

            }


            let suppliers = [];


            try {

                suppliers =
                    JSON.parse(
                        localStorage.getItem(
                            "procurex_suppliers"
                        )
                    ) || [];

            }

            catch {

                suppliers = [];

            }


            if (!Array.isArray(suppliers)) {

                suppliers = [];

            }


            const exists =
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


            if (exists) {

                return {

                    success: false,

                    duplicate: true,

                    message:
                        "المورد موجود بالفعل في قاعدة البيانات."

                };

            }


            const newSupplier = {

                ...supplier,

                id:
                    supplier.id ||
                    "SUP-" +
                    Date.now(),

                createdAt:
                    new Date().toISOString(),

                savedFrom:
                    supplier.source ||
                    "search"

            };


            delete newSupplier.raw;


            suppliers.push(
                newSupplier
            );


            localStorage.setItem(
                "procurex_suppliers",
                JSON.stringify(
                    suppliers
                )
            );


            return {

                success: true,

                supplier:
                    newSupplier,

                message:
                    "تمت إضافة المورد إلى قاعدة بيانات ProcureX."

            };

        }


        /* =================================================
           GET SAVED SUPPLIERS
        ================================================== */

        getSavedSuppliers() {

            try {

                const data =
                    JSON.parse(
                        localStorage.getItem(
                            "procurex_suppliers"
                        )
                    );


                return Array.isArray(data)
                    ? data
                    : [];

            }

            catch {

                return [];

            }

        }

    }


    /* =====================================================
       CREATE GLOBAL INSTANCE
    ====================================================== */

    const searchEngine =
        new ProcureXSearchEngine();


    /* =====================================================
       GLOBAL API
    ====================================================== */

    window.ProcureXSearch =
        searchEngine;


    /* =====================================================
       READY EVENT
    ====================================================== */

    window.dispatchEvent(
        new CustomEvent(
            "ProcureXSearchReady"
        )
    );


    console.log(
        "ProcureX Search Engine loaded successfully."
    );


})(window);
