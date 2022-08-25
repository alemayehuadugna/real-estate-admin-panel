import request from '@/utils/request'

export function todoList(id) {
    return request({
        url: `employees/${id}/todoLists`,
        method: 'GET'
    })
}


export function add(data, id) {
    return request({
        url: `employees/${id}/todoLists`,
        method: 'POST',
        data
    })
}

export function edit(data, userId, id) {
    return request({
        url: `employees/${userId}/UpdateTodoLists/${id}`,
        method: 'PATCH',
        data
    })
}

export function Delete(userId, id) {
    return request({
        url: `employees/${userId}/todoLists/${id}`,
        method: 'DELETE',
    })
}

export function updateDone(data, id) {
    return request({
        url: `employees/completed/${id}`,
        method: 'PATCH',
        data
    })
}

export function clearTodo() {
    return request({
        url: 'employees/completed',
        method: 'DELETE',
    })
}

export function checkAll(data) {
    return request({
        url: '/employees/toggleAll',
        method: 'PATCH',
        data
    })
}

