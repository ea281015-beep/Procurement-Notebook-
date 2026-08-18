/* =====================================================
   ProcureX - Main Application Engine
   app.js
===================================================== */


/* =====================================================
   1. DATABASE KEYS
===================================================== */

const DB = {

    suppliers: "procurex_suppliers",
    materials: "procurex_materials",
    purchaseRequests: "procurex_purchase_requests",
    quotations: "procurex_quotations",
    orders: "procurex_orders",
    notes: "procurex_notes",
    settings: "procurex_settings"

};


/* =====================================================
   2. DATABASE ENGINE
===================================================== */

const ProcureXDB = {

    get(key) {

        try {

            const data =
                localStorage.getItem(key);

            return data
                ? JSON.parse(data)
                : [];

        } catch (error) {

            console.error(
                "Database read error:",
                error
            );

            return [];

        }

    },


    set(key, data) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "Database save error:",
                error
            );

            return false;

        }

    },


    add(key, item) {

        const data =
            this.get(key);

        data.push(item);

        this.set(
            key,
            data
        );

        return item;

    },


    update(key, id, changes) {

        const data =
            this.get(key);

        const index =
            data.findIndex(
                item =>
                    item.id === id
            );


        if (index === -1) {

            return null;

        }


        data[index] = {

            ...data[index],
            ...changes

        };


        this.set(
            key,
            data
        );


        return data[index];

    },


    delete(key, id) {

        const data =
            this.get(key);


        const filtered =
            data.filter(
                item =>
                    item.id !== id
            );


        this.set(
            key,
            filtered
        );

    },


    find(key, id) {

        return this
            .get(key)
            .find(
                item =>
                    item.id === id
            );

    }

};


/* =====================================================
   3. ID GENERATOR
===================================================== */

function generateId(prefix) {

    const time =
        Date.now()
        .toString()
        .slice(-7);


    const random =
        Math.floor(
            Math.random() * 1000
        )
        .toString()
        .padStart(3, "0");


    return `${prefix}-${time}-${random}`;

}


/* =====================================================
   4. DOCUMENT NUMBER
===================================================== */

function generateDocumentNumber(
    prefix,
    collection
) {

    const year =
        new Date()
            .getFullYear();


    const data =
        ProcureXDB.get(
            collection
        );


    const number =
        data.length + 1;


    return `${prefix}-${year}-${String(number).padStart(4,"0")}`;

}


/* =====================================================
   5. SUPPLIER MANAGEMENT
===================================================== */

const SupplierManager = {


    getAll() {

        return ProcureXDB.get(
            DB.suppliers
        );

    },


    get(id) {

        return ProcureXDB.find(
            DB.suppliers,
            id
        );

    },


    create(data) {

        const supplier = {

            id:
                generateId("SUP"),

            supplierNumber:
                generateDocumentNumber(
                    "SUP",
                    DB.suppliers
                ),

            name:
                data.name || "",

            category:
                data.category || "",

            city:
                data.city || "",

            phone:
                data.phone || "",

            email:
                data.email || "",

            rating:
                Number(
                    data.rating || 0
                ),

            materials:
                data.materials || [],

            notes:
                data.notes || "",

            status:
                data.status || "active",

            createdAt:
                new Date().toISOString()

        };


        ProcureXDB.add(
            DB.suppliers,
            supplier
        );


        return supplier;

    },


    update(id, data) {

        return ProcureXDB.update(
            DB.suppliers,
            id,
            data
        );

    },


    delete(id) {

        ProcureXDB.delete(
            DB.suppliers,
            id
        );

    }

};


/* =====================================================
   6. MATERIAL MANAGEMENT
===================================================== */

const MaterialManager = {


    getAll() {

        return ProcureXDB.get(
            DB.materials
        );

    },


    create(data) {

        const material = {

            id:
                generateId("MAT"),

            materialNumber:
                generateDocumentNumber(
                    "MAT",
                    DB.materials
                ),

            name:
                data.name || "",

            type:
                data.type || "",

            category:
                data.category || "",

            partNumber:
                data.partNumber || "",

            unit:
                data.unit || "",

            image:
                data.image || "",

            suppliers:
                data.suppliers || [],

            notes:
                data.notes || "",

            createdAt:
                new Date().toISOString()

        };


        ProcureXDB.add(
            DB.materials,
            material
        );


        return material;

    },


    get(id) {

        return ProcureXDB.find(
            DB.materials,
            id
        );

    }

};


