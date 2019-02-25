/**
 * Created by erichua on 2019-02-23T10:25:07.640Z.
 */
import { createSceneConnect } from 'library/reduxUtils'
import global from '../../../container'
import ModulePrivate from '../actionsReducer'

const sceneConfig = {
  moduleName: ModulePrivate.moduleName,
  sceneName: 'ChartExampleScene',
  /**
   * 定义scene级别数据的初始值
   */
  initialState: {
    count: 0,
  },

  /**
   * 定义scene级别的actions
   */
  actions: {
    addCount: v => v,
  },

  /**
   * 定义scene级别的异步actions
   */
  asyncActions: (actions) => ({
    // addCountAsync: () =>
    //   async dispatch => dispatch(actions.addCount(await Service.requestMockData()))
  }),

  /**
   * 定义scene级别的reducer
   */
  reducers: {
    addCount: (state, action) => ({...state, count: state.count + action.payload}),
  },

  /**
   * 将module级别的共享数据映射到props.modulePrivate
   */
  mapModuleState: state => ({
    count: state.count
  }),

  /**
   * 将global级别的共享数据映射到props
   */
  mapGlobalState: state => ({
    count: state.count
  }),

  /**
   * 将module级别的actions映射到props
   */
  moduleActions: {
    addCount: ModulePrivate.actions.addCount
  },

  /**
   * 将global级别的actions映射到props
   */
  globalActions: {
    addCount: global.actions.addCount
  },

  /**
   * 开启后，页面创建时自动重置为初始状态，默认为 true
   * @type {boolean}
   */
  autoResetState: true
}

export default createSceneConnect(sceneConfig)(require('./ChartExampleScene').default)
