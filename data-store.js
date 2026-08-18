/* =========================================================
   ProcureX - DATA STORE
   حفظ كل بيانات نظام المشتريات
========================================================= */

const PX_STORAGE_KEY = "procurex_database_v2";


/* =========================================================
   DATABASE
========================================================= */

const ProcureXStore = {

    defaultData: {

        materials: [],
        suppliers: [],
        searches: [],
        priceHistory: [],
        quotations: [],
        evaluations: [],
        comparisons: [],
        attachments: [],
        activities: [],

        settings: {
            version: 2,
            createdAt: new Date().toISOString()
        }

    },


    /* ================= LOAD ================= */

    load() {

        try {

            const saved =
                localStorage.getItem(
                    PX_STORAGE_KEY
                );

            if (!saved) {

                this.save(
                    this.defaultData
                );

                return structuredClone(
                    this.defaultData
                );

            }

            const data =
                JSON.parse(saved);


            return {

                ...structuredClone(
                    this.defaultData
                ),

                ...data,

                settings: {

                    ...this.defaultData.settings,

                    ...(data.settings || {})

                }

            };

        } catch (error) {

            console.error(
                "ProcureX database error:",
                error
            );

            return structuredClone(
                this.defaultData
            );

        }

    },


    /* ================= SAVE ================= */

    save(data) {

        localStorage.setItem(

            PX_STORAGE_KEY,

            JSON.stringify(data)

        );

    },


    /* ================= UPDATE ================= */

    update(callback) {

        const data =
            this.load();

        callback(data);

        this.save(data);

        return data;

    },


    /* ================= ID ================= */

    id(prefix) {

        return (

            prefix +
            "-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2,7)

        );

    },


    /* ================= DATE ================= */

    now() {

        return new Date()
            .toISOString();

    }

};


/* =========================================================
   MATERIALS
========================================================= */

const MaterialStore = {

    all() {

        return ProcureXStore
            .load()
            .materials;

    },


    find(id) {

        return this
            .all()
            .find(
                item =>
                    item.id === id
            );

    },


    findByName(name) {

        const search =
            String(name)
                .trim()
                .toLowerCase();


        return this
            .all()
            .filter(
                item =>
                    String(
                        item.name || ""
                    )
                    .toLowerCase()
                    .includes(search)
            );

    },


    save(material) {

        return ProcureXStore.update(
            data => {

                const existing =
                    data.materials.find(
                        item =>
                            item.id ===
                            material.id
                    );


                if (existing) {

                    Object.assign(
                        existing,
                        material,
                        {
                            updatedAt:
                                ProcureXStore.now()
                        }
                    );

                } else {

                    data.materials.push({

                        id:
                            material.id ||
                            ProcureXStore.id(
                                "MAT"
                            ),

                        name:
                            material.name || "",

                        type:
                            material.type || "",

                        partNumber:
                            material.partNumber ||
                            "",

                        category:
                            material.category ||
                            "",

                        unit:
                            material.unit || "",

                        city:
                            material.city || "",

                        image:
                            material.image || "",

                        suppliers:
                            material.suppliers ||
                            [],

                        notes:
                            material.notes || "",

                        createdAt:
                            ProcureXStore.now(),

                        updatedAt:
                            ProcureXStore.now()

                    });

                }

            }

        );

    }

};


/* =========================================================
   SUPPLIERS
========================================================= */

const SupplierStore = {

    all() {

        return ProcureXStore
            .load()
            .suppliers;

    },


    find(id) {

        return this
            .all()
            .find(
                item =>
                    item.id === id
            );

    },


    search(text, city = "") {

        const search =
            String(text || "")
                .trim()
                .toLowerCase();

        const location =
            String(city || "")
                .trim()
                .toLowerCase();


        return this
            .all()
            .filter(supplier => {

                const textMatch =

                    !search ||

                    String(
                        supplier.name || ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        supplier.category || ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        supplier.materials || ""
                    )
                    .toLowerCase()
                    .includes(search);


                const cityMatch =

                    !location ||

                    String(
                        supplier.city || ""
                    )
                    .toLowerCase()
                    .includes(location);


                return (
                    textMatch &&
                    cityMatch
                );

            });

    },


    save(supplier) {

        return ProcureXStore.update(
            data => {

                const existing =
                    data.suppliers.find(
                        item =>
                            item.id ===
                            supplier.id
                    );


                if (existing) {

                    Object.assign(
                        existing,
                        supplier,
                        {
                            updatedAt:
                                ProcureXStore.now()
                        }
                    );

                } else {

                    data.suppliers.push({

                        id:
                            supplier.id ||
                            ProcureXStore.id(
                                "SUP"
                            ),

                        name:
                            supplier.name || "",

                        category:
                            supplier.category ||
                            "",

                        city:
                            supplier.city || "",

                        phone:
                            supplier.phone || "",

                        email:
                            supplier.email || "",

                        website:
                            supplier.website || "",

                        location:
                            supplier.location || "",

                        materials:
                            supplier.materials ||
                            [],

                        rating:
                            Number(
                                supplier.rating || 0
                            ),

                        notes:
                            supplier.notes || "",

                        status:
                            supplier.status ||
                            "active",

                        createdAt:
                            ProcureXStore.now(),

                        updatedAt:
                            ProcureXStore.now()

                    });

                }

            }

        );

    }

};


