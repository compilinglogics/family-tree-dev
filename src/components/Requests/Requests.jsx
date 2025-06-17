import React from 'react'
import './Requests.scss'
import RequestCard from '../RequestCard/RequestCard'
const Requests = () => {
    return (
        <div className='requests-container'>
            <span className='title d-block ps-3 mb-2'>
                New
            </span>
            <RequestCard/>
            <RequestCard/>
            <RequestCard/>
        </div>
    )
}

export default Requests
