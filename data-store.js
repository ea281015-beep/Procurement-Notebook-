/* =========================================================
   ProcureX - DATA STORE
   الملف المسؤول عن حفظ وإدارة:
   الموردين - جهات الاتصال - المواد - عمليات البحث
   ========================================================= */

(function () {

    "use strict";

    const STORAGE_KEYS = {
        suppliers: "procurex_suppliers",
        contacts: "procurex_contacts",
        materials: "procurex_materials",
        searches: "procurex_material_searches"
    };


    /* =====================================================
       BASIC STORAGE
    ===================================================== */

    function getData(key) {

        try {

            const data = localStorage.getItem(key);

            if (!data) {
                return [];
            }

            const parsed = JSON.parse(data);

            return Array.isArray(parsed) ? parsed : [];

        } catch (error) {

            console.error(
                "ProcureX Storage Error:",
                error
            );

            return [];

        }
    }


    function setData(key, data) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "ProcureX Save Error:",
                error
            );

            return false;

        }

    }


    /* =====================================================
       ID GENERATOR
    ===================================================== */

    function generateId(prefix) {

        return (
            prefix +
            "-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()
        );

    }


    /* =====================================================
       SUPPLIERS
    ===================================================== */

    function getSuppliers() {

        return getData(
            STORAGE_KEYS.suppliers
        );

    }


    function getSupplier(id) {

        const suppliers =
            getSuppliers();

        return suppliers.find(
            supplier =>
                supplier.id === id
        ) || null;

    }


    function saveSupplier(supplier) {

        if (!supplier) {
            return null;
        }

        const suppliers =
            getSuppliers();


        const now =
            new Date().toISOString();


        const newSupplier = {

            id:
                supplier.id ||
                generateId("SUP"),

            companyName:
                supplier.companyName ||
                "",

            supplierName:
                supplier.supplierName ||
                "",

            category:
                supplier.category ||
                "",

            city:
                supplier.city ||
                "",

            address:
                supplier.address ||
                "",

            phone:
                supplier.phone ||
                "",

            mobile:
                supplier.mobile ||
                "",

            email:
                supplier.email ||
                "",

            website:
                supplier.website ||
                "",

            taxNumber:
                supplier.taxNumber ||
                "",

            commercialRegister:
                supplier.commercialRegister ||
                "",

            materials:
                Array.isArray(
                    supplier.materials
                )
                    ? supplier.materials
                    : [],

            notes:
                supplier.notes ||
                "",

            createdAt:
                supplier.createdAt ||
                now,

            updatedAt:
                now

        };


        const existingIndex =
            suppliers.findIndex(
                item =>
                    item.id ===
                    newSupplier.id
            );


        if (existingIndex >= 0) {

            suppliers[
                existingIndex
            ] = newSupplier;

        } else {

            suppliers.push(
                newSupplier
            );

        }


        setData(
            STORAGE_KEYS.suppliers,
            suppliers
        );


        return newSupplier;

    }


    function deleteSupplier(id) {

        const suppliers =
            getSuppliers();


        const filtered =
            suppliers.filter(
                supplier =>
                    supplier.id !== id
            );


        setData(
            STORAGE_KEYS.suppliers,
            filtered
        );


        return true;

    }


    function searchSuppliers(query) {

        const suppliers =
            getSuppliers();


        if (!query) {
            return suppliers;
        }


        const text =
            String(query)
                .trim()
                .toLowerCase();


        return suppliers.filter(
            supplier => {

                const searchable = [

                    supplier.companyName,

                    supplier.supplierName,

                    supplier.category,

                    supplier.city,

                    supplier.address,

                    supplier.phone,

                    supplier.mobile,

                    supplier.email,

                    supplier.website,

                    supplier.taxNumber,

                    supplier.commercialRegister,

                    ...(supplier.materials || [])

                ]
                    .join(" ")
                    .toLowerCase();


                return searchable.includes(
                    text
                );

            }
        );

    }


    /* =====================================================
       CONTACTS / PEOPLE
    ===================================================== */

    function getContacts() {

        return getData(
            STORAGE_KEYS.contacts
        );

    }


    function getContact(id) {

        const contacts =
            getContacts();


        return contacts.find(
            contact =>
                contact.id === id
        ) || null;

    }


    function saveContact(contact) {

        if (!contact) {
            return null;
        }


        const contacts =
            getContacts();


        const now =
            new Date().toISOString();


        const newContact = {

            id:
                contact.id ||
                generateId("CON"),

            supplierId:
                contact.supplierId ||
                "",

            companyName:
                contact.companyName ||
                "",

            name:
                contact.name ||
                "",

            jobTitle:
                contact.jobTitle ||
                "",

            department:
                contact.department ||
                "",

            phone:
                contact.phone ||
                "",

            mobile:
                contact.mobile ||
                "",

            whatsapp:
                contact.whatsapp ||
                "",

            email:
                contact.email ||
                "",

            notes:
                contact.notes ||
                "",

            createdAt:
                contact.createdAt ||
                now,

            updatedAt:
                now

        };


        const existingIndex =
            contacts.findIndex(
                item =>
                    item.id ===
                    newContact.id
            );


        if (existingIndex >= 0) {

            contacts[
                existingIndex
            ] = newContact;

        } else {

            contacts.push(
                newContact
            );

        }


        setData(
            STORAGE_KEYS.contacts,
            contacts
        );


        return newContact;

    }


    function deleteContact(id) {

        const contacts =
            getContacts();


        const filtered =
            contacts.filter(
                contact =>
                    contact.id !== id
            );


        setData(
            STORAGE_KEYS.contacts,
            filtered
        );


        return true;

    }


    function getSupplierContacts(
        supplierId
    ) {

        return getContacts().filter(
            contact =>
                contact.supplierId ===
                supplierId
        );

    }


    /* =====================================================
       MATERIALS
    ===================================================== */

    function getMaterials() {

        return getData(
            STORAGE_KEYS.materials
        );

    }


    function getMaterial(id) {

        const materials =
            getMaterials();


        return materials.find(
            material =>
                material.id === id
        ) || null;

    }


    function saveMaterial(material) {

        if (!material) {
            return null;
        }


        const materials =
            getMaterials();


        const now =
            new Date().toISOString();


        const newMaterial = {

            id:
                material.id ||
                generateId("MAT"),

            name:
                material.name ||
                "",

            englishName:
                material.englishName ||
                "",

            type:
                material.type ||
                "",

            category:
                material.category ||
                "",

            partNumber:
                material.partNumber ||
                "",

            brand:
                material.brand ||
                "",

            model:
                material.model ||
                "",

            material:
                material.material ||
                "",

            size:
                material.size ||
                "",

            pressure:
                material.pressure ||
                "",

            application:
                material.application ||
                "",

            specifications:
                material.specifications ||
                "",

            description:
                material.description ||
                "",

            image:
                material.image ||
                "",

            aliases:
                Array.isArray(
                    material.aliases
                )
                    ? material.aliases
                    : [],

            createdAt:
                material.createdAt ||
                now,

            updatedAt:
                now

        };


        const existingIndex =
            materials.findIndex(
                item =>
                    item.id ===
                    newMaterial.id
            );


        if (existingIndex >= 0) {

            materials[
                existingIndex
            ] = newMaterial;

        } else {

            materials.push(
                newMaterial
            );

        }


        setData(
            STORAGE_KEYS.materials,
            materials
        );


        return newMaterial;

    }


    function deleteMaterial(id) {

        const materials =
            getMaterials();


        const filtered =
            materials.filter(
                material =>
                    material.id !== id
            );


        setData(
            STORAGE_KEYS.materials,
            filtered
        );


        return true;

    }


    /* =====================================================
       MATERIAL SEARCH
    ===================================================== */

    function searchMaterials(query) {

        const materials =
            getMaterials();


        if (!query) {
            return materials;
        }


        const text =
            String(query)
                .trim()
                .toLowerCase();


        return materials.filter(
            material => {

                const searchable = [

                    material.name,

                    material.englishName,

                    material.type,

                    material.category,

                    material.partNumber,

                    material.brand,

                    material.model,

                    material.material,

                    material.size,

                    material.pressure,

                    material.application,

                    material.specifications,

                    material.description,

                    ...(material.aliases || [])

                ]
                    .join(" ")
                    .toLowerCase();


                return searchable.includes(
                    text
                );

            }
        );

    }


    /* =====================================================
       MATERIAL SEARCH HISTORY
    ===================================================== */

    function saveMaterialSearch(
        search
    ) {

        if (!search) {
            return null;
        }


        const searches =
            getData(
                STORAGE_KEYS.searches
            );


        const item = {

            id:
                generateId("SEARCH"),

            query:
                search.query ||
                "",

            name:
                search.name ||
                "",

            type:
                search.type ||
                "",

            partNumber:
                search.partNumber ||
                "",

            city:
                search.city ||
                "",

            image:
                search.image ||
                "",

            resultCount:
                Number(
                    search.resultCount || 0
                ),

            createdAt:
                new Date().toISOString()

        };


        searches.unshift(
            item
        );


        /* آخر 100 عملية بحث فقط */

        const limited =
            searches.slice(
                0,
                100
            );


        setData(
            STORAGE_KEYS.searches,
            limited
        );


        return item;

    }


    function getMaterialSearches() {

        return getData(
            STORAGE_KEYS.searches
        );

    }


    /* =====================================================
       CITY
    ===================================================== */

    function getArabicCity(city) {

        const cities = {

            Riyadh:
                "الرياض",

            Jeddah:
                "جدة",

            Dammam:
                "الدمام",

            Khobar:
                "الخبر",

            Makkah:
                "مكة",

            Madinah:
                "المدينة المنورة",

            Abha:
                "أبها",

            Tabuk:
                "تبوك",

            Qassim:
                "القصيم",

            Other:
                "أخرى"

        };


        return (
            cities[city] ||
            city ||
            ""
        );

    }


    /* =====================================================
       DATABASE EXPORT
    ===================================================== */

    function exportDatabase() {

        return {

            suppliers:
                getSuppliers(),

            contacts:
                getContacts(),

            materials:
                getMaterials(),

            searches:
                getMaterialSearches(),

            exportedAt:
                new Date().toISOString()

        };

    }


    /* =====================================================
       DATABASE IMPORT
    ===================================================== */

    function importDatabase(data) {

        if (!data) {
            return false;
        }


        if (
            Array.isArray(
                data.suppliers
            )
        ) {

            setData(
                STORAGE_KEYS.suppliers,
                data.suppliers
            );

        }


        if (
            Array.isArray(
                data.contacts
            )
        ) {

            setData(
                STORAGE_KEYS.contacts,
                data.contacts
            );

        }


        if (
            Array.isArray(
                data.materials
            )
        ) {

            setData(
                STORAGE_KEYS.materials,
                data.materials
            );

        }


        if (
            Array.isArray(
                data.searches
            )
        ) {

            setData(
                STORAGE_KEYS.searches,
                data.searches
            );

        }


        return true;

    }


    /* =====================================================
       CLEAR DATABASE
    ===================================================== */

    function clearDatabase() {

        localStorage.removeItem(
            STORAGE_KEYS.suppliers
        );

        localStorage.removeItem(
            STORAGE_KEYS.contacts
        );

        localStorage.removeItem(
            STORAGE_KEYS.materials
        );

        localStorage.removeItem(
            STORAGE_KEYS.searches
        );


        return true;

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.ProcureXStore = {

        /* Storage */

        getData,

        setData,

        generateId,

        /* Suppliers */

        getSuppliers,

        getSupplier,

        saveSupplier,

        deleteSupplier,

        searchSuppliers,

        /* Contacts */

        getContacts,

        getContact,

        saveContact,

        deleteContact,

        getSupplierContacts,

        /* Materials */

        getMaterials,

        getMaterial,

        saveMaterial,

        deleteMaterial,

        searchMaterials,

        /* Searches */

        saveMaterialSearch,

        getMaterialSearches,

        /* Helpers */

        getArabicCity,

        /* Database */

        exportDatabase,

        importDatabase,

        clearDatabase

    };


    console.log(
        "ProcureX Data Store Loaded Successfully."
    );

})();
