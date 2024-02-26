import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <div className="Collection-Banner">
        <div className="Collection-Title">
          <h1>Collections</h1>
        </div>
        <div className="Collection-Card-Area">
          <div className="card">
            <a href="./collections/electronics">
              <div className="collection-card">
                <h2>Electronics</h2>
                <img src="../images/electronics.jpg" />
              </div>
            </a>
          </div>

          <div className="card">
            <a href="./collections/vendor_items">
              <div className="collection-card">
                <h2>Vendor Items</h2>
                <img src="../images/vendor_items.jpg" />
              </div>
            </a>
          </div>

          <div className="card">
            <a href="./collections/health_and_safety">
              <div className="collection-card">
                <h2>Health and Safety</h2>
                <img src="../images/health_and_safety.jpg"/>
              </div>
            </a>
          </div>

          <div className="card">
            <a href="./collections/toys_and_games">
              <div className="collection-card">
                <h2>Toys and Games</h2>
                <img src="../images/toys_and_games.jpg"/>
              </div>
            </a>
          </div>

          <div className="card">
            <a href="./collections/cti_items">
              <div className="collection-card">
                <h2>CTI Items</h2>
                <img src="../images/cti_items.jpg"/>
              </div>
            </a>
          </div>

          <div className="card">
            <a href="./collections/tech_gear">
              <div className="collection-card">
                <h2>Tech Gear</h2>
                <img src="../images/tech_gear.jpg"/>
              </div>
            </a>
          </div>

          <div className="card">
            <a href="./collections/books">
              <div className="collection-card">
                <h2>Books</h2>
                <img src="../images/books.jpg"/>
              </div>
            </a>
          </div>

          <div className="card">
            <a href="./collections/miscellaneous">
              <div className="collection-card">
                <h2>Miscellaneous</h2>
                <img src="../images/misc.jpg"/>
              </div>
            </a>
          </div>

        </div>
      </div>
      
      
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
