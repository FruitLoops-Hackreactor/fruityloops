import { useState, useEffect } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons'
import SkeletonCard from '../SkeletonCard'
import ProductCard from './ProductCard'

export default function Products({
  max,
  loading,
  currentProduct,
  relatedProducts,
  setModalOpen,
  setModalContent,
}) {
  const [slideIdx, setSlideIdx] = useState(0)
  const slideLeft = () => setSlideIdx((idx) => (idx === 0 ? 0 : idx - 1))
  const slideRight = () =>
    setSlideIdx((idx) => (idx === relatedProducts.length - max ? idx : idx + 1))
  const currFeatures = !currentProduct
    ? []
    : currentProduct.features.sort((a, b) => a.feature.localeCompare(b.feature))

  /**
   * Get the features of both the current product and the selected product to compare
   * and display common and different features.
   */
  const handleComparisonClick = (id) => () => {
    const product = relatedProducts.find((product) => product.id === id)
    const relFeatures = product.features.sort((a, b) => a.feature.localeCompare(b.feature))
    const features = []
    let i = 0

    for (; i < currFeatures.length; i++) {
      features.push({
        feature: currFeatures[i].feature,
        currentProduct: currFeatures[i].value,
        relatedProduct:
          relFeatures[i].feature === currFeatures[i].feature ? relFeatures[i].value : null,
      })
    }

    for (i = 0; i < relFeatures.length; i++) {
      if (!features.find((feature) => feature.feature === relFeatures[i].feature)) {
        features.push({
          feature: relFeatures[i].feature,
          currentProduct: null,
          relatedProduct: relFeatures[i].value,
        })
      }
    }

    setModalOpen(true)
    setModalContent(
      <div className="product-comparison">
        <div className="title">
          <span>comparing</span>
        </div>
        <div className="product-names">
          <span>{currentProduct.name}</span>
          <span>{product.name}</span>
        </div>
        <div className="comparison">
          {!features.length ? (
            <h2>No features on both items</h2>
          ) : (
            features.map(({ feature, currentProduct, relatedProduct }) => (
              <div className="row" key={feature}>
                <span>{currentProduct === 'true' ? <IconCheck size={22} /> : currentProduct}</span>
                <span className="feature">{feature}</span>
                <span>{relatedProduct === 'true' ? <IconCheck size={22} /> : relatedProduct}</span>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  /**
   * Handle the carousel. Need to grab all the product cards and shift them
   * by the amount of the slide index times the width of the card plus the
   * margin-right gap.
   */
  useEffect(() => {
    // Prevent the hook from running if there are no products
    if (!relatedProducts.length) return

    const cards = document.querySelectorAll('.related-products .product-card')

    cards.forEach((card) => {
      // Get the width of the card and the margin-right gap, except when the
      // slide index is 0, then just set the translate to 0
      card.style.transform = `translateX(calc(${slideIdx * -280}px + ${slideIdx * -2}rem))`
    })
  }, [slideIdx])

  return (
    <div>
      <div className="section-title">
        <h3>Related Products</h3>
      </div>

      <div className="related-products">
        {!loading && !relatedProducts.length ? (
          <div className="no-products">
            <h3>No related products found</h3>
          </div>
        ) : loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={`skeleton-card-${i}`} />)
        ) : (
          <div className="products">
            {/* Only render slider if there are more than the number of cards to display at once */}
            {relatedProducts.length > max && (
              <>
                <div className="overlay left" style={{ opacity: slideIdx === 0 ? 0 : 1 }} />
                <div
                  className="overlay right"
                  style={{ opacity: slideIdx === relatedProducts.length - max ? 0 : 1 }}
                />

                <div className="navigation">
                  <div className="left" style={{ opacity: slideIdx > 0 ? 1 : 0 }}>
                    <button onClick={slideLeft}>
                      <IconChevronLeft size={32} />
                    </button>
                  </div>
                  <div
                    className="right"
                    style={{ opacity: slideIdx < relatedProducts.length - max ? 1 : 0 }}
                  >
                    <button onClick={slideRight}>
                      <IconChevronRight size={32} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {relatedProducts.length &&
              relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  actionHandler={handleComparisonClick}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
