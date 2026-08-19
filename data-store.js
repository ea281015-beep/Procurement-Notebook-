
/* =========================================================
   ABDULLAH PROCUREMENT ASSISTANT
   Data.Store.js
   Local data storage layer
   ========================================================= */

(function () {
    "use strict";

    const STORAGE_KEYS = {
        materials: "abdullah_procurement_materials",
        suppliers: "abdullah_procurement_suppliers",
        reminders: "abdullah_procurement_reminders",
        searches: "abdullah_procurement_searches",
        settings: "abdullah_procurement_settings"
    };

    /* =====================================================
       BASIC STORAGE
    ===================================================== */

    function read(key, fallback = []) {
        try {
            const value = localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            return JSON.parse(value);
        } catch (error) {
            console.error("Data.Store read error:", error);
            return fallback;
        }
    }

    function write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Data.Store write error:", error);
            return false;
        }
    }

    function generateId(prefix = "ID") {
        return (
            prefix +
            "-" +
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).substring(2, 8)
        ).toUpperCase();
    }

    function now() {
        return new Date().toISOString();
    }

    /* =====================================================
       MATERIALS
       أي مادة: طرق، إنشاءات، كهرباء، ميكانيكا،
       هيدروليك، خامات، قطع غيار... إلخ
       ===================================================== */

    function getMaterials() {
        return read(STORAGE_KEYS.materials, []);
    }

    function getMaterial(id) {
        return getMaterials().find(item => item.id === id) || null;
    }

    function saveMaterial(material) {
        const materials = getMaterials();

        const newMaterial = {
            id: material.id || generateId("MAT"),
            name: material.name || "",
            category: material.category || "",
            type: material.type || "",
            partNumber: material.partNumber || "",
            brand: material.brand || "",
            model: material.model || "",
            specification: material.specification || "",
            unit: material.unit || "",
            application: material.application || "",
            city: material.city || "",
            image: material.image || "",
            notes: material.notes || "",
            source: material.source || "manual",
            createdAt: material.createdAt || now(),
            updatedAt: now()
        };

        const existingIndex = materials.findIndex(
            item => item.id === newMaterial.id
        );

        if (existingIndex >= 0) {
            materials[existingIndex] = newMaterial;
        } else {
            materials.unshift(newMaterial);
        }

        write(STORAGE_KEYS.materials, materials);

        return newMaterial;
    }

    function updateMaterial(id, changes) {
        const materials = getMaterials();

        const index = materials.findIndex(item => item.id === id);

        if (index === -1) {
            return null;
        }

        materials[index] = {
            ...materials[index],
            ...changes,
            id,
            updatedAt: now()
        };

        write(STORAGE_KEYS.materials, materials);

        return materials[index];
    }

    function deleteMaterial(id) {
        const materials = getMaterials();

        const filtered = materials.filter(item => item.id !== id);

        write(STORAGE_KEYS.materials, filtered);

        return filtered.length !== materials.length;
    }

    function searchMaterials(query) {
        const materials = getMaterials();

        const text = String(query || "")
            .trim()
            .toLowerCase();

        if (!text) {
            return materials;
        }

        return materials.filter(material => {
            const searchable = [
                material.name,
                material.category,
                material.type,
                material.partNumber,
                material.brand,
                material.model,
                material.specification,
                material.unit,
                material.application,
                material.city,
                material.notes
            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(text);
        });
    }

    /* =====================================================
       SUPPLIERS
       ===================================================== */

    function getSuppliers() {
        return read(STORAGE_KEYS.suppliers, []);
    }

    function getSupplier(id) {
        return getSuppliers().find(item => item.id === id) || null;
    }

    function saveSupplier(supplier) {
        const suppliers = getSuppliers();

        const newSupplier = {
            id: supplier.id || generateId("SUP"),
            name: supplier.name || "",
            companyName: supplier.companyName || supplier.name || "",
            category: supplier.category || "",
            materials: Array.isArray(supplier.materials)
                ? supplier.materials
                : [],
            city: supplier.city || "",
            district: supplier.district || "",
            address: supplier.address || "",
            phone: supplier.phone || "",
            mobile: supplier.mobile || "",
            email: supplier.email || "",
            website: supplier.website || "",
            googleMaps: supplier.googleMaps || "",
            contactPerson: supplier.contactPerson || "",
            rating: supplier.rating || "",
            verified: Boolean(supplier.verified),
            source: supplier.source || "manual",
            notes: supplier.notes || "",
            createdAt: supplier.createdAt || now(),
            updatedAt: now()
        };

        const existingIndex = suppliers.findIndex(
            item => item.id === newSupplier.id
        );

        if (existingIndex >= 0) {
            suppliers[existingIndex] = newSupplier;
        } else {
            suppliers.unshift(newSupplier);
        }

        write(STORAGE_KEYS.suppliers, suppliers);

        return newSupplier;
    }

    function updateSupplier(id, changes) {
        const suppliers = getSuppliers();

        const index = suppliers.findIndex(item => item.id === id);

        if (index === -1) {
            return null;
        }

        suppliers[index] = {
            ...suppliers[index],
            ...changes,
            id,
            updatedAt: now()
        };

        write(STORAGE_KEYS.suppliers, suppliers);

        return suppliers[index];
    }

    function deleteSupplier(id) {
        const suppliers = getSuppliers();

        const filtered = suppliers.filter(item => item.id !== id);

        write(STORAGE_KEYS.suppliers, filtered);

        return filtered.length !== suppliers.length;
    }

    function searchSuppliers(query, city = "") {
        const suppliers = getSuppliers();

        const text = String(query || "")
            .trim()
            .toLowerCase();

        const selectedCity = String(city || "")
            .trim()
            .toLowerCase();

        return suppliers.filter(supplier => {
            const searchable = [
                supplier.name,
                supplier.companyName,
                supplier.category,
                ...(supplier.materials || []),
                supplier.city,
                supplier.district,
                supplier.address,
                supplier.contactPerson,
                supplier.notes
            ]
                .join(" ")
                .toLowerCase();

            const matchesText =
                !text || searchable.includes(text);

            const matchesCity =
                !selectedCity ||
                String(supplier.city || "")
                    .toLowerCase()
                    .includes(selectedCity);

            return matchesText && matchesCity;
        });
    }

    /* =====================================================
       SEARCH HISTORY
       ===================================================== */

    function getSearches() {
        return read(STORAGE_KEYS.searches, []);
    }

    function saveSearch(search) {
        const searches = getSearches();

        const item = {
            id: generateId("SEARCH"),
            query: search.query || "",
            type: search.type || "general",
            city: search.city || "",
            resultsCount: Number(search.resultsCount || 0),
            source: search.source || "external",
            createdAt: now()
        };

        searches.unshift(item);

        /*
         * نحتفظ بآخر 100 عملية بحث فقط
         */
        const limited = searches.slice(0, 100);

        write(STORAGE_KEYS.searches, limited);

        return item;
    }

    function clearSearchHistory() {
        write(STORAGE_KEYS.searches, []);
        return true;
    }

    /* =====================================================
       REMINDERS
       ===================================================== */

    function getReminders() {
        return read(STORAGE_KEYS.reminders, []);
    }

    function getReminder(id) {
        return getReminders().find(item => item.id === id) || null;
    }

    function saveReminder(reminder) {
        const reminders = getReminders();

        const item = {
            id: reminder.id || generateId("REM"),
            title: reminder.title || "",
            description: reminder.description || "",
            date: reminder.date || "",
            time: reminder.time || "",
            type: reminder.type || "general",
            relatedMaterialId: reminder.relatedMaterialId || "",
            relatedSupplierId: reminder.relatedSupplierId || "",
            completed: Boolean(reminder.completed),
            notified: Boolean(reminder.notified),
            createdAt: reminder.createdAt || now(),
            updatedAt: now()
        };

        const existingIndex = reminders.findIndex(
            reminderItem => reminderItem.id === item.id
        );

        if (existingIndex >= 0) {
            reminders[existingIndex] = item;
        } else {
            reminders.unshift(item);
        }

        write(STORAGE_KEYS.reminders, reminders);

        return item;
    }

    function updateReminder(id, changes) {
        const reminders = getReminders();

        const index = reminders.findIndex(item => item.id === id);

        if (index === -1) {
            return null;
        }

        reminders[index] = {
            ...reminders[index],
            ...changes,
            id,
            updatedAt: now()
        };

        write(STORAGE_KEYS.reminders, reminders);

        return reminders[index];
    }

    function deleteReminder(id) {
        const reminders = getReminders();

        const filtered = reminders.filter(item => item.id !== id);

        write(STORAGE_KEYS.reminders, filtered);

        return filtered.length !== reminders.length;
    }

    function getPendingReminders() {
        return getReminders().filter(item => !item.completed);
    }

    /* =====================================================
       SETTINGS
       ===================================================== */

    const DEFAULT_SETTINGS = {
        assistantName: "مساعد عبدالله",
        userName: "عبدالله الشحات",
        language: "ar",
        voiceEnabled: true,
        notificationsEnabled: true
    };

    function getSettings() {
        return {
            ...DEFAULT_SETTINGS,
            ...read(STORAGE_KEYS.settings, {})
        };
    }

    function updateSettings(changes) {
        const settings = {
            ...getSettings(),
            ...changes
        };

        write(STORAGE_KEYS.settings, settings);

        return settings;
    }

    /* =====================================================
       DATABASE SUMMARY
       ===================================================== */

    function getSummary() {
        return {
            materials: getMaterials().length,
            suppliers: getSuppliers().length,
            reminders: getReminders().length,
            pendingReminders: getPendingReminders().length,
            searches: getSearches().length
        };
    }

    /* =====================================================
       EXPORT / IMPORT
       ===================================================== */

    function exportAllData() {
        return {
            version: "1.0.0",
            exportedAt: now(),
            materials: getMaterials(),
            suppliers: getSuppliers(),
            reminders: getReminders(),
            searches: getSearches(),
            settings: getSettings()
        };
    }

    function importAllData(data) {
        if (!data || typeof data !== "object") {
            return false;
        }

        if (Array.isArray(data.materials)) {
            write(STORAGE_KEYS.materials, data.materials);
        }

        if (Array.isArray(data.suppliers)) {
            write(STORAGE_KEYS.suppliers, data.suppliers);
        }

        if (Array.isArray(data.reminders)) {
            write(STORAGE_KEYS.reminders, data.reminders);
        }

        if (Array.isArray(data.searches)) {
            write(STORAGE_KEYS.searches, data.searches);
        }

        if (data.settings && typeof data.settings === "object") {
            write(STORAGE_KEYS.settings, data.settings);
        }

        return true;
    }

    function clearAllData() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });

        return true;
    }

    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ProcurementStore = {

        // Storage
        read,
        write,
        generateId,

        // Materials
        getMaterials,
        getMaterial,
        saveMaterial,
        updateMaterial,
        deleteMaterial,
        searchMaterials,

        // Suppliers
        getSuppliers,
        getSupplier,
        saveSupplier,
        updateSupplier,
        deleteSupplier,
        searchSuppliers,

        // Search
        getSearches,
        saveSearch,
        clearSearchHistory,

        // Reminders
        getReminders,
        getReminder,
        saveReminder,
        updateReminder,
        deleteReminder,
        getPendingReminders,

        // Settings
        getSettings,
        updateSettings,

        // General
        getSummary,

        // Backup
        exportAllData,
        importAllData,
        clearAllData,

        // Storage keys
        keys: STORAGE_KEYS
    };

    console.log("✅ ProcurementStore loaded successfully.");

})();
