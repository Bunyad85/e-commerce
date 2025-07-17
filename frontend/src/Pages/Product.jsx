import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import ShopContextprovider, { ShopContext } from '../Context/ShopContext';
import BreadCrum from '../Components/BreadCrums/BreadCrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
    const { all_product } = useContext(ShopContext);
    const { productId } = useParams();
    const Product = all_product.find((e) => e.id === Number(productId));
    return (
        <div>
            <BreadCrum Product={Product} />
            <ProductDisplay Product={Product} />
            <DescriptionBox />
            <RelatedProducts />
        </div>
    )
}

export default Product