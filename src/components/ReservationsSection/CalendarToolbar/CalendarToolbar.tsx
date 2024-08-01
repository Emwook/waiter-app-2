import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Col, Row } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface CalendarToolbarProps {
    date: Date;
    onNavigate: (action: 'prev' | 'next' | 'today' | 'date', newDate: Date) => void,
    onSetDate: React.Dispatch<React.SetStateAction<Date>>,
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({ date, onNavigate, onSetDate }) => {
  const goToBack = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    onNavigate('prev', newDate);
  };

  const goToNext = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    onNavigate('next', newDate);
  };

  const goToToday = () => {
    const newDate = new Date();
    onNavigate('today', newDate);
  };

  const handleDateChange = (selectedDate: Date) => {
    onSetDate(selectedDate);
  };

  return (
    <Row className='d-flex mb-2'>
        <Col xs={6}>
            <Button variant="light" className="border border-gray w-25 rounded-1" onClick={goToToday}>
                Today
            </Button>
        </Col>
        <Col xs={6} className='justify-content-end d-flex'>
            <Button variant="light" onClick={goToBack} className='px-auto border border-gray'>
                <i className="bi bi-arrow-left" />
            </Button>
            <DatePicker 
                selected={date} 
                onChange={date => handleDateChange(date as Date)} 
                className="text-center form-control rounded-1"
                dateFormat="dd/MM/yyyy"
            />
            <Button variant="light" onClick={goToNext} className='px-auto rounded-right border border-gray'>
                <i className="bi bi-arrow-right" />
            </Button>
        </Col>
    </Row>
  );
};

export default CalendarToolbar;
