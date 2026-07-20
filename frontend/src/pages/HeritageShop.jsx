import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import './HeritageShop.css'

const shopCategories = ['All', 'Publications', 'Artisanal Crafts', 'Maps & Prints'];

// Authentic data curated from official INTACH & Regional Heritage registers
const shopItems = [
  {
    id: 'pune-heritage-directory',
    name: 'Pune Heritage Directory & Guide',
    category: 'Publications',
    price: 450,
    description: 'An exhaustive, illustrated directory detailing the protected wadas, temples, and colonial structures of the Pune region.',
    importance: 'Sourced from active INTACH documentation registers. Maps over 2,000 years of civilization ranging from 8th-century Pataleshwar rock-cut complexes to ancient Satavahana settlements and Peshwa-period urban residential clusters.',
    tag: 'INTACH Publication',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'maratha-forts-atlas',
    name: 'Sahyadri Forts Hand-Drawn Map',
    category: 'Maps & Prints',
    price: 750,
    description: 'A premium, archival-grade parchment print featuring ink and copper-plate style renderings of 17th-century hill forts.',
    importance: 'Honors the historic military architecture of Chhatrapati Shivaji Maharaj. Documented by heritage surveyors to map key strategic mountain passes (Ghats) linking the Deccan Plateau to the Konkan maritime trade routes.',
    tag: 'Limited Edition',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1584267385494-9fbf976094d8?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'tambat-brass-pendant',
    name: 'Hand-Hammered Brass Bookmark',
    category: 'Artisanal Crafts',
    price: 320,
    description: 'Crafted manually by the traditional Tambat (coppersmith) artisans of Pune, featuring a subtle engraved geometric motif.',
    importance: 'Directly supports the surviving Twashta Kasar community of Tambat Ali in Kasba Peth, Pune. Features rare "matharkaam" (rhythmic hand-beating indentations) passed down since the 18th-century patronage of Peshwa Sawai Madhavrao.',
    tag: 'Artisan Heritage',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'intach-journal-history',
    name: 'Journal of Indian Heritage (Vol 4)',
    category: 'Publications',
    price: 600,
    description: 'A collection of peer-reviewed research papers and preservation case studies focusing on Maharashtra’s historic water systems.',
    importance: 'Compiles technical conservation monographs covering ancient subterranean stepwells (Baolis), traditional lime mortar analysis, and community-led historical landscape restoration frameworks across India.',
    tag: 'Research Monograph',
    inStock: false,
    images: [
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

export default function HeritageShop() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cartItems, setCartItems] = useState([]);
  const cartCount = cartItems.length;
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
);

  const [selectedItem, setSelectedItem] = useState(null) // Modal State
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0)

  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    return shopItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery])

  const openProductDetails = (item) => {
    setSelectedItem(item);
    setActiveModalImageIndex(0);
  }

  return (
    <div className="full-screen-shop-wrapper">
      {/* 1. Immersive Full-Width Header Navigation */}
      <nav className="global-app-nav">
        <div className="nav-brand-block">
          <span className="brand-logo-text">INTACH</span>
          <span className="brand-logo-sep">/</span>
          <span className="brand-logo-sub">HERITAGE PORTAL</span>
        </div>
      </nav>

      {/* 2. Hero Presentation section */}
      <header className="shop-app-hero">
        <span className="hero-eyebrow">INTACH Official Marketplace</span>
        <h1 className="hero-title-text">A living bazaar of what survives</h1>
        <p className="hero-description-text">
          Directly fund regional preservation movements. Discover validated research directories, rare cartographic prints, and authentic metalware commissioned from legacy artisan clusters.
        </p>
        <div className="hero-actions">
          <button
          className="hero-profile-btn"
                onClick={() => navigate("/profile")}
            >
                👤 Profile
            </button>

            <button
                className="hero-orders-btn"
                onClick={() => navigate("/orders")}
            >
                📦 Orders
            </button>

            <button
                className="hero-shopping-bag"
                onClick={() =>
                    navigate("/checkout", {
                        state: {
                            cartItems,
                            totalAmount,
                        },
                    })
                }
            >
                <span className="bag-glyph">👜 Cart</span>
                <span className="bag-count-badge">{cartCount}</span>
            </button>

        </div>
      </header>

      {/* 3. Operational Toolbar Container */}
      <section className="shop-app-toolbar">
        <div className="search-input-frame">
          <span className="search-glyph">🔍</span>
          <input 
            type="text" 
            placeholder="Search verified publications, maps, architectural guides..." 
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-chips-wrapper">
          {shopCategories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip-item ${activeCategory === cat ? 'filter-chip-item--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Full View Grid Content */}
      <main className="shop-app-main">
        {filteredItems.length === 0 ? (
          <div className="empty-grid-msg">No verified artifacts match your query criteria.</div>
        ) : (
          <div className="shop-display-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="heritage-display-card">
                <div className="card-header-meta">
                  <span className="card-tag-label">{item.tag}</span>
                  <span className="card-category-label">{item.category}</span>
                </div>
                <h3 className="card-item-title">{item.name}</h3>
                <p className="card-item-summary">{item.description}</p>
                
                <div className="card-action-footer">
                  <span className="card-item-price">₹{item.price}</span>
                  <div className="card-btn-cluster">
                    <button className="btn-secondary-action" onClick={() => openProductDetails(item)}>
                      View Details
                    </button>
                    {item.inStock ? (
                      <button className="btn-primary-action" onClick={() => setCartItems(prev => [...prev, item])}>
                        Add to Bag
                      </button>
                    ) : (
                      <span className="status-out-label">Sold Out</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 5. 80% Wide Screen Authentic Product Modal Popup */}
      {selectedItem && (
        <div className="modal-overlay-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="premium-product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-trigger" onClick={() => setSelectedItem(null)}>✕</button>
            
            <div className="modal-layout-split">
              {/* Left Side: Dynamic Gallery Display */}
              <div className="modal-gallery-column">
                <div className="modal-primary-image-frame">
                  <img 
                    src={selectedItem.images[activeModalImageIndex]} 
                    alt={selectedItem.name} 
                    className="modal-active-img"
                  />
                </div>
                <div className="modal-thumbnail-row">
                  {selectedItem.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      className={`modal-thumb-btn ${activeModalImageIndex === idx ? 'modal-thumb-btn--active' : ''}`}
                      onClick={() => setActiveModalImageIndex(idx)}
                    >
                      <img src={img} alt="Thumbnail preview" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side: Authentic Archival Content */}
              <div className="modal-content-column">
                <div className="modal-header-labels">
                  <span className="modal-badge-tag">{selectedItem.tag}</span>
                  <span className="modal-badge-cat">{selectedItem.category}</span>
                </div>
                <h2 className="modal-product-title">{selectedItem.name}</h2>
                <div className="modal-product-price">Price: ₹{selectedItem.price}</div>
                
                <div className="modal-scroll-info">
                  <div className="info-block-section">
                    <h4>Overview & Details</h4>
                    <p>{selectedItem.description}</p>
                  </div>

                  <div className="info-block-section highlighted-importance-box">
                    <h4>Historical & Cultural Importance</h4>
                    <p>{selectedItem.importance}</p>
                  </div>
                </div>

                <div className="modal-action-footer-row">
                  {selectedItem.inStock ? (
                    <button 
                      className="btn-primary-action modal-checkout-btn" 
                      onClick={() => {
                        setCartItems(prev => [...prev, selectedItem]);
                        setSelectedItem(null);
                      }}
                    >
                      Add This Item to Bag
                    </button>
                  ) : (
                    <button className="btn-primary-action modal-checkout-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      Currently Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}