/* =========================================================
   SEARCH HISTORY
========================================================= */

const SearchStore = {

    save(search) {

        ProcureXStore.update(
            data => {

                data.searches.unshift({

                    id:
                        ProcureXStore.id(
                            "SEARCH"
                        ),

                    keyword:
                        search.keyword || "",

                    type:
                        search.type || "material",

                    city:
                        search.city || "",

                    results:
                        search.results || [],

                    searchedAt:
                        ProcureXStore.now()

                });


                /*
                 * الاحتفاظ بآخر 500 عملية بحث
                 */

                data.searches =
                    data.searches.slice(
                        0,
                        500
                    );

            }
        );

    },


    all() {

        return ProcureXStore
            .load()
            .searches;

    },


    recent(limit = 20) {

        return this
            .all()
            .slice(
                0,
                limit
            );

    }

};


/* =========================================================
   PRICE HISTORY
========================================================= */

const PriceStore = {

    save(price) {

        ProcureXStore.update(
            data => {

                data.priceHistory.unshift({

                    id:
                        ProcureXStore.id(
                            "PRICE"
                        ),

                    materialId:
                        price.materialId ||
                        "",

                    material:
                        price.material ||
                        "",

                    supplierId:
                        price.supplierId ||
                        "",

                    supplier:
                        price.supplier ||
                        "",

                    unitPrice:
                        Number(
                            price.unitPrice || 0
                        ),

                    currency:
                        price.currency ||
                        "SAR",

                    unit:
                        price.unit ||
                        "",

                    quantity:
                        Number(
                            price.quantity || 0
                        ),

                    source:
                        price.source ||
                        "manual",

                    date:
                        price.date ||
                        ProcureXStore.now(),

                    notes:
                        price.notes ||
                        ""

                });

            }
        );

    },


    forMaterial(materialId) {

        return ProcureXStore
            .load()
            .priceHistory
            .filter(
                item =>
                    item.materialId ===
                    materialId
            );

    },


    forMaterialName(material) {

        const name =
            String(material)
                .trim()
                .toLowerCase();


        return ProcureXStore
            .load()
            .priceHistory
            .filter(
                item =>
                    String(
                        item.material || ""
                    )
                    .toLowerCase() ===
                    name
            );

    },


    statistics(material) {

        const prices =
            this.forMaterialName(
                material
            )
            .map(
                item =>
                    Number(
                        item.unitPrice
                    )
            )
            .filter(
                price =>
                    price > 0
            );


        if (!prices.length) {

            return {

                count: 0,
                lowest: 0,
                highest: 0,
                average: 0,
                latest: 0

            };

        }


        const sorted =
            [...prices]
                .sort(
                    (a,b) =>
                        a - b
                );


        return {

            count:
                prices.length,

            lowest:
                sorted[0],

            highest:
                sorted[
                    sorted.length - 1
                ],

            average:
                prices.reduce(
                    (a,b) =>
                        a + b,
                    0
                ) /
                prices.length,

            latest:
                prices[
                    0
                ]

        };

    }

};


/* =========================================================
   QUOTATIONS
========================================================= */

const QuotationStore = {

    save(quotation) {

        ProcureXStore.update(
            data => {

                data.quotations.push({

                    id:
                        quotation.id ||
                        ProcureXStore.id(
                            "QTN"
                        ),

                    material:
                        quotation.material ||
                        "",

                    materialId:
                        quotation.materialId ||
                        "",

                    supplierId:
                        quotation.supplierId ||
                        "",

                    supplier:
                        quotation.supplier ||
                        "",

                    quantity:
                        Number(
                            quotation.quantity || 0
                        ),

                    unitPrice:
                        Number(
                            quotation.unitPrice || 0
                        ),

                    currency:
                        quotation.currency ||
                        "SAR",

                    deliveryDays:
                        Number(
                            quotation.deliveryDays ||
                            0
                        ),

                    paymentTerms:
                        quotation.paymentTerms ||
                        "",

                    notes:
                        quotation.notes ||
                        "",

                    date:
                        ProcureXStore.now()

                });

            }
        );


        /*
         * تسجيل السعر تلقائيًا
         */

        PriceStore.save({

            materialId:
                quotation.materialId,

            material:
                quotation.material,

            supplierId:
                quotation.supplierId,

            supplier:
                quotation.supplier,

            unitPrice:
                quotation.unitPrice,

            currency:
                quotation.currency,

            quantity:
                quotation.quantity,

            unit:
                quotation.unit,

            source:
                "quotation"

        });

    },


    all() {

        return ProcureXStore
            .load()
            .quotations;

    }

};


