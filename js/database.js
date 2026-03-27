/**
 * Module: database.js
 * Purpose: Seed data + localStorage persistence for products/accounts/current user.
 * Main entry points: initApp(), persistProducts(), findProductById(), getCurrentUser().
 */
const initAccounts = [
    { username: 'admin123', password: '12', role: 'admin', name: 'Admin', email: 'admin@gunstore.com', phone: '0999999999', status: 'active' },
    { username: 'khach123', password: '12', role: 'customer', name: 'Khách VIP 1', email: 'khach123@gmail.com', phone: '0888888888', spent: 2150, status: 'active' }
];

const productStorageKey = 'productCatalog';
const productSeedVersionKey = 'productSeedVersion';
// Đổi version sang v3 để hệ thống tự động xóa data cũ và nạp data mới có dấu
const productSeedVersion = 'dngear-product-seed-v1';
const productFallbackImage = '../product-fallback.svg';
const forcedProductImageOverrides = {
    RING01: '../images/a1.png'
};

// BỘ DỮ LIỆU MỚI: Đầy đủ dấu, chuẩn thông tin, bao quát mọi chỉ mục
const defaultProductSeed = [
    // --- NHÓM SÚNG NGẮN ---
    {
        id: 'RING01', name: 'Nhẫn bạc đính đá Moissanite', category: 'nhan', subcategory: 'nhanbac',
        price: 1250000, stock: 15, ammo: 'Bạc 925', mag: 'Ni 7', acc: 'Đá Moissanite 6.5mm',
        img: '../images/a1.png',
        collection: 'Thanh lịch', tagline: 'Thiết kế tinh xảo, phù hợp đeo hằng ngày.', salePercent: 0, featured: true, searchTags: ['nhẫn bạc', 'moissanite', 'đính đá']
    },
    {
        id: 'RING02', name: 'Nhẫn vàng 18K sang trọng', category: 'nhan', subcategory: 'nhanvang',
        price: 2480000, stock: 20, ammo: 'Vàng 18K', mag: 'Ni 8', acc: 'Đính đá CZ cao cấp',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Nhan+Vang+18K',
        collection: 'Bán chạy', tagline: 'Kiểu dáng hiện đại, nổi bật và dễ phối đồ.', salePercent: 10, featured: true, searchTags: ['nhẫn vàng', '18k', 'cao cấp']
    },
    {
        id: 'RING03', name: 'Nhẫn Moissanite đính đá cao cấp', category: 'nhan', subcategory: 'nhanmoissanite',
        price: 2890000, stock: 12, ammo: 'Bạc 925 mạ vàng trắng', mag: 'Ni 6', acc: 'Moissanite trung tâm 8mm',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Nhan+Moissanite',
        collection: 'Cao cấp', tagline: 'Ánh sáng rực rỡ, phù hợp cho phong cách sang trọng.', salePercent: 0, featured: false, searchTags: ['moissanite', 'nhẫn cao cấp', 'đính đá']
    },
    {
        id: 'RING04', name: 'Nhẫn đá quý Ruby Premium', category: 'nhan', subcategory: 'nhandaquy',
        price: 3650000, stock: 8, ammo: 'Vàng trắng 14K', mag: 'Ni 7', acc: 'Đá Ruby thiên nhiên',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Nhan+Da+Quy',
        collection: 'Premium', tagline: 'Thiết kế nổi bật, tôn lên vẻ quý phái và đẳng cấp.', salePercent: 15, featured: true, searchTags: ['ruby', 'đá quý', 'premium']
    },

    // --- NHÓM LẮC TAY & MẶT DÂY ---
    {
        id: 'BRC01', name: 'Lắc tay bạc charm trái tim', category: 'lactay', subcategory: 'lactay',
        price: 1680000, stock: 10, ammo: 'Bạc 925', mag: '17cm', acc: 'Charm trái tim đính đá',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Lac+Tay+Bac',
        collection: 'Nữ tính', tagline: 'Thiết kế nhẹ nhàng, phù hợp làm quà tặng ý nghĩa.', salePercent: 0, featured: false, searchTags: ['lắc tay', 'bạc', 'charm']
    },
    {
        id: 'BRC02', name: 'Lắc tay vàng mảnh thanh lịch', category: 'lactay', subcategory: 'vongtay',
        price: 2190000, stock: 14, ammo: 'Vàng 14K', mag: '18cm', acc: 'Thiết kế tối giản cao cấp',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Lac+Tay+Vang',
        collection: 'Hiện đại', tagline: 'Phong cách thanh lịch, phù hợp nhiều dịp sử dụng.', salePercent: 12, featured: true, searchTags: ['lắc tay vàng', 'vòng tay', 'thanh lịch']
    },
    {
        id: 'PEN01', name: 'Mặt dây chuyền kim cương mini', category: 'daychuyen', subcategory: 'matday',
        price: 2950000, stock: 5, ammo: 'Vàng trắng 14K', mag: 'Mặt 12mm', acc: 'Đính đá CZ/Kim cương nhân tạo',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Mat+Day+Kim+Cuong',
        collection: 'Đính đá', tagline: 'Điểm nhấn nhỏ gọn nhưng sang trọng cho dây chuyền.', salePercent: 20, featured: true, searchTags: ['mặt dây', 'kim cương', 'dây chuyền']
    },

    // --- NHÓM DÂY CHUYỀN ---
    {
        id: 'NEC01', name: 'Dây chuyền bạc nữ cao cấp', category: 'daychuyen', subcategory: 'daychuyenbac',
        price: 1980000, stock: 9, ammo: 'Bạc 925', mag: '45cm', acc: 'Thiết kế thanh mảnh, khóa chắc chắn',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Day+Chuyen+Bac',
        collection: 'Thanh lịch', tagline: 'Mẫu dây chuyền tinh tế, dễ phối cùng nhiều phong cách.', salePercent: 0, featured: true, searchTags: ['dây chuyền bạc', 'nữ', 'cao cấp']
    },
    {
        id: 'EAR01', name: 'Bông tai bạc đính đá CZ', category: 'bongtai', subcategory: 'bongtai-dinhda',
        price: 950000, stock: 11, ammo: 'Bạc 925', mag: 'Free size', acc: 'Đá CZ cao cấp',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Bong+Tai+CZ',
        collection: 'Thanh lịch', tagline: 'Thiết kế nhỏ gọn, phù hợp đeo hằng ngày.', salePercent: 0, featured: false, searchTags: ['bông tai', 'cz', 'đính đá']
    },
    {
        id: 'EAR02', name: 'Bông tai ngọc trai cao cấp', category: 'bongtai', subcategory: 'bongtai-ngoctrai',
        price: 1350000, stock: 7, ammo: 'Bạc 925', mag: 'Free size', acc: 'Ngọc trai tự nhiên',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Bong+Tai+Ngoc+Trai',
        collection: 'Cổ điển', tagline: 'Vẻ đẹp tinh tế và sang trọng vượt thời gian.', salePercent: 15, featured: true, searchTags: ['ngọc trai', 'bông tai', 'cao cấp']
    },

    // --- NHÓM TRANG SỨC NAM ---
    {
        id: 'MEN01', name: 'Nhẫn nam bản lớn', category: 'trangsucnam', subcategory: 'nhannam',
        price: 1850000, stock: 4, ammo: 'Bạc 925', mag: 'Ni 9', acc: 'Thiết kế bản to, mạnh mẽ',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Nhan+Nam',
        collection: 'Nam tính', tagline: 'Phong cách mạnh mẽ, phù hợp quý ông hiện đại.', salePercent: 0, featured: false, searchTags: ['nhẫn nam', 'trang sức nam']
    },
    {
        id: 'MEN02', name: 'Dây chuyền nam phong cách minimal', category: 'trangsucnam', subcategory: 'daychuyennam',
        price: 2100000, stock: 3, ammo: 'Thép không gỉ cao cấp', mag: '50cm', acc: 'Thiết kế tối giản',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Day+Chuyen+Nam',
        collection: 'Hiện đại', tagline: 'Tối giản nhưng vẫn cực kỳ thu hút.', salePercent: 0, featured: false, searchTags: ['dây chuyền nam', 'minimal']
    },
    {
        id: 'MEN03', name: 'Lắc tay nam dây xích', category: 'trangsucnam', subcategory: 'lactaynam',
        price: 1650000, stock: 2, ammo: 'Thép titan', mag: '20cm', acc: 'Dây xích bản lớn',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Lac+Tay+Nam',
        collection: 'Cá tính', tagline: 'Phong cách streetwear mạnh mẽ.', salePercent: 5, featured: true, searchTags: ['lắc tay nam', 'dây xích']
    },

    // --- NHÓM TRANG SỨC CƯỚI ---
    {
        id: 'WED01', name: 'Nhẫn cưới vàng trắng', category: 'trangsuccuoi', subcategory: 'nhancuoi',
        price: 5200000, stock: 5, ammo: 'Vàng trắng 14K', mag: 'Ni 7 / Ni 9', acc: 'Khắc tên theo yêu cầu',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Nhan+Cuoi',
        collection: 'Wedding', tagline: 'Biểu tượng cho tình yêu bền lâu.', salePercent: 0, featured: true, searchTags: ['nhẫn cưới']
    },
    {
        id: 'WED02', name: 'Nhẫn cặp đôi bạc', category: 'trangsuccuoi', subcategory: 'nhancapdoi',
        price: 2890000, stock: 6, ammo: 'Bạc 925', mag: 'Cặp size', acc: 'Khắc chữ miễn phí',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Nhan+Cap+Doi',
        collection: 'Couple', tagline: 'Món quà ý nghĩa cho cặp đôi.', salePercent: 0, featured: false, searchTags: ['cặp đôi']
    },
    {
        id: 'WED03', name: 'Set quà trang sức cao cấp', category: 'trangsuccuoi', subcategory: 'quatang',
        price: 3500000, stock: 1, ammo: 'Vàng + đá CZ', mag: 'Full set', acc: 'Hộp quà cao cấp',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Set+Trang+Suc',
        collection: 'Quà tặng', tagline: 'Phù hợp làm quà cho dịp đặc biệt.', salePercent: 0, featured: false, searchTags: ['quà tặng']
    },

    // --- NHÓM PHỤ KIỆN & TRANG SỨC CƯỚI ---
    {
        id: 'ACC01', name: 'Hộp trang sức cao cấp', category: 'phukien', subcategory: 'hoptrangsuc',
        price: 120000, stock: 150, ammo: 'Da PU cao cấp', mag: '-', acc: 'Lót nhung mềm, 1 ngăn lớn',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Hop+Trang+Suc',
        collection: 'Phụ kiện', tagline: 'Giữ trang sức an toàn và sang trọng khi trưng bày.', salePercent: 5, featured: false, searchTags: ['hộp trang sức', 'hộp quà', 'bảo quản']
    },
    {
        id: 'WED04', name: 'Set nhẫn cưới vàng trắng', category: 'trangsuccuoi', subcategory: 'nhancuoi',
        price: 6250000, stock: 35, ammo: 'Vàng trắng 14K', mag: 'Ni 6 / Ni 8', acc: 'Khắc tên miễn phí',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Set+Nhan+Cuoi',
        collection: 'Cưới hỏi', tagline: 'Biểu tượng trọn đời cho tình yêu và sự gắn kết.', salePercent: 0, featured: false, searchTags: ['nhẫn cưới', 'set cưới', 'vàng trắng']
    },
    {
        id: 'ACC02', name: 'Khăn lau trang sức chuyên dụng', category: 'phukien', subcategory: 'khanlau',
        price: 80000, stock: 40, ammo: 'Vải microfiber', mag: '-', acc: 'Làm sạch bề mặt bạc, vàng và đá',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Khan+Lau+Trang+Suc',
        collection: 'Chăm sóc', tagline: 'Giúp trang sức luôn sáng bóng và sạch đẹp.', salePercent: 10, featured: false, searchTags: ['khăn lau', 'vệ sinh trang sức', 'phụ kiện']
    }
];

