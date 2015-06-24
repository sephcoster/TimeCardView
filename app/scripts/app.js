import React from "react"
import Router, { Route, RouteHandler, DefaultRoute } from "react-router"
import { Resolver } from "react-resolver"
import { createRedux } from "redux"
import { Provider } from "redux/react"
import * as stores from "./stores"
import DayOverview from "./ui/DayOverview"
import PayPeriodsOverview from "./ui/PayPeriodsOverview"
import Main from "./ui/Main.js"
import FluxComponent from 'flummox/component';
import flux from "./stores/flux"

const mountNode = document.getElementById("app")

class App extends React.Component {
  render() {
    return (
      <FluxComponent flux={flux}>
        <Main />
      </FluxComponent>
    )
  }
}

const routes = (
  <Route name="app" handler={App} path="/">
    <DefaultRoute handler={PayPeriodsOverview} />
    <Route name="day" path="day/:date" handler={DayOverview} />
  </Route>
)

Router.run(routes, (Handler, state) => {
  const params = state.params
  Resolver.render(<Handler params={params}/>, mountNode)
})