/* =========================================================
   SUPPLIER EVALUATION
========================================================= */

const EvaluationStore = {

    save(evaluation) {

        ProcureXStore.update(
            data => {

                data.evaluations.push({

                    id:
                        ProcureXStore.id(
                            "EVAL"
                        ),

                    supplierId:
                        evaluation.supplierId ||
                        "",

                    supplier:
                        evaluation.supplier ||
                        "",

                    price:
                        Number(
                            evaluation.price || 0
                        ),

                    quality:
                        Number(
                            evaluation.quality || 0
                        ),

                    response:
                        Number(
                            evaluation.response || 0
                        ),

                    delivery:
                        Number(
                            evaluation.delivery || 0
                        ),

                    notes:
                        evaluation.notes ||
                        "",

                    date:
                        ProcureXStore.now()

                });

            }
        );

    },


    forSupplier(supplierId) {

        return ProcureXStore
            .load()
            .evaluations
            .filter(
                item =>
                    item.supplierId ===
                    supplierId
            );

    },


    average(supplierId) {

        const list =
            this.forSupplier(
                supplierId
            );


        if (!list.length) {

            return 0;

        }


        const totals =
            list.map(
                item =>
                    (
                        item.price +
                        item.quality +
                        item.response +
                        item.delivery
                    ) / 4
            );


        return (

            totals.reduce(
                (a,b) =>
                    a + b,
                0
            ) /
            totals.length

        ).toFixed(1);

    }

};


/* =========================================================
   COMPARISON HISTORY
========================================================= */

const ComparisonStore = {

    save(comparison) {

        ProcureXStore.update(
            data => {

                data.comparisons.unshift({

                    id:
                        ProcureXStore.id(
                            "CMP"
                        ),

                    material:
                        comparison.material ||
                        "",

                    materialId:
                        comparison.materialId ||
                        "",

                    suppliers:
                        comparison.suppliers ||
                        [],

                    winner:
                        comparison.winner ||
                        "",

                    reason:
                        comparison.reason ||
                        "",

                    date:
                        ProcureXStore.now()

                });

            }
        );

    },


    all() {

        return ProcureXStore
            .load()
            .comparisons;

    }

};


/* =========================================================
   ATTACHMENTS
========================================================= */

const AttachmentStore = {

    save(fileData) {

        ProcureXStore.update(
            data => {

                data.attachments.push({

                    id:
                        ProcureXStore.id(
                            "FILE"
                        ),

                    name:
                        fileData.name ||
                        "",

                    type:
                        fileData.type ||
                        "",

                    size:
                        fileData.size ||
                        0,

                    relatedType:
                        fileData.relatedType ||
                        "",

                    relatedId:
                        fileData.relatedId ||
                        "",

                    data:
                        fileData.data ||
                        "",

                    date:
                        ProcureXStore.now()

                });

            }
        );

    },


    forRecord(
        relatedType,
        relatedId
    ) {

        return ProcureXStore
            .load()
            .attachments
            .filter(
                item =>

                    item.relatedType ===
                    relatedType

                    &&

                    item.relatedId ===
                    relatedId
            );

    }

};


/* =========================================================
   ACTIVITY LOG
========================================================= */

const ActivityStore = {

    add(
        action,
        description,
        extra = {}
    ) {

        ProcureXStore.update(
            data => {

                data.activities.unshift({

                    id:
                        ProcureXStore.id(
                            "ACT"
                        ),

                    action,

                    description,

                    ...extra,

                    date:
                        ProcureXStore.now()

                });


                data.activities =
                    data.activities.slice(
                        0,
                        1000
                    );

            }
        );

    },


    all(limit = 100) {

        return ProcureXStore
            .load()
            .activities
            .slice(
                0,
                limit
            );

    }

};


/* =========================================================
   UNIVERSAL MATERIAL SEARCH
========================================================= */

