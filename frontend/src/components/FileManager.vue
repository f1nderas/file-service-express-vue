<template>
    <div class="file-manager">
        <h2>File Manager</h2>
        <input type="file" @change="handleFileUpload">
        <ul v-if="files.length">
            <li v-for="file in files" :key="file.id">
                {{ file.name }} ({{ file.size }} bytes)
                <button @click="handleFileDownload(file.id)">Download</button>
                <button @click="handleFileDelete(file.id)">Delete</button>
                <input type="file" @change="handleFileUpdate(file.id, $event)">
            </li>
        </ul>
        <p v-else>No files available</p>
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup lang="ts">
import { authService, fileService } from '@/services/api';
import type { IFileItem } from '@/types';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const files = ref<IFileItem[]>([])
const router = useRouter()

const refershFiles = async () => {
    const { data } = await fileService.getFileList()
    files.value = data
}

const handleFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
        console.log('Access token:', localStorage.getItem('accessToken'))
        console.log('Refresh token:', localStorage.getItem('refreshToken'))
        await fileService.uploadFile(file)
        await refershFiles()
    }
}

const handleFileUpdate = async (id: number, event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {

        await fileService.updatefile(id, file)
        await refershFiles()
    }
}

const handleFileDelete = async (id: number) => {
    await fileService.deleteFile(id)
    await refershFiles()
}

const handleFileDownload = async (id: number) => {
    const { data, headers } = await fileService.downloadFile(id)
    const mimeType = headers['content-type']
    const contentDisposition = headers['content-disposition']
    const fileName = contentDisposition ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') : `file-${id}`
    const blob = new Blob([data], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}


const logout = async () => {
    await authService.logout()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/auth')
}

onMounted(async () => {
    try {
        await refershFiles()
    } catch (error) {
        console.error('Failed to load files: ', error)
    }
})
</script>

<style scoped>
.file-manager {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
}

button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #42b983;
    color: white;
    border: none;
    cursor: pointer;
}

input[type='file'] {
    margin-left: 10px;
}
</style>