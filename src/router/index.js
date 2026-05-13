import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout/'

export const constantRoutes = [
  {
    path: '/login',
    alwaysShow: false,
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    alwaysShow: false,
    redirect: '/installment/new'
  },

  {
    path: '/installment/new',
    component: Layout,
    alwaysShow: true,
    name: 'InstallmentNew',
    id: 1,
    meta: {
      title: 'Tài chính',
      icon: 'fa fa-check-square',
      roles: [1, 2, 3, 4, 5]
    },
    children: [
      {
        path: '',
        component: () => import('@/views/news/'),
        name: 'InstallmentNew',
        meta: {
          title: 'Tài chính',
          roles: [1, 2, 3, 4, 5]
        }
      }
    ]
  },

  {
    path: '/installment/user',
    component: Layout,
    alwaysShow: true,
    name: 'InstallmentUser',
    id: 4,
    meta: {
      title: 'Tạo user',
      icon: 'fa fa-user',
      roles: [1]
    },
    children: [
      {
        path: '',
        component: () => import('@/views/user/'),
        name: 'InstallmentUser',
        meta: {
          title: 'Tạo user',
          roles: [1]
        }
      }
    ]
  },
  {
    path: '/installment/logreturn',
    component: Layout,
    alwaysShow: true,
    name: 'Installmentlogreturn',
    id: 5,
    meta: {
      title: 'Kết quả thẩm định',
      icon: 'fa fa-chart-line',
      roles: [1, 2, 3, 4, 5]
    },
    children: [
      {
        path: '',
        component: () => import('@/views/logreturn/'),
        name: 'Installmentlogreturn',
        meta: {
          title: 'Kết quả thẩm định',
          roles: [1, 2, 3, 4, 5]
        }
      }
    ]
  },
  {
    path: '/installment/logdata',
    component: Layout,
    alwaysShow: true,
    name: 'Installmentlogdata',
    id: 5,
    meta: {
      title: 'Gửi dữ liệu nhà TC',
      icon: 'fa fa-paper-plane',
      roles: [1, 2, 3, 4, 5]
    },
    children: [
      {
        path: '',
        component: () => import('@/views/logdata/'),
        name: 'Installmentlogdata',
        meta: {
          title: 'Gửi dữ liệu nhà TC',
          roles: [1, 2, 3, 4, 5]
        }
      }
    ]
  },

  {
    path: '/installment/loggetorder',
    component: Layout,
    alwaysShow: true,
    name: 'Installmentloggetorder',
    id: 5,
    meta: {
      title: 'Thông tin nhận đơn',
      icon: 'fa fa-check-square',
      roles: [1, 2, 3, 4, 5]
    },
    children: [
      {
        path: '',
        component: () => import('@/views/loggetorder/'),
        name: 'Installmentloggetorder',
        meta: {
          title: 'Thông tin nhận đơn',
          roles: [1, 2, 3, 4, 5]
        }
      }
    ]
  },
  {
    path: '/installment/logupdateapp',
    component: Layout,
    alwaysShow: true,
    name: 'Installmentlogupdateapp',
    id: 6,
    meta: {
      title: 'Trạng thái cập nhật',
      icon: 'fa fa-check',
      roles: [1, 2, 3, 4, 5]
    },
    children: [
      {
        path: '',
        component: () => import('@/views/logupdateapp/'),
        name: 'Installmentlogupdateapp',
        meta: {
          title: 'Trạng thái cập nhật',
          roles: [1, 2, 3, 4, 5]
        }
      }
    ]
  },

  {
    path: '/installment/export',
    component: Layout,
    alwaysShow: true,
    name: 'InstallmentExport',
    id: 5,
    meta: {
      title: 'Xuất báo cáo',
      icon: 'fa fa-download',
      roles: [1, 2, 3, 4, 5]
    },
    children: [
      {
        path: '',
        component: () => import('@/views/export/'),
        name: 'InstallmentExport',
        meta: {
          title: 'Xuất báo cáo',
          roles: [1, 2, 3, 4, 5]
        }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
