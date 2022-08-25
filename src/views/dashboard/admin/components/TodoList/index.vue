<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="Todo List" @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll({ done: !allChecked })">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
      <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import Todo from './Todo.vue'
import { todoList, add, edit, Delete, updateDone, clearTodo, checkAll } from '@/api/todo-list'
import { mapGetters } from 'vuex'


const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: function(todos) {
    return todos.filter(function(todo) {
        return todo.done
      })
  }
}
// var defaultList = []
export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  data() {
    return {
      visibility: 'all',
      filters,
      todos: []
    }
  },
  created() {
      this.fetchData()
  },
  computed: {
    ...mapGetters([
        'id'
    ]),
    allChecked() {
      return this.todos.every(todo => todo.done)
    },
    filteredTodos() {
      return filters[this.visibility](this.todos)
    },
    remaining() {
      return this.todos.filter(todo => !todo.done).length
    }
  },
  methods: {
    fetchData() {
        todoList(this.id).then(response => {
            this.todos = response.data;
        })

    },
    addTodo(e) {
      var task = e.target.value
      if (task.trim()) {
        this.todos.push({
          task,
          done: false
        })
      }
      e.target.value = ''
      add({task}, this.id).then(response => {
        this.fetchData()
      }).catch((error)=> {
        console.log("error:", error )
      })
    },
    toggleTodo(val) {
      val.done = !val.done
      var todoListId = val.todoListId  
      var done = val.done
      updateDone({done}, todoListId).then(response => {
        this.fetchData()
      }).catch((error) => {
        console.log("error: ", error)
      })
    },
    deleteTodo(todo) {
      var id= todo.todoListId    
      Delete(this.id, id).then(response => {
        this.fetchData()  
      }).catch((error) => {
        console.log("error: ", error)
      })

    },
    editTodo({ todo, value }) {
      var newTask = value
      todo.task = value
      var id= todo.todoListId
      edit({newTask}, this.id, id).then(response => {
        this.fetchData()
      }).catch((error)=>{
        console.log("error: ", error)
      })
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.done)
      clearTodo().then(response=> {
        this.fetchData()
      }).catch((error)=> {
        console.log("error: ", error)
      })
    },
    toggleAll({ done }) {
      let count = 0;
      this.todos.forEach(todo => {
      if(todo.done === false){ count++ }
        todo.done = done
      })
      checkAll({count}).then(response => {
        this.fetchData()
      }).catch((error) => {
        console.log("error: ", error)
      })
    }
  }
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
