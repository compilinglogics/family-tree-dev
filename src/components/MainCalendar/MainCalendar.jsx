import './MainCalendar.scss'
import React, { useState } from 'react'
import { Button, Form, Image } from 'react-bootstrap';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import Arrow from '../../assets/images/Previous.svg'

const MainCalendar = ({ onChange, value, tileDisabled,className,tileContent , minYear, maxYear }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const handlePrevMonth = () => {
        const newDate = new Date(value);
        newDate.setMonth(newDate.getMonth() - 1);
        setSelectedYear(newDate.getFullYear())
        onChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(value);
        newDate.setMonth(newDate.getMonth() + 1);
        setSelectedYear(newDate.getFullYear())
        onChange(newDate);
    };

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
        const newDate = new Date(value);
        newDate.setFullYear(parseInt(event.target.value));
        onChange(newDate);
    };
    const yearOptions = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - minYear; year <= currentYear + maxYear; year++) {
        yearOptions.push(
            <option key={year} value={year}>
                {year}
            </option>

        );
    }
    return (
        <div className={`mainCalendar ${className?className:''}`}>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className='month-changer'>
                    <span className='title'>{value.toLocaleString('en-US', { month: 'long' })}</span>
                    <div className="actions">

                    <Button onClick={handlePrevMonth} className="line-height-0 p-0" variant="transparent">
                        <Image className='img-fluid'  src={Arrow} />
                    </Button>
                    <Button onClick={handleNextMonth} className="line-height-0 p-0" variant="transparent">
                        <Image  className="img-fluid rotate-180" src={Arrow} />
                    </Button>
                    </div>
                </div>
                <div className='year-selector-medium'>
                    <Form.Select className='border-0' value={selectedYear} onChange={handleYearChange} aria-label="Default select example">
                        {yearOptions}
                    </Form.Select>
                </div>
            </div>

            <Calendar
                className='mb-3 w-100'
                onChange={onChange}
                value={value}
                tileDisabled={tileDisabled}
                tileContent={tileContent
                    
                }
            />
        </div>
    )
}

export default MainCalendar