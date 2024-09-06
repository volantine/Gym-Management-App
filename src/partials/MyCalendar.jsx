import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/MyCalendar.css';

const localizer = momentLocalizer(moment);

function MyCalendar() {
    const [currentView, setView] = useState('month');
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        const response = await fetch(`http://localhost:3000/trainer?username=${encodeURIComponent(localStorage.getItem('username'))}`);
        const result = await response.json();
        let results = [];
        for (let each of result) {
            results.push({
                title: `${localStorage.getItem('username')} ` + (each.isgroup ? 'Group Class': (each.class ? 'Class': 'Availability')),
                start: new Date(each.start_time),
                end: new Date(each.end_time),
                class: each.class
            });
        }
        setEvents(results);
    }

    const handleSelect = async ({start, end}) => {
        const response = await fetch('http://localhost:3000/trainer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': localStorage.getItem('username'), 'start': start.toISOString(), 'end': end.toISOString(), 'method': 'add'})
        });

        if (!response.ok) {
            alert('Failed to add event');
        } else {
            fetchEvents();
        }
    }

    const handleRemove = async (event) => {
        if (event.class || event.isgroup) return;

        const { start, end } = event;
        const response = await fetch('http://localhost:3000/trainer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': localStorage.getItem('username'), 'start': start.toISOString(), 'end': end.toISOString(), 'method': 'remove'})
        });

        if (!response.ok) {
            alert('Failed to remove event');
        } else {
            fetchEvents();
        }
    }

    const handleView = view => setView(view);

    useEffect(() => {
        fetchEvents();
    }, []);
    
    const customToolbar = ({ label, onView, onNavigate }) => {
        return (
          <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('PREV')}>{'<'}</button>
                <button type="button" onClick={() => onNavigate('NEXT')}>{'>'}</button>
            </span>
            <span className="rbc-toolbar-label">{label}</span>
            <span className="rbc-btn-group">
              <button type="button" onClick={() => onView('month')}>Month</button>
              <button type="button" onClick={() => onView('day')}>Day</button>
            </span>
          </div>
        );
    };

    const eventStyle = (event) => {
        let backgroundColor;
        if (event.class || event.isgroup) {
            backgroundColor = '#d67663';
        } else {
            backgroundColor = '#8bd973';
        }

        return {
            style: {
                backgroundColor,
                textShadow: '0px 0px 5px black'
            }
        };
    }

    return (
        <div style={{ height: '500px'}}>
            <Calendar 
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'day']}
                style={{ margin: '50px'}}
                selectable={currentView === 'day'}
                events={events}
                onView={handleView}
                onDoubleClickEvent={currentView === 'day' ? handleRemove: undefined}
                onSelectSlot={handleSelect}
                min={new Date().setHours(8,0,0)}
                max={new Date().setHours(20,0,0)}
                components={{toolbar: customToolbar}}
                eventPropGetter={eventStyle}
            />
        </div>
    );
}

export default MyCalendar;