/* =====================================================
   7. PURCHASE REQUEST
===================================================== */

const PurchaseRequestManager = {


    getAll() {

        return ProcureXDB.get(
            DB.purchaseRequests
        );

    },


    get(id) {

        return ProcureXDB.find(
            DB.purchaseRequests,
            id
        );

    },


    create(data) {

        const request = {

            id:
                generateId("PR"),

            requestNumber:
                generateDocumentNumber(
                    "PR",
                    DB.purchaseRequests
                ),

            material:
                data.material || "",

            materialType:
                data.materialType || "",

            quantity:
                Number(
                    data.quantity || 0
                ),

            unit:
                data.unit || "",

            department:
                data.department || "",

            priority:
                data.priority || "normal",

            requester:
                data.requester || "",

            reason:
                data.reason || "",

            status:
                "pending",

            createdAt:
                new Date().toISOString()

        };


        ProcureXDB.add(
            DB.purchaseRequests,
            request
        );


        return request;

    },


    updateStatus(
        id,
        status
    ) {

        return ProcureXDB.update(

            DB.purchaseRequests,

            id,

            {
                status
            }

        );

    }

};


/* =====================================================
   8. QUOTATION MANAGEMENT
===================================================== */

const QuotationManager = {


    getAll() {

        return ProcureXDB.get(
            DB.quotations
        );

    },


    create(data) {

        const quotation = {

            id:
                generateId("QTN"),

            quotationNumber:
                generateDocumentNumber(
                    "QTN",
                    DB.quotations
                ),

            supplierId:
                data.supplierId || "",

            supplierName:
                data.supplierName || "",

            purchaseRequestId:
                data.purchaseRequestId || "",

            material:
                data.material || "",

            quantity:
                Number(
                    data.quantity || 0
                ),

            unitPrice:
                Number(
                    data.unitPrice || 0
                ),

            total:

                Number(
                    data.quantity || 0
                )
                *
                Number(
                    data.unitPrice || 0
                ),

            currency:
                data.currency || "SAR",

            deliveryDays:
                Number(
                    data.deliveryDays || 0
                ),

            paymentTerms:
                data.paymentTerms || "",

            notes:
                data.notes || "",

            createdAt:
                new Date().toISOString()

        };


        ProcureXDB.add(
            DB.quotations,
            quotation
        );


        return quotation;

    },


    compare(
        quotations
    ) {

        if (
            !quotations ||
            quotations.length === 0
        ) {

            return null;

        }


        const lowestPrice =
            Math.min(
                ...quotations.map(
                    q =>
                        Number(
                            q.unitPrice
                        )
                )
            );


        const fastestDelivery =
            Math.min(
                ...quotations.map(
                    q =>
                        Number(
                            q.deliveryDays
                        )
                )
            );


        return {

            lowestPrice,

            fastestDelivery,

            lowestPriceSupplier:
                quotations.find(
                    q =>
                        Number(
                            q.unitPrice
                        ) ===
                        lowestPrice
                ),

            fastestSupplier:
                quotations.find(
                    q =>
                        Number(
                            q.deliveryDays
                        ) ===
                        fastestDelivery
                )

        };

    }

};


/* =====================================================
   9. PURCHASE ORDER
===================================================== */

const PurchaseOrderManager = {


    getAll() {

        return ProcureXDB.get(
            DB.orders
        );

    },


    create(data) {

        const order = {

            id:
                generateId("PO"),

            orderNumber:
                generateDocumentNumber(
                    "PO",
                    DB.orders
                ),

            supplierId:
                data.supplierId || "",

            supplierName:
                data.supplierName || "",

            quotationId:
                data.quotationId || "",

            material:
                data.material || "",

            quantity:
                Number(
                    data.quantity || 0
                ),

            unitPrice:
                Number(
                    data.unitPrice || 0
                ),

            total:

                Number(
                    data.quantity || 0
                )
                *
                Number(
                    data.unitPrice || 0
                ),

            currency:
                data.currency || "SAR",

            deliveryDate:
                data.deliveryDate || "",

            paymentTerms:
                data.paymentTerms || "",

            status:
                "draft",

            createdAt:
                new Date().toISOString()

        };


        ProcureXDB.add(
            DB.orders,
            order
        );


        return order;

    },


    updateStatus(
        id,
        status
    ) {

        return ProcureXDB.update(

            DB.orders,

            id,

            {
                status
            }

        );

    }

};


