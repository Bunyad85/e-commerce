import React from 'react'
import './BreadCrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'
import Product from '../../Pages/Product'

const BreadCrum = (props) => {
    const { product } = props;
    return (
        <div className='breadcrum'>
            HOME <img src={arrow_icon} alt='' /> SHOP <img src={arrow_icon} alt='' /> {Product.category} <img src={arrow_icon} alt="" /> {Product.name}
        </div>
    )
}

export default BreadCrum