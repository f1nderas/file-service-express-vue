<template>
    <div class="auth-form">
        <h2>{{ isSignUp ? 'Sign Up' : "Sign In" }}</h2>
        <form @submit.prevent="submit">
            <input v-model="id" type="text" placeholder="ID (email/phone)" required />
            <input v-model="password" type="text" placeholder="Password" required />
            <button type="submit">{{ isSignUp ? 'Sign Up' : 'Sign In' }}</button>
        </form>
        <button @click="toggleMode" class="toggle-btn">
            {{ isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { authService } from '@/services/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const id = ref<string>('')
const password = ref<string>('')
const isSignUp = ref<boolean>(false)

const router = useRouter()

const submit = async () => {
    try {
        const { data } = isSignUp.value ? await authService.signUp(id.value, password.value) : await authService.signIn(id.value, password.value)
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        router.push('/')
    } catch (error) {
        console.error('Auth error', error)
        alert('Authentication failed')
    }
}

const toggleMode = () => {
    isSignUp.value = !isSignUp.value
}
</script>

<style scoped>
.auth-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 8px;
}

button {
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    cursor: pointer;
}

.toggle-btn {
    margin-top: 10px;
    background-color: #35495e;
}
</style>