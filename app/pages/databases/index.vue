<template>
  <div v-if="canView" class="space-y-6">
    <DatabaseHeader :can-create="canCreate" @refresh="refresh" @create="openCreate" />
    <DatabaseStats :items="databases" />
    <DatabaseToolbar :search="search" :status="selectedStatus" :engine="selectedEngine"
      :status-options="statusFilterOptions" :engine-options="engineFilterOptions" @update:search="search = $event"
      @update:status="selectedStatus = $event" @update:engine="selectedEngine = $event" />
    <UCard :ui="{ body: 'space-y-4' }">
      <DatabaseSkeleton v-if="loading" :count="4" />
      <DatabaseList v-else :items="filteredDatabases" :total="databases.length" :can-update="canUpdate"
        :can-delete="canDelete" @view="viewDatabase" @backup="backupDatabase" @delete="deleteDatabase" />
    </UCard>
    <UModal v-model:open="openCreateModal">
      <template #content>
        <UCard>
          <template #header>
            <div>
              <h2 class="text-lg font-bold text-highlighted">
                Create Database
              </h2>

              <p class="text-sm text-muted">
                Create a new database and database user.
              </p>
            </div>
          </template>

          <UForm :schema="schema" :state="form" class="space-y-4" @submit.prevent="createDatabase">

            <UFormField label="Database Username" name="db_username" required>
              <UInput v-model="form.db_username" placeholder="example_user" icon="i-lucide-user" class="w-full" />
            </UFormField>

            <UFormField label="Password" name="db_password" required>
              <UInput v-model="form.db_password" :type="showPassword ? 'text' : 'password'"
                placeholder="Enter strong database password" icon="i-lucide-key-round" class="w-full">
                <template #trailing>
                  <div class="flex items-center gap-1">
                    <UButton color="neutral" variant="ghost" size="xs" icon="i-lucide-refresh-cw"
                      @click="generatePassword" />

                    <UButton color="neutral" variant="ghost" size="xs"
                      :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      @click="showPassword = !showPassword" />
                  </div>
                </template>
              </UInput>
            </UFormField>

            <UFormField label="Database Engine" name="engine_type" required>
              <USelect v-model="form.engine_type" :items="[
                {
                  label: 'MySQL',
                  value: 'mysql'
                },
                {
                  label: 'MariaDB',
                  value: 'mariadb'
                },
                {
                  label: 'PostgreSQL',
                  value: 'postgresql'
                }
              ]" value-key="value" class="w-full" />
            </UFormField>
            <div class="flex justify-end gap-2 pt-4">
              <UButton color="neutral" variant="soft" @click="openCreateModal = false">
                Cancel
              </UButton>

              <UButton icon="i-lucide-plus" type="submit">
                Create Database
              </UButton>
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>
  </div>

  <UCard v-else>
    <div class="py-16 text-center">
      <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted">
        <UIcon name="i-lucide-lock" class="size-7" />
      </div>

      <h2 class="mt-4 text-lg font-bold text-highlighted">Permission denied</h2>
      <p class="mt-1 text-sm text-muted">
        You do not have permission to view databases.
      </p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import DatabaseHeader from '~/components/databases/DatabaseHeader.vue'
import DatabaseList from '~/components/databases/DatabaseList.vue'
import DatabaseStats from '~/components/databases/DatabaseStats.vue'
import DatabaseToolbar from '~/components/databases/DatabaseToolbar.vue'
import type {
  DatabaseCreateForm,
  DatabaseEngine,
  DatabaseItem,
  DatabaseStatus
} from '~/types/database'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import DatabaseSkeleton from '~/components/databases/DatabaseSkeleton.vue'

const api = useApiFetch()
const loading = ref(false)
const DATABASE_MODULE_KEY = 'database'
const CREATE_DB_MODULE_KEY = 'create_db'

const currentPermissions = ref([
  {
    module_key: DATABASE_MODULE_KEY,
    permission_name: 'view'
  },
  {
    module_key: DATABASE_MODULE_KEY,
    permission_name: 'update'
  },
  {
    module_key: DATABASE_MODULE_KEY,
    permission_name: 'delete'
  },
  {
    module_key: CREATE_DB_MODULE_KEY,
    permission_name: 'create'
  }
])

function hasPermission(moduleKey: string, permissionName: string) {
  return currentPermissions.value.some(
    (item) =>
      item.module_key === moduleKey &&
      item.permission_name === permissionName
  )
}

const schema = z.object({
  db_username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username is too long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Only letters, numbers and underscores are allowed'
    ),

  db_password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),

  engine_type: z.enum([
    'mysql',
    'mariadb',
    'postgresql'
  ])
})

const form = reactive<DatabaseCreateForm>({
  db_username: '',
  db_password: '',
  engine_type: 'mysql'
})

function resetForm() {
  Object.assign(form, {
    db_username: '',
    db_password: '',
    engine_type: 'mysql'
  })
}

const canView = computed(() => hasPermission(DATABASE_MODULE_KEY, 'view'))
const canCreate = computed(() => hasPermission(CREATE_DB_MODULE_KEY, 'create'))
const canUpdate = computed(() => hasPermission(DATABASE_MODULE_KEY, 'update'))
const canDelete = computed(() => hasPermission(DATABASE_MODULE_KEY, 'delete'))

const search = ref('')
const selectedStatus = ref('all')
const selectedEngine = ref('all')
const openCreateModal = ref(false)
const showPassword = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const databases = ref<DatabaseItem[]>([])

const statusFilterOptions = [
  {
    label: 'All Status',
    value: 'all'
  },
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Suspended',
    value: 'suspended'
  },
  {
    label: 'Error',
    value: 'error'
  }
]

const engineFilterOptions = [
  {
    label: 'All Engines',
    value: 'all'
  },
  {
    label: 'MySQL',
    value: 'mysql'
  },
  {
    label: 'MariaDB',
    value: 'mariadb'
  },
  {
    label: 'PostgreSQL',
    value: 'postgresql'
  }
]

const filteredDatabases = computed(() => {
  const keyword = search.value.toLowerCase().trim()

  return databases.value.filter((item) => {
    const matchSearch =
      !keyword ||
      item.db_username.toLowerCase().includes(keyword) ||
      item.host.toLowerCase().includes(keyword)

    const matchEngine =
      selectedEngine.value === 'all' ||
      item.engine_type === selectedEngine.value as DatabaseEngine

    return matchSearch && matchEngine
  })
})

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  form.db_password = Array.from({ length: 18 }, () => {
    return chars[Math.floor(Math.random() * chars.length)]
  }).join('')
}

function viewDatabase(item: DatabaseItem) {

}

function backupDatabase(item: DatabaseItem) {

}

function deleteDatabase(item: DatabaseItem) {

}


async function createDatabase(
  event: FormSubmitEvent<z.output<typeof schema>>
) {
  await api.post('/database', event.data)

  resetForm()
  openCreateModal.value = false
  await getData()
}
const getData = async () => {
  loading.value = true
  try {
    const res = await api.paginate('/database', {
      page: page.value,
      table_size: pageSize.value,
      filter: {
        search: search.value.trim(),
        // status: status.value === 'all' ? undefined : Number(status.value),
      },
      sort_by: 'created_at',
      sort_type: 'desc'
    })

    databases.value = res?.data ?? []
    total.value = res?.pagination?.total ?? res?.total ?? 0
  } finally {
    loading.value = false
  }
}

function refresh() {
  getData()
}

function openCreate() {
  openCreateModal.value = true
}

onMounted(() => {
  getData()
})
</script>