/* =====================================================
   10. NOTES
===================================================== */

const NotesManager = {


    save(
        referenceId,
        note
    ) {

        const notes =
            ProcureXDB.get(
                DB.notes
            );


        const existing =
            notes.find(
                item =>
                    item.referenceId ===
                    referenceId
            );


        if (existing) {

            existing.note =
                note;

            existing.updatedAt =
                new Date()
                    .toISOString();

        } else {

            notes.push({

                id:
                    generateId("NOTE"),

                referenceId,

                note,

                createdAt:
                    new Date()
                        .toISOString()

            });

        }


        ProcureXDB.set(
            DB.notes,
            notes
        );

    },


    get(
        referenceId
    ) {

        return ProcureXDB
            .get(DB.notes)
            .find(
                item =>
                    item.referenceId ===
                    referenceId
            );

    }

};


/* =====================================================
   11. DASHBOARD STATISTICS
===================================================== */

const Dashboard = {


    getStats() {

        const suppliers =
            SupplierManager
                .getAll();


        const materials =
            MaterialManager
                .getAll();


        const requests =
            PurchaseRequestManager
                .getAll();


        const quotations =
            QuotationManager
                .getAll();


        const orders =
            PurchaseOrderManager
                .getAll();


        const totalPurchaseValue =
            orders.reduce(
                (
                    total,
                    order
                ) =>
                    total +
                    Number(
                        order.total || 0
                    ),
                0
            );


        return {

            suppliers:
                suppliers.length,

            materials:
                materials.length,

            purchaseRequests:
                requests.length,

            quotations:
                quotations.length,

            purchaseOrders:
                orders.length,

            totalPurchaseValue

        };

    }

};


/* =====================================================
   12. EXPORT DATA
===================================================== */

const ProcureXExport = {


    getAllData() {

        return {

            suppliers:
                SupplierManager
                    .getAll(),

            materials:
                MaterialManager
                    .getAll(),

            purchaseRequests:
                PurchaseRequestManager
                    .getAll(),

            quotations:
                QuotationManager
                    .getAll(),

            orders:
                PurchaseOrderManager
                    .getAll()

        };

    },


    downloadJSON() {

        const data =
            this.getAllData();


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
            "procurex-backup.json";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }

};


/* =====================================================
   13. TOAST MESSAGE
===================================================== */

function showToast(
    message,
    type = "success"
) {

    let toast =
        document.getElementById(
            "procurex-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "procurex-toast";


        toast.style.position =
            "fixed";

        toast.style.bottom =
            "25px";

        toast.style.left =
            "25px";

        toast.style.zIndex =
            "99999";

        toast.style.padding =
            "12px 17px";

        toast.style.borderRadius =
            "9px";

        toast.style.background =
            "#101828";

        toast.style.color =
            "white";

        toast.style.fontSize =
            "11px";

        toast.style.fontWeight =
            "700";

        toast.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.15)";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.display =
        "block";


    setTimeout(
        () => {

            toast.style.display =
                "none";

        },
        2500
    );

}


/* =====================================================
   14. GLOBAL API
===================================================== */

window.ProcureX = {

    DB,

    database:
        ProcureXDB,

    suppliers:
        SupplierManager,

    materials:
        MaterialManager,

    purchaseRequests:
        PurchaseRequestManager,

    quotations:
        QuotationManager,

    purchaseOrders:
        PurchaseOrderManager,

    notes:
        NotesManager,

    dashboard:
        Dashboard,

    export:
        ProcureXExport,

    showToast

};


/* =====================================================
   15. STARTUP
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "ProcureX System Started"
        );


        console.log(
            "Dashboard:",
            Dashboard.getStats()
        );

    }
);
