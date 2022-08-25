import Layout from '@/layout'

const leadRouter = {
    path: '/table',
    component: Layout,
    redirect: '/table/lead',
    name: 'Table',
    meta: {
        title: 'Table',
        icon: 'table'
    },
    children: [
      {
       path: 'lead',
       component: () => import('@/views/table/lead'),
       name: 'Lead',
       meta: { title: 'Lead' }
     } 
    ]
}

export default leadRouter