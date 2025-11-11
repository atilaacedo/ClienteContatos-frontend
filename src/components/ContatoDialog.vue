<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Adicionar Contato' : 'Editar Contato'"
    :style="{ width: '600px' }"
    :modal="true"
  >
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <label for="nome" class="font-semibold text-sm text-gray-700">Nome Completo *</label>
        <InputText
          id="nome"
          v-model="formData.nome_completo"
          class="w-full"
          :class="{ 'p-invalid': errors.nome_completo }"
        />
        <small v-if="errors.nome_completo" class="text-red-600 text-sm">
          {{ errors.nome_completo }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-semibold text-sm text-gray-700">Emails *</label>
        <div v-for="(email, index) in formData.emails" :key="index" class="flex gap-2 items-center mb-2">
          <InputText
            v-model="formData.emails[index]"
            placeholder="email@exemplo.com"
            class="flex-1"
            :class="{ 'p-invalid': errors[`email_${index}`] }"
          />
          <Button
            v-if="formData.emails.length > 1"
            icon="pi pi-trash"
            severity="danger"
            text
            @click="removeEmail(index)"
          />
        </div>
        <Button
          label="Adicionar Email"
          icon="pi pi-plus"
          text
          size="small"
          @click="addEmail"
          class="mt-2"
        />
        <small v-if="errors.emails" class="text-red-600 text-sm">
          {{ errors.emails }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-semibold text-sm text-gray-700">Telefones *</label>
        <div v-for="(telefone, index) in formData.telefones" :key="index" class="flex gap-2 items-center mb-2">
          <InputMask
            v-model="formData.telefones[index]"
            mask="(99) 99999-9999"
            placeholder="(00) 00000-0000"
            class="flex-1"
            :class="{ 'p-invalid': errors[`telefone_${index}`] }"
          />
          <Button
            v-if="formData.telefones.length > 1"
            icon="pi pi-trash"
            severity="danger"
            text
            @click="removeTelefone(index)"
          />
        </div>
        <Button
          label="Adicionar Telefone"
          icon="pi pi-plus"
          text
          size="small"
          @click="addTelefone"
          class="mt-2"
        />
        <small v-if="errors.telefones" class="text-red-600 text-sm">
          {{ errors.telefones }}
        </small>
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        severity="secondary"
        @click="$emit('update:visible', false)"
      />
      <Button
        label="Salvar"
        @click="handleSave"
        :loading="saving"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Button from 'primevue/button';

const props = defineProps({
  visible: Boolean,
  contato: Object,
  mode: String
});

const emit = defineEmits(['update:visible', 'save']);

const formData = ref({
  nome_completo: '',
  emails: [''],
  telefones: ['']
});

const errors = ref({});
const saving = ref(false);

watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.mode === 'edit' && props.contato) {
      formData.value = {
        id: props.contato.id,
        nome_completo: props.contato.nome_completo,
        emails: [...props.contato.emails],
        telefones: [...props.contato.telefones]
      };
    } else {
      formData.value = {
        nome_completo: '',
        emails: [''],
        telefones: ['']
      };
    }
    errors.value = {};
  }
});

const addEmail = () => {
  formData.value.emails.push('');
};

const removeEmail = (index) => {
  formData.value.emails.splice(index, 1);
};

const addTelefone = () => {
  formData.value.telefones.push('');
};

const removeTelefone = (index) => {
  formData.value.telefones.splice(index, 1);
};

const validate = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.nome_completo.trim()) {
    errors.value.nome_completo = 'Nome completo é obrigatório';
    isValid = false;
  }

  const validEmails = formData.value.emails.filter(e => e.trim());
  if (validEmails.length === 0) {
    errors.value.emails = 'Pelo menos um email é obrigatório';
    isValid = false;
  } else {
    validEmails.forEach((email, index) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.value[`email_${index}`] = 'Email inválido';
        isValid = false;
      }
    });
  }

  const validTelefones = formData.value.telefones.filter(t => t.trim());
  if (validTelefones.length === 0) {
    errors.value.telefones = 'Pelo menos um telefone é obrigatório';
    isValid = false;
  }

  return isValid;
};

const handleSave = async () => {
  if (!validate()) return;

  saving.value = true;
  
  const dataToSave = {
    ...formData.value,
    emails: formData.value.emails.filter(e => e.trim()),
    telefones: formData.value.telefones.filter(t => t.trim())
  };

  emit('save', dataToSave);
  saving.value = false;
};
</script>