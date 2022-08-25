import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Module */
import leadRouter from "./modules/table";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard", affix: true },
      },
    ],
  },

  {
    path: "/profile",
    component: Layout,
    redirect: "/profile/index",
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/profile/index"),
        name: "Profile",
        meta: { title: "Profile", icon: "user", noCache: true },
      },
    ],
  },
];

export const asyncRoutes = [
	{
		path: '/users',
		component: Layout,
		redirect: '/users/user',
		alwaysShow: true, // will always show the root menu
		name: 'User Management',
		meta: {
			title: 'Users',
			icon: 'peoples',
			roles: ['Admin', 'Employee']
		},
		children: [
			{
				path: 'user',
				component: () => import('@/views/users/user-management'),
				name: 'Customer Management',
				meta: {
					title: 'User Management',
				}
			},
			{
				path: 'agent',
				component: () => import('@/views/users/agent-management'),
				name: 'Agent Management',
				meta: {
					title: 'Agent Management',
					// if do not set roles, means this page does not require permission
				}
			},
			{
				path: 'employee',
				component: () => import('@/views/users/employee-management'),
				name: 'Employee Permission',
				meta: {
					title: 'Employee Management',
					roles: ['Admin'] // or you can only set roles in sub nav
				}
			},
		]
	},
		/* adding routing from module */
		leadRouter,
	{
		path: '/feedback',
		component: Layout,
		redirect: '/feedback/list',
		name: 'Feedback',
		meta: {
			title: 'Feedback',
			icon: 'feedback'
		},
		children: [
			{
				path: 'list',
				component: () => import('@/views/feedback/index'),
				name: 'feedback',
				meta: { title: 'Feedback' }
			}
		]
   },
	{	
		path: '/property',
		component: Layout,
		redirect: '/property/list',
		name: 'Property',
		meta: {
			title: 'Property',
			icon: 'building'
		},
		children: [
			{
				path: 'list',
				component: () => import('@/views/properties/list'),
				name: 'PropertyList',
				meta: { title: 'Property List', icon: 'list' }
			},
			{
				path: 'create',
				component: () => import('@/views/properties/create'),
				name: 'CreateProperty',
				meta: { title: 'Create Property', icon: 'edit'}
			},
			{
				path: 'edit/:id',
				component: () => import('@/views/properties/edit'),
				name: 'EditProperty',
				meta: { title: 'Edit Property', noCache: true, activeMenu: '/property/list' },
				hidden: true
			},
			{
				path: 'view/:id',
				component: () => import('@/views/properties/view'),
				name: 'ViewProperty',
				meta: { title: 'View Property', noCache: true, activeMenu: '/property/list' },
				hidden: true
			}			
		]
	},

  {
    path: "/report",
    component: Layout,
    redirect: "/report/reportList",
    name: "Report",
    meta: {
      title: "Report",
      icon: "report",
    },
    children: [
      {
        path: "report",
        component: () => import("@/views/report/index"),
        name: "Report",
        meta: { title: "Report" },
      },
    ],
  },

  {
    path: "/announce",
    component: Layout,
    redirect: "/announce/create",
    name: "Announce",
    meta: {
      title: "Announce",
      icon: "campaign",
      roles: ["Admin"],
    },
    children: [
      {
        path: "create",
        component: () => import("@/views/announce/index"),
        name: "announce",
        meta: {
          title: "Announce",
        },
      },
    ],
  },
  {
    path: "/notification",
    component: Layout,
    redirect: "/notification/view",
    hidden: true,
    children: [
      {
        path: "view",
        component: () => import("@/views/notification/index"),
        name: "notification",
        meta: {
          title: "Notification",
          icon: "notification",
          noCache: true,
        },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
