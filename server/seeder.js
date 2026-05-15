const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
  {
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry leading noise canceling with two processors and 8 microphones. Magnificent sound, engineered to perfection with the new Integrated Processor V1.',
    category: 'Electronics',
    brand: 'Sony',
    price: 34990,
    discountPrice: 29990,
    stock: 45,
    ratings: 4.8,
    numReviews: 320,
    features: ['Industry leading noise cancellation', '30-hour battery life', 'Multipoint connection', 'Touch sensor controls'],
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Apple iPhone 15 Pro Max',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    category: 'Mobiles',
    brand: 'Apple',
    price: 159900,
    discountPrice: 149900,
    stock: 120,
    ratings: 4.9,
    numReviews: 1250,
    features: ['Titanium design', 'A17 Pro chip', '48MP Main camera', 'USB-C with USB 3'],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Nike Air Max 270',
    description: 'Nike\'s first lifestyle Air Max brings you style, comfort and big attitude. The design draws inspiration from Air Max icons, showcasing Nike\'s greatest innovation with its large window and fresh array of colors.',
    category: 'Shoes',
    brand: 'Nike',
    price: 12995,
    discountPrice: 8999,
    stock: 85,
    ratings: 4.6,
    numReviews: 840,
    features: ['Max Air 270 unit delivers unrivaled comfort', 'Woven and synthetic fabric on the upper', 'Foam midsole feels soft and comfortable', 'Rubber on the outsole adds traction and durability'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Rolex Submariner Date',
    description: 'The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic and a black dial with large luminescent hour markers.',
    category: 'Watches',
    brand: 'Rolex',
    price: 950000,
    discountPrice: null,
    stock: 5,
    ratings: 5.0,
    numReviews: 45,
    features: ['Oystersteel', 'Unidirectional rotatable bezel', 'Waterproof to 300 metres', 'Perpetual, mechanical, self-winding calibre 3235'],
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Samsung 49" Odyssey G9 Gaming Monitor',
    description: '49 inch 1000R curved gaming monitor with Dual QHD resolution, 240Hz refresh rate, and 1ms response time.',
    category: 'Gaming',
    brand: 'Samsung',
    price: 129999,
    discountPrice: 114999,
    stock: 12,
    ratings: 4.7,
    numReviews: 310,
    features: ['1000R Curved Screen', '240Hz Refresh Rate', '1ms Response Time', 'QLED Technology', 'G-Sync Compatible'],
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552831388-6a0b3575b32a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Dyson V15 Detect Cordless Vacuum',
    description: 'The most powerful, intelligent cordless vacuum. Reveals invisible dust. Counts and measures the size of dust particles.',
    category: 'Home & Kitchen',
    brand: 'Dyson',
    price: 65900,
    discountPrice: 59900,
    stock: 30,
    ratings: 4.8,
    numReviews: 890,
    features: ['Laser reveals microscopic dust', 'Piezo sensor continuously sizes and counts dust particles', 'Powerful Dyson Hyperdymium motor', 'Up to 60 minutes of run time'],
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'MacBook Air M3',
    description: 'Supercharged by M3, the MacBook Air features an incredibly thin design, brilliant Liquid Retina display, and up to 18 hours of battery life.',
    category: 'Laptops',
    brand: 'Apple',
    price: 114900,
    discountPrice: 104900,
    stock: 20,
    ratings: 4.9,
    numReviews: 150,
    features: ['Apple M3 chip', '8-core CPU', '10-core GPU', '8GB Unified Memory', '256GB SSD Storage'],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Chanel No.5 Eau de Parfum',
    description: 'The classic fragrance from Chanel. A highly complex blend of aldehydes and floral notes.',
    category: 'Beauty',
    brand: 'Chanel',
    price: 14500,
    discountPrice: null,
    stock: 50,
    ratings: 4.8,
    numReviews: 2300,
    features: ['Eau de Parfum spray', 'Floral-aldehydic bouquet', 'Iconic minimalist bottle', 'Long-lasting fragrance'],
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Premium Data Imported with INR Pricing!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
