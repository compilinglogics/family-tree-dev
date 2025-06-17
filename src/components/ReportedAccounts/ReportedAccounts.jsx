import React from 'react'
import CommonLine from '../CommonLine/CommonLine'
import RequestCard from '../RequestCard/RequestCard'
import User1 from '../../assets/images/reportedAccounts/user1.png'

const ReportedAccounts = () => {
    return (
        <div>
            <CommonLine title='Reported Accounts' />
            <RequestCard user={User1} type='earlier' title='Martin Randolph' subTitle='Dallas , US' />
            <RequestCard user={User1} type='earlier' title='Martin Randolph' subTitle='Dallas , US' />
        </div>
    )
}

export default ReportedAccounts
