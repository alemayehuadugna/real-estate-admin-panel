<template>
  <el-col >
    <el-row
      :span="8"
      v-for="(message, index) in this.notificationList"
      :key="message.person"
      style="
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 20px;
        margin-right: 40px;
        width: 'responsiveWidth';
      "
    >
      <div
        style="margin: 0px"
        @mouseover="visible = true"
        @mouseout="visible = false"
      >
        <el-card :body-style="{ padding: '0px' }">
          <span>
            <svg-icon
              v-if="visible"
              icon-class="close"
              style="float: right"
              @click="removeCard(message.title, message.description, message.notificationImage, index)"
            />
          </span>

          <span class="main-image-container">
            <img
              :src=message.notificationImage
              class="image"
            />
          </span>

          <div
            style="
              padding: 14px;
              display: inline-block;
              margin-top: 15px;
              margin-bottom: 5px;
              margin-left: 0px;
            "
          >
            <h4 style="margin: 0px">{{ message.title }}</h4>
            <span style="display: block">{{ message.description }}</span>
            <span style="display: block">{{ message.updatedAt }}</span>
          </div>
        </el-card>
      </div>
    </el-row>
  </el-col>
</template>

<script>
import { fetchList, deleteNotification } from '@/api/notification';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      visible: false,
      notificationList: null,
      listLoading: true,
    };
  },
  computed: {
    ...mapGetters(["id"]),
    responsiveWidth() {
      if (this.device === "mobile") {
        return "90%";
      } else {
        return "60%";
      }
    },
  },
  created() {
    this.getLists();
  },
  methods: {
    changeVisiblity() {
      this.visible = !this.visible;
    },
    getLists() {
      this.listLoading = true
      fetchList(this.id).then(response => {
        this.notificationList = response.data

        //Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    removeCard(title, description, notificationImage, index) {
      this.notificationList.splice(index, 1)
      deleteNotification({title, description, notificationImage, }, this.id).then(response => {
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    }
  },
};
</script>


<style lang="scss" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 0px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 60px;
  height: 60px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.main-image-container {
  padding: 10px;
  display: flex;
  display: inline-block;
}
</style>