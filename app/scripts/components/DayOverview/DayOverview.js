/*
 * TimeCard View
 * Copyright ©2015 Thomas Nelson, Jacob Nichols, David Opp, Todd Brochu,
Andrew McGown, Sasha Fahrenkopf, Cameron B. White.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE text file in the root directory of this source tree.
 */
import React from "react"
import { Link } from "react-router" 
import moment from "moment"
import _ from "underscore"
import {createCalendar} from "../Calendar/Calendar.js"
import FluxComponent from 'flummox/component';
import flux from "../../stores/flux"

class ClickableDay extends React.Component {
  render() {
    const url_date = moment(this.props.date).format("YYYY-MM-DD")
    const url_day = moment(this.props.date).format("D")
    return (
      <div>
        <Link to="day" params={{date: url_date}} >
          {url_day}
        </Link>
    </div>
    )
  }
}

const Calendar = createCalendar(ClickableDay)

export default class DayOverview extends React.Component {
  render() {
    return (
      <FluxComponent connectToStores={['timeSheet', 'schedule']}>
        <Overview {...this.props} />
      </FluxComponent>
    )
  }
}

function kronosMoment(date, time, kronosTimeZone) {
  // The following are the expected formats and examples
  // date: M/DD/YYYY - 10/01/1990
  // time: HH:mm - 10:14
  // kronosTimeZone - (GMT -05:00) Eastern Time
  const timeZoneOffset = kronosTimeZone ? kronosTimeZone.match(/[+-]\d\d:\d\d/)[0] : '-07:00'
  return moment(
    `${date} ${time} ${timeZoneOffset}`,
    'M/DD/YYYY HH:mm Z'
  )
}

class Overview extends React.Component {                              
  render() {  
    // XXX Hack! Need to pull from API in a better way
    let lastKronosTimeZone = ""
    const punches = _.chain(this.props.Timesheet.TotaledSpans.TotaledSpan)
      .filter((each) => {
        return each.Date == moment(this.props.params.date).format("M/DD/YYYY")
      })
      .map((each) => {
        const inPunch = each.InPunch.Punch
        inPunch.type = "InPunch"
        inPunch.time = kronosMoment(inPunch.Date, inPunch.Time, inPunch.KronosTimeZone)
        const outPunch = each.OutPunch.Punch
        outPunch.type = "OutPunch"
        outPunch.time = kronosMoment(outPunch.Date, outPunch.Time, outPunch.KronosTimeZone)
        // XXX Hack! Need to pull from API in a better way
        lastKronosTimeZone = outPunch.KronosTimeZone
        return [ inPunch, outPunch ]
      })
      .flatten()
    const scheduled = _.chain(this.props.Schedule.ScheduleItems.ScheduleShift)
      .filter((each) => {
        return each.StartDate == moment(this.props.params.date).format("M/DD/YYYY")
      })
      .map((each) => {
        const { StartDate, EndDate, StartTime, EndTime} = each.ShiftSegments.ShiftSegment
        return [
          {
            time: kronosMoment(StartDate, StartTime, lastKronosTimeZone),
            type: 'scheduledIn'
          },{
            time: kronosMoment(EndDate, EndTime, lastKronosTimeZone),
            type: 'scheduledOut'
          }
        ]
      })
      .flatten()
    const date = moment(this.props.params.date)
    const year = date.format("YYYY")
    const month = date.format("MM")
    const dayHeaders = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
    const punchLog = _.chain([].concat(scheduled.value()).concat(punches.value()))
       .sortBy(punchLog => punchLog.time) 
       .map(punch => <Entry {...punch} />)

    console.log(this.props)
    return (
      <div>  
        <DayHeader date={date}/> 
        <div className="row">
          <div className="col-xs-12 col-md-7">
            {punchLog}
          </div>
          <div className="col-xs-12 col-md-5">
            <div className="calendar hidden-xs hidden-sm">
              <Calendar year={year} month={month-1} headers={dayHeaders} />
            </div>
              <FluxComponent connectToStores={['timeSheet']}>
                <DayStats date={this.props.params.date}/>
              </FluxComponent>
          </div>
        </div>
      </div>
    )
  }
}

class DayHeader extends React.Component {
  render() { 
    const displayDate = this.props.date.format("MMMM DD") 
    return ( 
      <div className="row">
        <div className="col-xs-2">
          <Link to="day" params={{date: this.props.date.clone().subtract(1, "days").format("YYYY-MM-DD")}} 
                type="button" className="pull-left subtle-btn">
            <i className="fa fa-chevron-left"></i>
          </Link> 
        </div>
        <div className="col-xs-8">
          <h4 className="text-center">{displayDate}</h4>
        </div>
        <div className="col-xs-2">
          <Link to="day" params={{date: this.props.date.clone().add(1, "days").format("YYYY-MM-DD")}} 
                type="button" className="pull-right subtle-btn">
            <i className="fa fa-chevron-right"></i>
          </Link> 
        </div>
        <div className="row"><br/></div> {/*For space*/}
        <div className="row"><br/></div>
      </div>
    )
  }
}

class DayStats extends React.Component {
  render() {
    const { date, Timesheet } = this.props
    const totals = _.chain(Timesheet.DailyTotals.DateTotals)
        .filter(each => each.Date == moment(date).format("M/DD/YYYY"))
        .pluck('Totals')
        .pluck('Total')
        .first()
        .filter(each => each.PayCodeId == "140")
        .first()
        .value()
    const AmountInTime = totals ? totals.AmountInTime : ""
    const AmountInCurrency = totals ? totals.AmountInCurrency : ""
    return (
      <div className="panel period-totals">
        <div className="panel-body">
          <p><strong>Total Hours Worked:</strong> <span className="period-stat">{AmountInTime}</span></p>
          <p><strong>Total Amount Made:</strong> <span className="period-stat">${AmountInCurrency}</span></p>
        </div>
      </div>   
    )
  }
}

class Entry extends React.Component {
  render() {
    const panelClassDefault = "panel time-entry day"
    const glyphClassDefault = "day-icon"

    const settings = {
      InPunch: {
        action: "Clocked in",
        panelClass: panelClassDefault + " " + "time-in",
        glyphClass: glyphClassDefault + " fa-flip-horizontal" + " fa fa-truck"
      },
      OutPunch: {
        action: "Clocked out",
        panelClass: panelClassDefault + " " + "time-out",
        glyphClass: glyphClassDefault + " " + "fa fa-truck"
      },
      scheduledIn: {
        action: "Shift started",
        panelClass: panelClassDefault + " " + "shift-info",
        glyphClass: glyphClassDefault + " " + "fa fa-clock-o"
      },
      scheduledOut: {
        action: "Shift ended",
        panelClass: panelClassDefault + " " + "shift-info",
        glyphClass: glyphClassDefault + " " + "fa fa-clock-o"
      }
    }

    const {action, panelClass, glyphClass} = settings[this.props.type]
    const time = this.props.time.format('hh:mm a') 
    return ( 
        <div className={panelClass}>
            <div className="date-side-box">
                <p className="text-center"><i className={glyphClass}></i></p>
                <p>{action}</p>
            </div>
            <p className="hours-worked-text"><span className="hours-worked-number">{time}</span></p>
        </div>
    )
  }
}
