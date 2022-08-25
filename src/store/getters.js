const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    // user getters
    id: state => state.user.id,
    firstName: state => state.user.firstName,
    lastName: state => state.user.lastName,
    phone: state => state.user.phone,
    email: state => state.user.email,
    profilePicture: state => state.user.profilePicture,
    roles: state => state.user.roles,
    token: state => state.user.token,
    permission_routes: state => state.permission.routes,
  }
  export default getters
  