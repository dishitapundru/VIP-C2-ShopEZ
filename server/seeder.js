const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

connectDB();

const products = [
  // ── MOBILES ──
  {
    title: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    description: 'The most powerful iPhone ever, featuring A17 Pro chip, titanium design, and a 48MP main camera system. ProRes video, Action Button and USB 3 connectivity.',
    category: 'Mobiles', brand: 'Apple', gender: 'Unisex',
    price: 159900, discountPrice: 149900, stock: 60, ratings: 4.9, numReviews: 1450, isFeatured: true,
    features: ['A17 Pro chip', '48MP main camera', 'Titanium frame', 'USB-C with USB 3', 'ProRes video'],
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Samsung Galaxy S24 Ultra 256GB Titanium Black',
    description: 'Galaxy AI is here. Samsung S24 Ultra with built-in S Pen, 200MP camera, titanium frame and Snapdragon 8 Gen 3 processor.',
    category: 'Mobiles', brand: 'Samsung', gender: 'Unisex',
    price: 129999, discountPrice: 119999, stock: 75, ratings: 4.8, numReviews: 980, isFeatured: true,
    features: ['Snapdragon 8 Gen 3', '200MP quad camera', 'Built-in S Pen', '5000mAh battery', 'AI features'],
    images: ['https://images.unsplash.com/photo-1706016677898-21e1494eab1d?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'OnePlus 12 16GB/512GB Flowy Emerald',
    description: 'Snapdragon 8 Gen 3 powered flagship with Hasselblad cameras, 100W SUPERVOOC charging and 6.82" LTPO AMOLED display.',
    category: 'Mobiles', brand: 'OnePlus', gender: 'Unisex',
    price: 64999, discountPrice: 59999, stock: 90, ratings: 4.7, numReviews: 760,
    features: ['Snapdragon 8 Gen 3', 'Hasselblad camera', '100W fast charge', '5400mAh battery', '6.82" 120Hz'],
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Xiaomi 14 Pro 12GB/256GB Black',
    description: 'Leica Summilux optics, Snapdragon 8 Gen 3, and 120W HyperCharge in a ceramic body.',
    category: 'Mobiles', brand: 'Xiaomi', gender: 'Unisex',
    price: 74999, discountPrice: 69999, stock: 55, ratings: 4.6, numReviews: 430,
    features: ['Snapdragon 8 Gen 3', 'Leica Summilux lenses', '120W charging', 'IP68 rated'],
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80']
  },

  // ── LAPTOPS ──
  {
    title: 'Apple MacBook Air 15" M3 Chip 8GB/256GB Midnight',
    description: 'Supercharged by M3 chip. 15.3-inch Liquid Retina display, up to 18 hours battery, fanless design. The ultimate thin and light laptop.',
    category: 'Laptops', brand: 'Apple', gender: 'Unisex',
    price: 134900, discountPrice: 124900, stock: 30, ratings: 4.9, numReviews: 310, isFeatured: true,
    features: ['Apple M3 chip', '15.3" Liquid Retina', '18-hour battery', 'Fanless design', 'MagSafe charging'],
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1611186871525-5b02e4af84ee?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'ASUS ROG Strix G16 Gaming Laptop i9/32GB/1TB RTX 4080',
    description: 'Ultimate gaming laptop with Intel Core i9, 32GB DDR5, RTX 4080 16GB, 240Hz QHD display and per-key RGB.',
    category: 'Laptops', brand: 'ASUS', gender: 'Unisex',
    price: 249999, discountPrice: 229999, stock: 15, ratings: 4.8, numReviews: 185,
    features: ['Intel Core i9-14900HX', 'NVIDIA RTX 4080 16GB', '32GB DDR5', '240Hz QHD display', 'ROG Intelligent Cooling'],
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'HP Victus 16 Gaming Laptop i7/16GB/512GB RTX 4060',
    description: 'High-performance gaming laptop with 13th Gen Intel Core i7, RTX 4060 and 144Hz FHD display.',
    category: 'Laptops', brand: 'HP', gender: 'Unisex',
    price: 94999, discountPrice: 82999, stock: 40, ratings: 4.5, numReviews: 520,
    features: ['Intel Core i7-13700H', 'NVIDIA RTX 4060 8GB', '16GB DDR4', '144Hz FHD IPS display'],
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Lenovo ThinkPad X1 Carbon Gen 11 i7/16GB/512GB',
    description: 'Business ultrabook with 13th Gen Intel, military-grade durability, 2.8K OLED option and all-day battery.',
    category: 'Laptops', brand: 'Lenovo', gender: 'Unisex',
    price: 189900, discountPrice: 169900, stock: 20, ratings: 4.7, numReviews: 220,
    features: ['Intel Core i7-1365U', '16GB LPDDR5', '512GB SSD', 'MIL-SPEC tested', 'Up to 15 hours battery'],
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80']
  },

  // ── ELECTRONICS ──
  {
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation, 30-hour battery, multipoint connection and crystal-clear hands-free calling.',
    category: 'Electronics', brand: 'Sony', gender: 'Unisex',
    price: 34990, discountPrice: 29990, stock: 80, ratings: 4.8, numReviews: 1200, isFeatured: true,
    features: ['Industry-leading NC', '30-hour battery', 'Multipoint connection', 'Speak-to-chat', 'Touch controls'],
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'boAt Airdopes 141 True Wireless Earbuds',
    description: 'Premium TWS earbuds with 42 hours total playback, ENx tech for crystal-clear calls and IPX4 water resistance.',
    category: 'Electronics', brand: 'boAt', gender: 'Unisex',
    price: 1999, discountPrice: 1299, stock: 200, ratings: 4.3, numReviews: 8900,
    features: ['42H total playback', 'ENx tech for calls', 'IPX4 water resistant', 'Instant voice assistant', 'Low latency mode'],
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Samsung 55" The Frame QLED 4K Smart TV',
    description: 'A TV that becomes art when not in use. QLED 4K with Art Mode, customizable bezel and 100% Color Volume.',
    category: 'Electronics', brand: 'Samsung', gender: 'Unisex',
    price: 134900, discountPrice: 99900, stock: 25, ratings: 4.7, numReviews: 340,
    features: ['QLED 4K display', 'Art Mode', '100% Color Volume', 'Tizen OS', 'Q-Symphony'],
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Canon EOS R50 Mirrorless Camera with 18-45mm Kit',
    description: 'Compact APS-C mirrorless with 24.2MP sensor, 4K video, Dual Pixel CMOS AF II and content creator friendly.',
    category: 'Electronics', brand: 'Canon', gender: 'Unisex',
    price: 74995, discountPrice: 66995, stock: 35, ratings: 4.6, numReviews: 190,
    features: ['24.2MP APS-C sensor', '4K video', 'Dual Pixel CMOS AF II', 'Vertical video mode', 'Wi-Fi & Bluetooth'],
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80']
  },

  // ── WATCHES ──
  {
    title: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium',
    description: 'Smarter. Brighter. Mightier. Double tap gesture, brighter Always-On display and carbon neutral options.',
    category: 'Watches', brand: 'Apple', gender: 'Unisex',
    price: 44900, discountPrice: 41900, stock: 50, ratings: 4.9, numReviews: 870, isFeatured: true,
    features: ['S9 chip', 'Double tap gesture', '2000 nits brightness', 'Crash Detection', 'ECG app'],
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Noise ColorFit Pro 5 Smartwatch',
    description: 'Premium smartwatch with 1.85" AMOLED display, Bluetooth calling, health suite and 7-day battery.',
    category: 'Watches', brand: 'Noise', gender: 'Unisex',
    price: 5999, discountPrice: 2999, stock: 150, ratings: 4.2, numReviews: 3400,
    features: ['1.85" AMOLED', 'Bluetooth calling', '7-day battery', '100+ sports modes', 'SpO2 monitor'],
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Fossil Gen 6 Smartwatch 44mm Smoke Stainless Steel',
    description: 'Classic watch style meets smart tech. Wear OS, Snapdragon 4100+, rapid charging and always-on display.',
    category: 'Watches', brand: 'Fossil', gender: 'Men',
    price: 22995, discountPrice: 17995, stock: 40, ratings: 4.4, numReviews: 420,
    features: ['Wear OS by Google', 'Snapdragon 4100+', 'Rapid charging', 'Heart rate & SpO2', 'Always-on display'],
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80']
  },

  // ── FOOTWEAR / SHOES ──
  {
    title: 'Nike Air Max 270 React Men\'s Shoes',
    description: 'Inspired by the Air Max pantheon, the Air Max 270 React features the biggest heel Air unit yet for exceptional underfoot comfort.',
    category: 'Footwear', brand: 'Nike', gender: 'Men',
    price: 12995, discountPrice: 8999, stock: 85, ratings: 4.6, numReviews: 1100, isFeatured: true,
    features: ['Max Air 270 unit', 'React foam midsole', 'Engineered mesh upper', 'Rubber outsole'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Adidas Ultraboost 23 Women\'s Running Shoes',
    description: 'Ultimate comfort running shoe with BOOST midsole, Primeknit+ upper and Continental rubber outsole for grip.',
    category: 'Footwear', brand: 'Adidas', gender: 'Women',
    price: 17999, discountPrice: 12999, stock: 60, ratings: 4.7, numReviews: 830,
    features: ['BOOST midsole', 'Primeknit+ upper', 'Continental rubber outsole', 'Linear Energy Push'],
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Puma RS-X³ Cube Unisex Sneakers',
    description: 'Bold retro-running design with RS technology midsole, premium leather and mesh upper.',
    category: 'Footwear', brand: 'Puma', gender: 'Unisex',
    price: 8999, discountPrice: 6499, stock: 100, ratings: 4.3, numReviews: 560,
    features: ['RS technology midsole', 'Leather and mesh upper', 'Rubber outsole', 'Padded ankle collar'],
    images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Red Chief Men\'s Genuine Leather Oxford Shoes',
    description: 'Formal oxford shoes crafted from genuine leather with cushioned insole and durable TPR outsole.',
    category: 'Footwear', brand: 'Red Chief', gender: 'Men',
    price: 3995, discountPrice: 2995, stock: 120, ratings: 4.4, numReviews: 680,
    features: ['Genuine leather upper', 'Cushioned insole', 'TPR outsole', 'Classic Oxford style'],
    images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Crocs Classic Clog Unisex',
    description: 'Iconic comfort clog with Croslite foam construction, personalizable with Jibbitz charms.',
    category: 'Footwear', brand: 'Crocs', gender: 'Unisex',
    price: 3995, discountPrice: 2799, stock: 200, ratings: 4.5, numReviews: 2100,
    features: ['Croslite foam', 'Lightweight', 'Pivoting heel strap', 'Ventilation ports', 'Jibbitz compatible'],
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80']
  },

  // ── MEN'S FASHION ──
  {
    title: 'Allen Solly Men\'s Slim Fit Chino Trousers',
    description: 'Versatile slim fit chino trousers in cotton blend fabric. Perfect for smart-casual office wear.',
    category: "Men's Fashion", brand: 'Allen Solly', gender: 'Men',
    price: 2499, discountPrice: 1599, stock: 150, ratings: 4.3, numReviews: 780,
    features: ['Cotton blend', 'Slim fit', 'Smart-casual', 'Multiple colours'],
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'H&M Men\'s Regular Fit Oxford Shirt',
    description: 'Classic Oxford shirt in regular fit with button-down collar. Easy-care fabric.',
    category: "Men's Fashion", brand: 'H&M', gender: 'Men',
    price: 1499, discountPrice: 999, stock: 200, ratings: 4.2, numReviews: 1100,
    features: ['100% Cotton', 'Button-down collar', 'Regular fit', 'Easy-care fabric'],
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Peter England Men\'s Formal Blazer',
    description: 'Premium single-breasted blazer in poly-viscose blend. Perfect for formal and semi-formal occasions.',
    category: "Men's Fashion", brand: 'Peter England', gender: 'Men',
    price: 5999, discountPrice: 3999, stock: 60, ratings: 4.4, numReviews: 340,
    features: ['Poly-viscose blend', 'Single breasted', 'Notch lapel', 'Two-button closure'],
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Levi\'s 511 Men\'s Slim Fit Jeans',
    description: 'The iconic slim fit jean from Levi\'s. Sits below the waist with slim legs from hip to ankle.',
    category: "Men's Fashion", brand: "Levi's", gender: 'Men',
    price: 3299, discountPrice: 2299, stock: 180, ratings: 4.6, numReviews: 2300,
    features: ['Slim fit', '99% Cotton 1% Elastane', 'Mid-rise', 'Classic 5-pocket'],
    images: ['https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Puma Men\'s Graphic Hoodie',
    description: 'Fleece hoodie with bold graphic print, kangaroo pocket and adjustable drawstring hood.',
    category: "Men's Fashion", brand: 'Puma', gender: 'Men',
    price: 3499, discountPrice: 1999, stock: 120, ratings: 4.3, numReviews: 560,
    features: ['Fleece fabric', 'Graphic print', 'Kangaroo pocket', 'Drawstring hood'],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80']
  },

  // ── WOMEN'S FASHION ──
  {
    title: 'Zara Women\'s Satin Midi Dress',
    description: 'Flowy satin midi dress with V-neckline, adjustable spaghetti straps and side slit.',
    category: "Women's Fashion", brand: 'Zara', gender: 'Women',
    price: 3999, discountPrice: 2499, stock: 80, ratings: 4.5, numReviews: 890,
    features: ['Satin fabric', 'V-neckline', 'Adjustable straps', 'Side slit', 'Midi length'],
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'W Women\'s Anarkali Kurta Set',
    description: 'Beautiful floral print Anarkali kurta with palazzo pants and dupatta. Festive collection.',
    category: "Women's Fashion", brand: 'W', gender: 'Women',
    price: 3499, discountPrice: 2199, stock: 100, ratings: 4.4, numReviews: 670,
    features: ['Ethnic wear', 'Anarkali style', 'Includes dupatta', 'Festive collection', 'Cotton blend'],
    images: ['https://images.unsplash.com/photo-1604085449557-010531cd8d48?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'H&M Women\'s Ribbed Turtleneck Top',
    description: 'Slim-fit ribbed turtleneck in soft jersey fabric. A timeless wardrobe staple.',
    category: "Women's Fashion", brand: 'H&M', gender: 'Women',
    price: 999, discountPrice: 699, stock: 250, ratings: 4.3, numReviews: 1450,
    features: ['Ribbed jersey', 'Slim fit', 'Turtleneck', 'Long sleeves', 'Multiple colours'],
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Van Heusen Women\'s Formal Trousers',
    description: 'Straight-fit formal trousers in premium poly-viscose blend. Side pockets and invisible zip closure.',
    category: "Women's Fashion", brand: 'Van Heusen', gender: 'Women',
    price: 1999, discountPrice: 1299, stock: 130, ratings: 4.2, numReviews: 420,
    features: ['Poly-viscose blend', 'Straight fit', 'Side pockets', 'Formal wear'],
    images: ['https://images.unsplash.com/photo-1509631179647-0ca77331d053?auto=format&fit=crop&w=800&q=80']
  },

  // ── KIDS FASHION ──
  {
    title: 'H&M Kids Cotton Jogger Set (2-10 Years)',
    description: 'Soft cotton jogger set with printed sweatshirt and matching jogger pants. Perfect for everyday play.',
    category: "Kids Fashion", brand: 'H&M', gender: 'Kids',
    price: 1499, discountPrice: 999, stock: 180, ratings: 4.5, numReviews: 560,
    features: ['100% Organic cotton', 'Matching set', 'Elastic waistband', 'Machine washable'],
    images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'UCB Kids Denim Jacket (5-14 Years)',
    description: 'Classic denim jacket for kids with button closure, chest pockets and adjustable cuffs.',
    category: "Kids Fashion", brand: 'United Colors of Benetton', gender: 'Kids',
    price: 2499, discountPrice: 1499, stock: 90, ratings: 4.4, numReviews: 310,
    features: ['100% Cotton denim', 'Button closure', 'Chest pockets', 'Classic fit'],
    images: ['https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80']
  },

  // ── BEAUTY ──
  {
    title: 'Maybelline New York Fit Me Matte + Poreless Foundation',
    description: 'Lightweight foundation with oil control that minimizes pores for a natural matte look. Available in 40 shades.',
    category: 'Beauty', brand: 'Maybelline', gender: 'Women',
    price: 599, discountPrice: 399, stock: 300, ratings: 4.4, numReviews: 4500,
    features: ['40 shades', 'Oil control', 'Pore minimizing', 'Buildable coverage', 'Fragrance-free'],
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'L\'Oreal Paris Elvive Dream Lengths Shampoo 1L',
    description: 'Shampoo specially formulated for long damaged hair with Castor Oil and Vitamins B3 & B5.',
    category: 'Beauty', brand: "L'Oreal", gender: 'Women',
    price: 649, discountPrice: 449, stock: 250, ratings: 4.3, numReviews: 2100,
    features: ['For long hair', 'Castor oil formula', 'Vitamin B3 & B5', 'Sulfate-free', '1L value pack'],
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Himalaya Men\'s Active Fresh Neem Face Wash 150ml',
    description: 'Neem and turmeric face wash that fights acne-causing bacteria, reduces blackheads for clearer skin.',
    category: 'Beauty', brand: 'Himalaya', gender: 'Men',
    price: 199, discountPrice: 149, stock: 500, ratings: 4.3, numReviews: 5600,
    features: ['Neem & Turmeric', 'Anti-acne', 'Oil control', 'Dermatologically tested', 'SLS-free'],
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Minimalist 10% Niacinamide + Zinc Serum 30ml',
    description: 'High-strength niacinamide serum that reduces pore appearance, controls sebum and improves skin texture.',
    category: 'Beauty', brand: 'Minimalist', gender: 'Unisex',
    price: 699, discountPrice: 549, stock: 180, ratings: 4.6, numReviews: 3200,
    features: ['10% Niacinamide', 'Zinc PCA', 'Pore minimizing', 'Oil control', 'Fragrance-free'],
    images: ['https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?auto=format&fit=crop&w=800&q=80']
  },

  // ── HOME & KITCHEN ──
  {
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 5.7L',
    description: '7-in-1 multi-use appliance: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yoghurt maker and warmer.',
    category: 'Home & Kitchen', brand: 'Instant Pot', gender: 'Unisex',
    price: 12995, discountPrice: 9995, stock: 50, ratings: 4.7, numReviews: 1800,
    features: ['7-in-1 functions', '5.7L capacity', '14 smart programs', 'Stainless steel inner pot', 'Safety features'],
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Philips Air Fryer HD9270/90 XXL 7.3L',
    description: 'XXL capacity air fryer with Rapid Air technology, Fat Removal Technology and digital touch screen.',
    category: 'Home & Kitchen', brand: 'Philips', gender: 'Unisex',
    price: 19995, discountPrice: 14995, stock: 35, ratings: 4.6, numReviews: 920,
    features: ['7.3L XXL capacity', 'Fat removal tech', 'Digital touch screen', '90% less fat', 'Dishwasher safe'],
    images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Milton Thermosteel Flip Lid Flask 1000ml',
    description: 'Stainless steel vacuum flask that keeps beverages hot for 24 hours and cold for 12 hours.',
    category: 'Home & Kitchen', brand: 'Milton', gender: 'Unisex',
    price: 899, discountPrice: 599, stock: 300, ratings: 4.4, numReviews: 4300,
    features: ['304 stainless steel', '24H hot / 12H cold', 'Leak-proof flip lid', '1L capacity', 'BPA free'],
    images: ['https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80']
  },

  // ── GAMING ──
  {
    title: 'Sony PlayStation 5 Console',
    description: 'Next-gen gaming console with ultra-high-speed SSD, adaptive triggers, haptic feedback and 4K-TV gaming.',
    category: 'Gaming', brand: 'Sony', gender: 'Unisex',
    price: 54990, discountPrice: 49990, stock: 20, ratings: 4.9, numReviews: 2100, isFeatured: true,
    features: ['Ultra-HD Blu-ray', 'Ultra-high-speed SSD', 'Adaptive triggers', 'Haptic feedback', '4K gaming'],
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Razer BlackWidow V4 Mechanical Gaming Keyboard',
    description: 'Mechanical gaming keyboard with Razer Yellow switches, Chroma RGB, magnetic wrist rest and multi-function roller.',
    category: 'Gaming', brand: 'Razer', gender: 'Unisex',
    price: 15999, discountPrice: 12999, stock: 45, ratings: 4.7, numReviews: 380,
    features: ['Razer Yellow switches', 'Chroma RGB', 'Magnetic wrist rest', 'Multi-function roller', 'Dedicated macro keys'],
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Logitech G Pro X Superlight 2 Wireless Gaming Mouse',
    description: 'Ultra-lightweight wireless gaming mouse at just 60g, with HERO 2 25K sensor and LIGHTFORCE hybrid switches.',
    category: 'Gaming', brand: 'Logitech', gender: 'Unisex',
    price: 14995, discountPrice: 12495, stock: 60, ratings: 4.8, numReviews: 510,
    features: ['60g ultra-light', 'HERO 2 25K sensor', 'LIGHTFORCE switches', '95hr battery', 'LIGHTSPEED wireless'],
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80']
  },

  // ── BOOKS ──
  {
    title: 'Atomic Habits by James Clear (Paperback)',
    description: 'The #1 New York Times bestseller. A proven framework for improving every day using tiny changes that deliver remarkable results.',
    category: 'Books', brand: 'Penguin Random House', gender: 'Unisex',
    price: 499, discountPrice: 299, stock: 500, ratings: 4.8, numReviews: 12000,
    features: ['336 pages', 'Self-help / Habits', 'New York Times #1 bestseller', 'Practical frameworks'],
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'The Psychology of Money by Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money.',
    category: 'Books', brand: 'Jaico Publishing', gender: 'Unisex',
    price: 399, discountPrice: 249, stock: 400, ratings: 4.7, numReviews: 8500,
    features: ['256 pages', 'Personal finance', 'Bestseller', 'Easy read'],
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80']
  },

  // ── GROCERY ──
  {
    title: 'Tata Consumer Himalayan Natural Mineral Water 1L (Pack of 12)',
    description: 'Naturally sourced mineral water from the Himalayas. Rich in essential minerals, zero artificial additives.',
    category: 'Grocery', brand: 'Tata Consumer', gender: 'Unisex',
    price: 480, discountPrice: 380, stock: 500, ratings: 4.5, numReviews: 2800,
    features: ['12 x 1L bottles', 'Natural minerals', 'Zero artificial additives', 'BPA-free bottles'],
    images: ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Organic India Tulsi Green Tea 25 Bags',
    description: 'Certified organic green tea with holy basil (Tulsi). Rich in antioxidants, promotes immunity and stress relief.',
    category: 'Grocery', brand: 'Organic India', gender: 'Unisex',
    price: 249, discountPrice: 199, stock: 350, ratings: 4.4, numReviews: 1900,
    features: ['Certified organic', 'Holy Basil + Green Tea', 'Rich in antioxidants', '25 bags', 'Non-GMO'],
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80']
  }
];

const adminUser = {
    name: 'ShopEZ Admin',
    email: 'admin@shopez.com',
    password: 'Admin123',
    role: 'ADMIN'
};

const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany();
        console.log('✓ Products cleared');

        // Delete existing admin (if any) and recreate
        await User.deleteOne({ email: adminUser.email });
        await User.create(adminUser);
        console.log('✓ Admin user created → admin@shopez.com / Admin@123');

        await Product.insertMany(products);
        console.log(`✓ ${products.length} products seeded successfully!`);

        console.log('\n🚀 Database seeded! Run the server and open http://localhost:5000');
        process.exit(0);
    } catch (error) {
        console.error('✗ Seeder error:', error.message);
        process.exit(1);
    }
};

seedData();
