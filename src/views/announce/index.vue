<template>
  <div>
    <h1>Create Announcement</h1>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="responsiveWidth"
      class="form"
    >
      <el-form-item label="Type of Push" prop="notificationType">
        <el-select
          v-model="ruleForm.notificationType"
          placeholder="Push notification type"
        >
          <el-option label="Announcement" value="announcement"></el-option>
          <el-option label="Discipline" value="discipline"></el-option>
          <el-option label="Admin" value="admin"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Add Title" prop="title">
        <el-input
          v-model="ruleForm.title"
          placeholder="Enter the title of the message"
        ></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input
          v-model="ruleForm.description"
          placeholder="Enter Description"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="ReceiverId"
        prop="receiverId"
        v-if="ruleForm.notificationType === 'discipline' || ruleForm.notificationType === 'admin' ? true : false"
      >
        <el-input
          v-model="ruleForm.receiverId"
          placeholder="Enter Receiver Id "
        ></el-input>
      </el-form-item>
      <el-form-item label="Icon">
        <div class="main-image-container" v-if="ruleForm.notificationType.length == 0">
          <div class="container">
            <div class="image-container">
              <span class="svg-container">
                <svg-icon
                  icon-class="image_black"
                  style="width: 50px; height: 50px"
                />
              </span>
            </div>
          </div>
        </div>

        <div class="main-image-container" v-else>
          <el-image
            v-if="ruleForm.notificationType == 'announcement'"
            style="width: 100px; height: 100px"
            src="http://nothing:3000/push-notification/icon/announcement.png"
          >
          </el-image>

          <el-image
            v-if="ruleForm.notificationType == 'discipline'"
            style="width: 100px; height: 100px"
            src="http://nothing:3000/push-notification/icon/warning image.png"
          >
          </el-image>

          <el-image
            v-if="ruleForm.notificationType == 'admin'"
            style="width: 100px; height: 100px"
            src="http://nothing:3000/push-notification/icon/welocome.png"
          >
          </el-image>
        </div>
      </el-form-item>
      <el-form-item align="center">
        <el-button
          type="primary"
          size="mini"
          @click="
            submitForm(
              'ruleForm',
              ruleForm.title,
              ruleForm.description,
              ruleForm.notificationType,
              ruleForm.receiverId
            )
          "
          >Send Push</el-button
        >
        <el-button type="primary" size="mini" @click="resetForm('ruleForm')"
          >Reset</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>



<script>
import { sendPushNotification } from "@/api/notification";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      ruleForm: {
        title: "",
        description: "",
        receiverId: "",
        notificationType: "",
      },
      rules: {
        notificationType: [
          {
            required: true,
            message: "Please select type of notification you send",
            trigger: "change",
          },
        ],
        title: [
          {
            required: true,
            message: "Please Enter the title of notification",
            trigger: "blur",
          },
          { min: 3, message: "Length should be 3 or more", trigger: "blur" },
        ],
        description: [
          {
            required: true,
            message: "Please Enter the description of notification",
            trigger: "blur",
          },
          { min: 3, message: "Length should be 3 or more", trigger: "blur" },
        ],
        receiverId: [
          {
            required: true,
            message: "Please Enter receiverId id who receive notification",
            trigger: "blur",
          },
          { min: 3, message: "Length should be 3 or more", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["device", "id"]),
    responsiveWidth() {
      if (this.device === "mobile") {
        return "90%";
      } else {
        return "60%";
      }
    },
  },
  methods: {
    submitForm(formName, title, description, notificationType, receiverId) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          this.sendPush(title, description, notificationType, receiverId, this.id);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    sendPush(title, description, notificationType, receiverId, userId) {
      //conditional render
      let clicked = true;

      // check for service worker
      if ("serviceWorker" in navigator) {
        send().catch((err) => console.error(err));
      }

      // register service worker, register push, send push
      async function send(id) {
        // registering service worker
        const register = await navigator.serviceWorker.register(
          "/serviceWorker.js"
        );

        console.log("service worker registered...");

        // register push
        console.log("registering push");
        if (clicked) {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready
              .then(function (registration) {
                if (!registration.pushManager) {
                  console.log("Push manager unavailable.");
                  return;
                }
                sendNotification();
              })
              .catch(function (e) {
                console.error(
                  "An error ocurred during Service Worker registration.",
                  e
                );
              });
          }
        } else {
          console.log("Can not reachable to the service worker");
        }
        console.log("push registered");

        // send push notification
        function sendNotification() {
          console.log("sending push notification");
          let data;
          if (notificationType === "announcement") {
            data = {
              title: title,
              description: description,
              notificationImage: "http://nothing:3000/push-notification/icon/announcement.png",
              receiverId: null,
              notificationType: notificationType,
            };
          } else if (notificationType === "discipline") {
            data = {
              title: title,
              description: description,
              notificationImage:
                "http://nothing:3000/push-notification/icon/warning image.png",
              receiverId: receiverId,
              notificationType: notificationType,
            };
          } else if (notificationType === "admin") {
            data = {
              title: title,
              description: description,
              notificationImage: "http://nothing:3000/push-notification/icon/welocome.png",
              receiverId: receiverId,
              notificationType: notificationType,
            };
          }
          console.log("data inside vue: ", data);
          sendPushNotification(data, userId).then((response) => {});
          console.log("push notification sent");
        }
      }
    },
    errorHandler() {
      return true;
    },
  },
};

</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;
.form {
  width: 50%;
  margin-left: 30px;
}
.container {
  display: flex;
  display: inline-block;
  padding: 4px;
  width: 120px;
  height: 120px;
}
.image-container {
  text-align: center;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
.main-image-container {
  padding: 10px;
  display: flex;
  display: inline-block;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
}

.svg-container {
  /* color: $dark_gray; */
  align-items: center;
  vertical-align: middle;
  align-items: center;
  color: #95989d;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}
</style>



