

 export const increment = function (context) {
     console.log("执行这列了",context)
    // context.commit('increment')
  }

  export const changeHomeModule = function ({commit},obj) {
        commit('CHANGE_HOME_MODULE',obj)
 }