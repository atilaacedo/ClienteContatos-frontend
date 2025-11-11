<template>
  <div class="p-8 ">
  
    <ClientesTable :clientes="clientes" :loading="loading" @add="handleAdd" @edit="handleEdit" @delete="handleDelete"
      @add-contato="handleAddContato" @edit-contato="handleEditContato" @delete-contato="handleDeleteContato" />

    <ClienteDialog v-model:visible="dialogVisible" :cliente="selectedCliente" :mode="dialogMode"
      @save="handleSaveCliente" />

    <ContatoDialog v-model:visible="contatoDialogVisible" :contato="selectedContato" :mode="contatoDialogMode"
      @save="handleSaveContato" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ClientesTable from '../components/ClientesTable.vue';
import ClienteDialog from '../components/ClienteDialog.vue';
import ContatoDialog from '../components/ContatoDialog.vue';
import { useToast } from 'primevue/usetoast';

const apiBase = 'http://localhost:8000/api';

const toast = useToast();
const clientes = ref([]);
const loading = ref(false);

const dialogVisible = ref(false);
const dialogMode = ref('create');
const selectedCliente = ref(null);

const contatoDialogVisible = ref(false);
const contatoDialogMode = ref('create');
const selectedContato = ref(null);
const currentClienteId = ref(null);

const loadClientes = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${apiBase}/reports/clientes-with-contatos`);
    const data = await response.json();
    clientes.value = data.data;
  } catch (error) {
    
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao carregar clientes',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  selectedCliente.value = null;
  dialogMode.value = 'create';
  dialogVisible.value = true;
};

const handleEdit = (cliente) => {
  selectedCliente.value = { ...cliente };
  dialogMode.value = 'edit';
  dialogVisible.value = true;
};

const handleDelete = async (clienteId) => {
  try {
    await fetch(`${apiBase}/clientes/${clienteId}`, {
      method: 'DELETE'
    });
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Cliente excluído com sucesso',
      life: 3000
    });
    await loadClientes();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao excluir cliente',
      life: 3000
    });
  }
};

const handleSaveCliente = async (clienteData) => {
  try {
    const url = dialogMode.value === 'create'
      ? `${apiBase}/clientes`
      : `${apiBase}/clientes/${clienteData.id}`;

    const method = dialogMode.value === 'create' ? 'POST' : 'PUT';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteData)
    });

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Cliente ${dialogMode.value === 'create' ? 'criado' : 'atualizado'} com sucesso`,
      life: 3000
    });

    dialogVisible.value = false;
    await loadClientes();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao salvar cliente',
      life: 3000
    });
  }
};

const handleAddContato = (clienteId) => {
  currentClienteId.value = clienteId;
  selectedContato.value = null;
  contatoDialogMode.value = 'create';
  contatoDialogVisible.value = true;
};

const handleEditContato = (contato, clienteId) => {
  currentClienteId.value = clienteId;
  selectedContato.value = { ...contato };
  contatoDialogMode.value = 'edit';
  contatoDialogVisible.value = true;
};

const handleDeleteContato = async (contatoId, clienteId) => {
  try {
    await fetch(`${apiBase}/contatos/${contatoId}`, {
      method: 'DELETE'
    });
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Contato excluído com sucesso',
      life: 3000
    });
    await loadClientes();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao excluir contato',
      life: 3000
    });
  }
};

const handleSaveContato = async (contatoData) => {
  try {
    const url = contatoDialogMode.value === 'create'
      ? `${apiBase}/contatos`
      : `${apiBase}/contatos/${contatoData.id}`;

    const method = contatoDialogMode.value === 'create' ? 'POST' : 'PUT';

    const payload = contatoDialogMode.value === 'create'
      ? { ...contatoData, cliente_id: currentClienteId.value }
      : contatoData;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Contato ${contatoDialogMode.value === 'create' ? 'criado' : 'atualizado'} com sucesso`,
      life: 3000
    });

    contatoDialogVisible.value = false;
    await loadClientes();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao salvar contato',
      life: 3000
    });
  }
};

onMounted(() => {
  loadClientes();
});
</script>