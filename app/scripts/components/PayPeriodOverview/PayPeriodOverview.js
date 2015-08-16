/*
 * TimeCard View
 * Copyright ©2015 Thomas Nelson, Jacob Nichols, David Opp, Todd Brochu,
Andrew McGown, Sasha Fahrenkopf, Cameron B. White.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE text file in the root directory of this source tree.
 */
import React from "react"
import Router, { RouteHandler, Link} from "react-router"
import _ from "lodash"
import moment from "moment"
import FluxComponent from 'flummox/component';
import flux from "../../flux/flux"
import PayPeriodStats from "../PayPeriodStats/PayPeriodStats.js"
import PayPeriodDay from "../PayPeriodDay/PayPeriodDay"
import Page from '../Page/Page'

export default class PayPeriodOverview extends React.Component {
  // PayPeriodsOverview connects to the datastore timesheet
  // and produces a component that displays all recent timesheet
  // stamps with date and culmulative hours
  render() {
    return (
      <FluxComponent connectToStores={['kronos']}>
        <PayPeriod {...this.props}/>
      </FluxComponent>
    )
  }
}

class PayPeriod extends React.Component {
  componentDidMount() {
    flux.getActions('kronos').setStoreDateRange(this.props.dateRange)
    flux.getActions('kronos').fetchTimesheet()
  }
  // PayPeriods creates a list of PayPeriod Components
  // Needs tested with more data
  render() {
    const { timesheet } = this.props

    const startDate = timesheet.startDate 
      ? timesheet.startDate.format('MMMM DD')
      : ''
    const endDate = timesheet.endDate
      ? timesheet.endDate.format('MMMM DD')
      : ''
    const dateRange = startDate + " - " + endDate
                       
    const days = _.chain(timesheet)
        .get('days', [])
        .map(each => (
          <PayPeriodDay {...each} 
              exceptions={flux.getStore('kronos').getExceptionsForDate(each.date)}
          />
        ))
        .value()

    return (
      <Page>
        <div className="row time-overview">
          <div className="col-xs-12">
            <div className="payperiod-overview">
              <PeriodHeader periodType={this.props.periodType} />
              <h3 className="text-center"><small>{dateRange}</small></h3>

              <h6 className="text-center"><OtherPayPeriodLink {...this.props} /></h6>
              <FluxComponent connectToStores={['kronos']}>
                <PayPeriodStats />
              </FluxComponent>
              <table className="table table-hover">
                <tr>
                  <th>Date</th>
                  <th>worked</th>
                  <th>PTO</th>
                  <th>Overtime</th>
                  <th>total</th>
                </tr>
                <tbody>{days}</tbody>
              </table>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

class OtherPayPeriodLink extends React.Component {
  // Shows a link to previous payperiod if current component's props.periodType="current"
  // else returns null
  render() {
    if(this.props.periodType == "Current") {
      return(
        <Link to="previous" name="period-link previous">Previous Pay Period</Link>
      )
    } 
    if(this.props.periodType == "Previous") {
      return(
        <Link to="app" name="period-link current">Current Pay Period</Link>
      )
    } else {
      return null
    }
  }
}

class PeriodHeader extends React.Component {
  // Returns the header for the period as period span and dates
  render() {
    const header = this.props.periodType + " Pay Period"
    return(
      <h3 className="text-center"><strong>{{header}}</strong></h3>
    );
  }
}