let currentSelectedProduct = null;
let dbProducts = [];

// Keep search tags in a stable lowercase array format for filtering.
function normalizeSearchTags(value) {
    if (Array.isArray(value)) {
        return value.map(item => String(item || '').trim().toLowerCase()).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value.split(',').map(item => item.trim().toLowerCase()).filter(Boolean);
    }
    return [];
}

// Normalize every product before render/save so downstream modules can trust the schema.
function normalizeProduct(product, fallback = {}) {
    const merged = { ...fallback, ...product };
    const price = Number(merged.price);
    const stock = Number(merged.stock);
    const salePercent = Number(merged.salePercent);

    return {
        id: String(merged.id || '').trim().toUpperCase(),
        name: String(merged.name || 'Sản phẩm mới').trim(),
        category: String(merged.category || 'phukien').trim().toLowerCase(),
        subcategory: String(merged.subcategory || merged.category || 'phukien').trim().toLowerCase(),
        price: Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0,
        stock: Number.isFinite(stock) ? Math.max(0, Math.round(stock)) : 0,
        ammo: String(merged.ammo || '').trim(),
        mag: String(merged.mag || '').trim(),
        acc: String(merged.acc || '').trim(),
        img: String(merged.img || productFallbackImage).trim() || productFallbackImage,
        collection: String(merged.collection || 'Hàng mới về').trim(),
        tagline: String(merged.tagline || 'Sản phẩm đang được cập nhật thông tin.').trim(),
        salePercent: Number.isFinite(salePercent) ? Math.max(0, Math.min(95, Math.round(salePercent))) : 0,
        featured: Boolean(merged.featured),
        searchTags: normalizeSearchTags(merged.searchTags),
        createdAt: merged.createdAt || new Date().toISOString()
    };
}

