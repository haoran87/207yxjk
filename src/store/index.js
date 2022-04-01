import * as actions from './actions'
import getters from './getters'
import state from './state'
import mutations from './mutations'

import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        "yqInfo": {
            namespaced: true,
            state,
            getters,
            actions,
            mutations
        },
    },
    strict: debug,
    plugin: debug ? [createLogger()] : []
})

