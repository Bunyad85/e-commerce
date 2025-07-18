import React, { useContext } from 'react'
import './ProductDisplay.css'
import start_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { Product } = props;
    const { addToCart } = useContext(ShopContext);
    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={Product.image} alt='' />
                    <img src={Product.image} alt='' />
                    <img src={Product.image} alt='' />
                    <img src={Product.image} alt='' />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={Product.image} alt='' />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{Product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={start_icon} alt='' />
                    <img src={start_icon} alt='' />
                    <img src={start_icon} alt='' />
                    <img src={start_icon} alt='' />
                    <img src={star_dull_icon} alt='' />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">${Product.old_price}</div>
                    <div className="productdisplay-right-price-new">${Product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum similique nulla accusantium impedit eius laboriosam optio velit ratione, dolorem quis provident debitis non dolore. Modi veritatis ad odio nulla sed.
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                        <div>XXL</div>

                    </div>
                </div>
                <button onClick={() => { addToCart(Product.id) }}>ADD TO CART</button>
                <p className='productdisplay-right-category '><span>Category :</span>Women , T-Shirt , Crop Top</p>
                <p className='productdisplay-right-category '><span>Tags :</span>Modern ,Latest</p>

            </div>
        </div>
    )
}

export default ProductDisplay