function sanitizeStoredProducts(products) {
    return (Array.isArray(products) ? products : [])
        .map(item => normalizeProduct(item))
        .filter(item => item.id);
}

// Hydrate from localStorage, apply seed version strategy, and expose dbProducts in-memory.
function hydrateProductCatalog() {
    let storedProducts = sanitizeStoredProducts(JSON.parse(localStorage.getItem(productStorageKey)) || []);
    const seededProducts = defaultProductSeed.map(item => normalizeProduct(item, item));

    // Thuật toán "Xóa đi làm lại": Nếu rỗng hoặc khác version, ta ép lấy thẳng bộ Seed mới để làm sạch rác
    if (storedProducts.length === 0 || localStorage.getItem(productSeedVersionKey) !== productSeedVersion) {
        storedProducts = seededProducts;
        localStorage.setItem(productSeedVersionKey, productSeedVersion);
    }

    storedProducts = storedProducts.map(product => {
        const forcedImage = forcedProductImageOverrides[product.id];
        if (!forcedImage) return product;
        return {
            ...product,
            img: forcedImage
        };
    });

    // Sắp xếp ưu tiên hàng nổi bật lên đầu, sau đó theo tên A-Z
    const nextProducts = storedProducts.sort((left, right) => {
        const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
        if (featuredDelta !== 0) return featuredDelta;
        return left.name.localeCompare(right.name, 'vi');
    });

    dbProducts.splice(0, dbProducts.length, ...nextProducts);
    localStorage.setItem(productStorageKey, JSON.stringify(dbProducts));
}

