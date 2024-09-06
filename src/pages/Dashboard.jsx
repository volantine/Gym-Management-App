import React from 'react';
import MyCalendar from '../partials/MyCalendar';
import Rooms from '../partials/Rooms';
import MemberDashboard from './MemberDashboard';

function Dashboard() {
    let dash;

    switch (localStorage.getItem('account_type')) {
        case 'member':
            dash = (
                <>
                    <MemberDashboard username={localStorage.getItem('username')} />
                </>
            );
            break;

        case 'trainer':
            dash = (
                <>
                    <MyCalendar />
                </>
            );
            break;

        case 'admin':
            dash = (
                <>
                    <Rooms />
                </>
            );
            break;
    }

    return (
        <>
            {dash}
        </>
    );
}

export default Dashboard;