import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
    return (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews (122)</div>
            </div>
            <div className="descriptionbox-description">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem culpa ut temporibus natus minima, soluta officiis explicabo laboriosam, veniam distinctio obcaecati nam veritatis vero excepturi! Quia, facilis! Nemo, libero accusantium.</p>
            </div>

        </div>
    )
}

export default DescriptionBox