<template>
    <div class="app-container">
        <div v-if="user">
            <el-row :gutter="20">
                
                <el-col :span="6" :xs="24">
                    <user-card :user="user" />
                </el-col>

                <el-col :span="18" :xs="24">
                    <el-card>
                        <el-tabs v-model="activeTab">
                            <el-tab-pane label="Account" name="account">
                                <account :user="user" />
                            </el-tab-pane>
                            <el-tab-pane label="Change Password" name="changePassword">
                                <change-password :user="user" />
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </el-col>

            </el-row>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import ChangePassword from './components/ChangePassword'

export default {
    name: 'Profile',
    components: { UserCard, Account, ChangePassword },
    data() {
        return {
            user: {},
            activeTab: 'account'
        }
    },
    computed: {
        ...mapGetters([
            'id',
            'firstName',
            'lastName',
            'profilePicture',
            'roles',
            'email'
        ])
    },
    created() {
        this.getUser()
    },
    methods: {
        getUser() {
            this.user = {
                id: this.id,
                firstName: this.firstName,
                lastName: this.lastName,
                role: this.roles.join(' | '),
                email: this.email,
                profilePicture: this.profilePicture
            }
        }
    }
}
</script>