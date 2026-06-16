const Product = require('../models/Product');

// Smart keyword-to-intent mapper
const detectIntent = (message) => {
  const msg = message.toLowerCase();
  if (/gaming|laptop|macbook|asus rog|hp victus/i.test(msg)) return 'laptops';
  if (/phone|mobile|smartphone|iphone|samsung|oneplus/i.test(msg)) return 'mobiles';
  if (/shoe|sneaker|nike|adidas|boot|footwear/i.test(msg)) return 'shoes';
  if (/watch|smartwatch|apple watch|noise|boat/i.test(msg)) return 'watches';
  if (/headphone|earphone|audio|sound|speaker|boat|sony/i.test(msg)) return 'electronics';
  if (/trending|popular|best seller|top/i.test(msg)) return 'trending';
  if (/cheap|budget|affordable|under/i.test(msg)) return 'budget';
  if (/offer|discount|sale|deal|coupon/i.test(msg)) return 'offers';
  if (/order|track|status|delivery status/i.test(msg)) return 'order';
  if (/deliver|shipping|ship|days/i.test(msg)) return 'delivery';
  if (/return|refund|exchange|policy/i.test(msg)) return 'return';
  if (/cart|bag|added/i.test(msg)) return 'cart';
  if (/hi|hello|hey|start|help/i.test(msg)) return 'greet';
  if (/bye|thank|thanks|ok/i.test(msg)) return 'bye';
  return 'unknown';
};

const staticReplies = {
  order: {
    text: "📦 To track your order, please login to your account and go to your **Order History**. You'll find real-time status updates there. Need anything else?",
    products: []
  },
  delivery: {
    text: "🚚 ShopEZ delivers across India!\n\n• **Standard Delivery**: 3-5 business days\n• **Express Delivery**: 1-2 business days\n• **Free Shipping** on orders above ₹2,000\n• COD available on all orders",
    products: []
  },
  return: {
    text: "🔄 Our return policy is super easy!\n\n• **30-day** no-questions-asked return\n• Free pickup from your doorstep\n• Refund within **5-7 business days**\n• Exchange available for size/color issues\n\nJust go to **My Orders** to initiate a return.",
    products: []
  },
  cart: {
    text: "🛒 To manage your cart:\n\n• Click the **Cart icon** in the top navbar\n• Update quantities or remove items\n• Apply coupon codes at checkout\n• **Free delivery** on orders over ₹2,000!\n\nShall I suggest some great products to add?",
    products: []
  },
  offers: {
    text: "🎉 Here are today's best deals on ShopEZ!\n\nAll discounted products are marked with a **% OFF** badge. I've fetched some discounted picks for you below! 👇",
    fetchType: 'offers'
  },
  greet: {
    text: "👋 Hey there! Welcome to **ShopEZ**!\n\nI'm your personal AI shopping assistant. I can help you with:\n\n🔍 **Find Products** — phones, laptops, shoes & more\n💸 **Best Deals** — current offers & discounts\n📦 **Order Help** — tracking & status\n🔄 **Returns** — easy return policy\n\nWhat are you looking for today?",
    products: []
  },
  bye: {
    text: "😊 Thanks for shopping with **ShopEZ**! Have a great day! Feel free to ask if you need anything. Happy shopping! 🛍️",
    products: []
  },
  unknown: {
    text: "🤔 I'm not sure about that, but I can help you with:\n\n• 🔍 Product search (phones, laptops, shoes, etc.)\n• 💰 Best offers & deals\n• 📦 Order tracking\n• 🚚 Delivery info\n• 🔄 Return policy\n\nTry asking: *\"Show me best laptops\"* or *\"What are trending products?\"*",
    products: []
  }
};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const intent = detectIntent(message);

    // Category-based product search
    const categoryMap = {
      laptops: 'Laptops',
      mobiles: 'Mobiles',
      shoes: 'Shoes',
      watches: 'Watches',
      electronics: 'Electronics'
    };

    if (categoryMap[intent]) {
      const products = await Product.find({ category: categoryMap[intent] }).limit(4);
      const categoryName = categoryMap[intent];
      return res.json({
        success: true,
        reply: {
          text: `🛍️ Here are our top **${categoryName}** picks for you! Tap any product to view details and add to cart.`,
          products: products.map(p => ({
            _id: p._id,
            title: p.title,
            image: p.images[0],
            price: p.price,
            discountPrice: p.discountPrice,
            ratings: p.ratings,
            category: p.category
          }))
        }
      });
    }

    // Trending = top rated
    if (intent === 'trending') {
      const products = await Product.find().sort({ ratings: -1 }).limit(4);
      return res.json({
        success: true,
        reply: {
          text: "🔥 These are our **Trending Products** right now — loved by thousands of ShopEZ customers!",
          products: products.map(p => ({
            _id: p._id,
            title: p.title,
            image: p.images[0],
            price: p.price,
            discountPrice: p.discountPrice,
            ratings: p.ratings,
            category: p.category
          }))
        }
      });
    }

    // Budget = lowest priced
    if (intent === 'budget') {
      const products = await Product.find().sort({ price: 1 }).limit(4);
      return res.json({
        success: true,
        reply: {
          text: "💰 Here are our **most affordable** products — great quality at the best prices!",
          products: products.map(p => ({
            _id: p._id,
            title: p.title,
            image: p.images[0],
            price: p.price,
            discountPrice: p.discountPrice,
            ratings: p.ratings,
            category: p.category
          }))
        }
      });
    }

    // Offers = products with discounts
    if (intent === 'offers') {
      const products = await Product.find({ discountPrice: { $exists: true, $ne: null } }).limit(4);
      return res.json({
        success: true,
        reply: {
          text: staticReplies.offers.text,
          products: products.map(p => ({
            _id: p._id,
            title: p.title,
            image: p.images[0],
            price: p.price,
            discountPrice: p.discountPrice,
            ratings: p.ratings,
            category: p.category
          }))
        }
      });
    }

    // Static replies
    const staticReply = staticReplies[intent] || staticReplies.unknown;
    return res.json({ success: true, reply: { text: staticReply.text, products: [] } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Chatbot error', error: err.message });
  }
};