function searchMaterial(
    keyword,
    city = ""
) {

    const text =
        String(keyword || "")
            .trim()
            .toLowerCase();


    const location =
        String(city || "")
            .trim()
            .toLowerCase();


    const materials =
        MaterialStore.all();


    const suppliers =
        SupplierStore.all();


    const materialResults =
        materials.filter(
            material => {

                const matchesText =

                    !text ||

                    String(
                        material.name || ""
                    )
                    .toLowerCase()
                    .includes(text)

                    ||

                    String(
                        material.type || ""
                    )
                    .toLowerCase()
                    .includes(text)

                    ||

                    String(
                        material.partNumber || ""
                    )
                    .toLowerCase()
                    .includes(text)

                    ||

                    String(
                        material.category || ""
                    )
                    .toLowerCase()
                    .includes(text);


                const matchesCity =

                    !location ||

                    String(
                        material.city || ""
                    )
                    .toLowerCase()
                    .includes(location);


                return (
                    matchesText &&
                    matchesCity
                );

            }
        );


    const supplierResults =
        suppliers.filter(
            supplier => {

                const supplierText =

                    !text ||

                    String(
                        supplier.name || ""
                    )
                    .toLowerCase()
                    .includes(text)

                    ||

                    String(
                        supplier.category || ""
                    )
                    .toLowerCase()
                    .includes(text)

                    ||

                    String(
                        supplier.materials || ""
                    )
                    .toLowerCase()
                    .includes(text);


                const supplierCity =

                    !location ||

                    String(
                        supplier.city || ""
                    )
                    .toLowerCase()
                    .includes(location);


                return (
                    supplierText &&
                    supplierCity
                );

            }
        );


    /*
     * حفظ عملية البحث
     */

    SearchStore.save({

        keyword,

        city,

        type:
            "material",

        results: {

            materials:
                materialResults.map(
                    item =>
                        item.id
                ),

            suppliers:
                supplierResults.map(
                    item =>
                        item.id
                )

        }

    });


    /*
     * تسجيل النشاط
     */

    ActivityStore.add(

        "search",

        `البحث عن: ${keyword}`,

        {
            keyword,
            city
        }

    );


    return {

        materials:
            materialResults,

        suppliers:
            supplierResults

    };

}


/* =========================================================
   SAVE MATERIAL FROM SEARCH
========================================================= */

function rememberMaterialFromSearch(
    material
) {

    const existing =
        MaterialStore
            .findByName(
                material.name
            );


    if (
        existing.length
    ) {

        return existing[0];

    }


    MaterialStore.save(
        material
    );


    ActivityStore.add(

        "material_saved",

        `تم حفظ المادة: ${material.name}`

    );


    return MaterialStore
        .findByName(
            material.name
        )[0];

}


/* =========================================================
   AUTO SAVE SEARCH RESULT
========================================================= */

function saveSearchResult(
    result
) {

    if (
        !result
    ) {

        return;

    }


    if (
        result.material
    ) {

        rememberMaterialFromSearch(
            result.material
        );

    }


    if (
        result.supplier
    ) {

        SupplierStore.save(
            result.supplier
        );

    }

}


/* =========================================================
   BACKUP
========================================================= */

function backupProcureX() {

    const data =
        ProcureXStore.load();


    const blob =
        new Blob(

            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }

        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `ProcureX-Backup-${new Date()
            .toISOString()
            .slice(0,10)
        }.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    ActivityStore.add(

        "backup",

        "تم إنشاء نسخة احتياطية من النظام."

    );

}


/* =========================================================
   CLEAR DATABASE
   لا تستخدمها إلا لو عايز تمسح كل البيانات
========================================================= */

function clearProcureXData() {

    const confirmDelete =
        confirm(
            "هل أنت متأكد؟ سيتم حذف جميع بيانات ProcureX."
        );


    if (!confirmDelete) {

        return;

    }


    localStorage.removeItem(
        PX_STORAGE_KEY
    );


    location.reload();

}


/* =========================================================
   GLOBAL API
========================================================= */

window.ProcureXStore =
    ProcureXStore;

window.MaterialStore =
    MaterialStore;

window.SupplierStore =
    SupplierStore;

window.SearchStore =
    SearchStore;

window.PriceStore =
    PriceStore;

window.QuotationStore =
    QuotationStore;

window.EvaluationStore =
    EvaluationStore;

window.ComparisonStore =
    ComparisonStore;

window.AttachmentStore =
    AttachmentStore;

window.ActivityStore =
    ActivityStore;

window.searchMaterial =
    searchMaterial;

window.rememberMaterialFromSearch =
    rememberMaterialFromSearch;

window.saveSearchResult =
    saveSearchResult;

window.backupProcureX =
    backupProcureX;

window.clearProcureXData =
    clearProcureXData;


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        ProcureXStore.load();

        console.log(
            "✅ ProcureX Data Store Ready"
        );

        console.log(
            "📦 Database:",
            ProcureXStore.load()
        );

    }
);
