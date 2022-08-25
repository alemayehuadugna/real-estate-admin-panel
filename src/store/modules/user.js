import { login, getInfo, updateInfo, changePassword } from "@/api/user"
import { getToken, setToken, removeToken } from "@/utils/auth"
import { resetRouter } from "@/router"

const state = {
    token: getToken(),
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    profilePicture: '',
    roles: []
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ID: (state, id) => {
        state.id = id
    },
    SET_FIRST_NAME: (state, firstName) => {
        state.firstName = firstName
    },
    SET_LAST_NAME: (state, lastName) => {
        state.lastName = lastName
    },
    SET_PHONE: (state, phone) => {
        state.phone = phone
    },
    SET_EMAIL: (state, email) => {
        state.email = email
    },
    SET_PROFILE_PICTURE: (state, profilePicture) => {
        state.profilePicture = profilePicture
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { phone, password } = userInfo
        const grant_type = "password"
        return new Promise((resolve, reject) => {
            login({ grant_type, phone, password }).then(response => {
                const { data } = response
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // change user password
    changePassword({ commit },data) {
        const { id, password } = data
        return new Promise((resolve, reject) => {
            changePassword(id, { password }).then(() => {
                resolve()
            }).catch(error => {
                console.log("Store User Error: ", error)
                reject(error)
            })
        })
    },

    // update user info
    updateInfo({commit}, user) {
        const {id, firstName, lastName, email, profilePicture} = user;
        const data = { firstName, lastName, email, profilePicture }
        return new Promise((resolve, reject) => {
            updateInfo(id, data).then(response => {
                const { data } = response
                if (!data) { reject('Verification failed, please Login again.') }
                const { id, firstName, lastName, phone, email, profilePicture, roles } = data

                commit('SET_ID', id)
                commit('SET_FIRST_NAME', firstName)
                commit('SET_LAST_NAME',  lastName)
                commit('SET_PHONE', phone)
                commit('SET_EMAIL', email)
                commit('SET_PROFILE_PICTURE', profilePicture)
                commit('SET_ROLES', roles)
                resolve(data)
            }).catch (error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response
                if (!data) { reject('Verification failed, please Login again.') }
                const { id, firstName, lastName, phone, email, profilePicture, roles } = data

                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }
                commit('SET_ID', id)
                commit('SET_FIRST_NAME', firstName)
                commit('SET_LAST_NAME',  lastName)
                commit('SET_PHONE', phone)
                commit('SET_EMAIL', email)
                commit('SET_PROFILE_PICTURE', profilePicture)
                commit('SET_ROLES', roles)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resetRouter()
            resolve()
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
        })
    },
}

export default {
    namespaced: true,
    state, 
    mutations,
    actions
}