// Single save gateway for catalog writes.
function persistProducts(nextProducts = dbProducts) {
    const normalizedProducts = sanitizeStoredProducts(nextProducts);
    dbProducts.splice(0, dbProducts.length, ...normalizedProducts);
    localStorage.setItem(productStorageKey, JSON.stringify(dbProducts));
    return dbProducts;
}

// Shared auth state helpers used across app/cart/orders/profile.
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch (error) {
        return null;
    }
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUserCartKey() {
    const currentUser = getCurrentUser();
    if (!currentUser) return 'cart:guest';
    return `cart:${currentUser.email || currentUser.username || currentUser.name || 'guest'}`;
}

function initAccountsData() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!Array.isArray(users) || users.length === 0) {
        users = [...initAccounts];
    } else {
        initAccounts.forEach(seedAccount => {
            const existingIndex = users.findIndex(user => user.username === seedAccount.username || user.email === seedAccount.email);
            if (existingIndex > -1) {
                users[existingIndex] = {
                    ...users[existingIndex],
                    ...seedAccount
                };
            } else {
                users.push(seedAccount);
            }
        });
    }
    localStorage.setItem('users', JSON.stringify(users));
}

function initApp() {
    initAccountsData();
    hydrateProductCatalog();
}

window.persistProducts = persistProducts;
window.getCurrentUser = getCurrentUser;
window.saveCurrentUser = saveCurrentUser;
window.getCurrentUserCartKey = getCurrentUserCartKey;
window.productFallbackImage = productFallbackImage;
window.findProductById = function (id) {
    return dbProducts.find(product => product.id === id) || null;
};

initApp();

function normalizeProduct(product, fallback = {}) {
    const merged = { ...fallback, ...product };
    const price = Number(merged.price);
    const stock = Number(merged.stock);
    const salePercent = Number(merged.salePercent);

    return {
        id: String(merged.id || '').trim().toUpperCase(),
        name: String(merged.name || 'Sản phẩm mới').trim(),
        category: String(merged.category || 'phukien').trim().toLowerCase(),
        subcategory: String(merged.subcategory || merged.category || 'phukien').trim().toLowerCase(),
        price: Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0,
        stock: Number.isFinite(stock) ? Math.max(0, Math.round(stock)) : 0,
        ammo: String(merged.ammo || '').trim(),
        mag: String(merged.mag || '').trim(),
        acc: String(merged.acc || '').trim(),
        img: String(merged.img || productFallbackImage).trim() || productFallbackImage,
        collection: String(merged.collection || 'Hàng mới về').trim(),
        tagline: String(merged.tagline || 'Sản phẩm đang được cập nhật thông tin.').trim(),
        salePercent: Number.isFinite(salePercent) ? Math.max(0, Math.min(95, Math.round(salePercent))) : 0,
        featured: Boolean(merged.featured),
        supplierId: String(merged.supplierId || '').trim(), // ĐÃ BỔ SUNG TRƯỜNG NÀY ĐỂ KHÔNG BỊ MẤT DỮ LIỆU
        searchTags: normalizeSearchTags(merged.searchTags),
        createdAt: merged.createdAt || new Date().toISOString()
    };
}
