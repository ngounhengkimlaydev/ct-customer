<template>
  <UModal v-model:open="open" :ui="{
    content: 'max-w-4xl'
  }">
    <template #content>
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-bold text-highlighted">
              {{ item ? 'Edit Database User' : 'Create Database User' }}
            </h3>

            <p class="text-sm text-muted">
              Manage username, host access, password, assigned databases, and privileges.
            </p>
          </div>
        </template>

        <UForm :schema="schema" :state="form" class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit="submit">
          <UFormField label="Username" name="username" required>
            <UInput v-model="form.username" icon="i-lucide-user" placeholder="example_user" class="w-full" />
          </UFormField>

          <UFormField label="Host" name="host" required>
            <UInput v-model="form.host" icon="i-lucide-globe" placeholder="localhost" class="w-full" />
          </UFormField>

          <UFormField label="Password" name="password" :required="!item" class="md:col-span-2">
            <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'" icon="i-lucide-key-round"
              :placeholder="item ? 'Leave empty to keep current password' : 'Enter password'" class="w-full">
              <template #trailing>
                <div class="flex items-center gap-1">
                  <UButton color="neutral" variant="ghost" size="xs" icon="i-lucide-refresh-cw"
                    @click="generatePassword" />

                  <UButton color="neutral" variant="ghost" size="xs"
                    :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" @click="showPassword = !showPassword" />
                </div>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Status" name="status" required>
            <USelect v-model="form.status" :items="statusOptions" value-key="value" class="w-full" />
          </UFormField>

          <UFormField label="Auth Type" name="authType" required>
            <USelect v-model="form.authType" :items="authTypeOptions" value-key="value" class="w-full" />
          </UFormField>

          <UFormField label="Assigned Databases" name="assignedDatabases" class="md:col-span-2" required>
            <USelectMenu v-model="form.assignedDatabases" :items="databaseOptions" multiple class="w-full" />
          </UFormField>

          <UFormField label="Privileges" name="privileges" class="md:col-span-2" required>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <label v-for="privilege in privilegeOptions" :key="privilege.value"
                class="flex items-center gap-2 rounded-xl border border-default p-3">
                <UCheckbox :model-value="form.privileges.includes(privilege.value)"
                  @update:model-value="togglePrivilege(privilege.value)" />

                <span class="text-sm font-medium text-highlighted">
                  {{ privilege.label }}
                </span>
              </label>
            </div>
          </UFormField>

          <div class="md:col-span-2 flex justify-end gap-2">
            <UButton color="neutral" variant="soft" @click="open = false">
              Cancel
            </UButton>

            <UButton type="submit" icon="i-lucide-save">
              {{ item ? 'Save Changes' : 'Create User' }}
            </UButton>
          </div>
        </UForm>
      </UCard>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import type {
  DatabasePrivilege,
  DatabaseUser,
  DatabaseUserForm
} from '~/types/database-user'

type SelectOption = {
  label: string
  value: string
}

const props = defineProps<{
  item: DatabaseUser | null
  statusOptions: SelectOption[]
  authTypeOptions: SelectOption[]
  privilegeOptions: {
    label: string
    value: DatabasePrivilege
  }[]
}>()

const databaseOptions = [
  {
    label: 'my_app_db',
    value: 'my_app_db'
  },
  {
    label: 'analytics_db',
    value: 'analytics_db'
  }
]

const emit = defineEmits<{
  submit: [form: DatabaseUserForm]
}>()

const open = defineModel<boolean>('open', {
  default: false
})

const showPassword = ref(false)

const schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters'),

  host: z
    .string()
    .min(1, 'Host is required'),

  password: z
    .string()
    .optional(),

  status: z
    .string()
    .min(1, 'Status is required'),

  authType: z
    .string()
    .min(1, 'Auth type is required'),

  assignedDatabases: z
    .string()
    .min(1, 'Assigned database is required'),

  privileges: z
    .array(z.string())
    .min(1, 'Please select at least one privilege')
}).superRefine((data, ctx) => {
  if (!props.item && !data.password?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['password'],
      message: 'Password is required'
    })
  }
})

const form = reactive<DatabaseUserForm>({
  username: '',
  host: 'localhost',
  password: '',
  status: 'active',
  authType: 'password',
  assignedDatabases: '',
  privileges: ['select', 'insert', 'update', 'delete']
})

watch(open, (value) => {
  if (!value) return

  if (props.item) {
    Object.assign(form, {
      username: props.item.username,
      host: props.item.host,
      password: '',
      status: props.item.status,
      authType: props.item.authType,
      assignedDatabases: props.item.assignedDatabases.join(', '),
      privileges: [...props.item.privileges]
    })

    return
  }

  resetForm()
})

function resetForm() {
  Object.assign(form, {
    username: '',
    host: 'localhost',
    password: '',
    status: 'active',
    authType: 'password',
    assignedDatabases: '',
    privileges: ['select', 'insert', 'update', 'delete']
  })
}

function togglePrivilege(value: DatabasePrivilege) {
  if (form.privileges.includes(value)) {
    form.privileges = form.privileges.filter((item) => item !== value)

    return
  }

  form.privileges = [...form.privileges, value]
}

function generatePassword() {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'

  form.password = Array.from({ length: 18 }, () => {
    return chars[Math.floor(Math.random() * chars.length)]
  }).join('')
}

function submit() {
  emit('submit', { ...form })

  open.value = false
}
</script>