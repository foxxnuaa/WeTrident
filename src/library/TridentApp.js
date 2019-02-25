import {
  createStore,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import combineAppReducers from './combineAppReducers'
import createTridentNavigator from './navigation/WeNavigator'
import { generateRouteName } from './Navigation'
import { createGlobalConnect } from './reduxUtils'
import wrapModules from './wrapModules'
import { AppNavigator } from './navigation'

export default class TridentApp extends Component {
  init () {
    const middlewares = []
    middlewares.push(createLogger(require('./reduxConfig').default.logger))
    console.ignoredYellowBox = [
      'Task orphaned for request',
      'source.uri should not be an empty string'
    ]
    middlewares.push(thunk)
    // middlewares.push(navReduxMiddleware)
    const middleware = applyMiddleware(...middlewares)

    // 路由名称为`moduleName.sceneName`
    const wrappedContainer = createGlobalConnect(this.props.container.config)(this.props.container.component)
    const wrappedModules = wrapModules(this.props.modules, wrappedContainer)

    const flatRouters = (() => {
      let result = {}
      const moduleNames = Object.keys(wrappedModules.routers)
      for (let moduleName of moduleNames) {
        const sceneNames = Object.keys(wrappedModules.routers[moduleName])
        for (let sceneName of sceneNames) {
          let routeName = generateRouteName(moduleName, sceneName)
          result[routeName] = wrappedModules.routers[moduleName][sceneName]
        }
      }
      return result
    })()

    AppNavigator.init(flatRouters)

    this.WeNavigator = createTridentNavigator(flatRouters)

    const store = createStore(
      combineAppReducers(undefined, wrappedContainer, wrappedModules, this.WeNavigator.MyStackNavigator),
      undefined,
      middleware
    )

    this.store = store
  }

  constructor () {
    super(...arguments)
    this.init()
  }

  render () {
    const Navigator = this.WeNavigator.stackNavigator
    return (
      <Provider store={this.store}>
        <this.props.containerComponent initProps={{ ...this.props }}>
          <Navigator />
        </this.props.containerComponent>
      </Provider>
    )
  }
}
