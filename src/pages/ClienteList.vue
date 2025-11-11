<template>
  <div class="p-8 ">

    <Button label="Gerar Relatório em Pdf" icon="pi pi-file-pdf" class="p-button-danger mb-4"
    @click="openPdfReport"/>
    <ClientesTable :clientes="clientes" :pages="pagesInfo" :loading="loading" @page-change="loadClientes"
      @add="handleAdd" @edit="handleEdit" @delete="handleDelete" @add-contato="handleAddContato"
      @edit-contato="handleEditContato" @delete-contato="handleDeleteContato" />

    <ClienteDialog v-model:visible="dialogVisible" :cliente="selectedCliente" :mode="dialogMode"
      @save="handleSaveCliente" :loading="loading" />

    <ContatoDialog v-model:visible="contatoDialogVisible" :contato="selectedContato" :mode="contatoDialogMode"
      @save="handleSaveContato" :loading="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ClientesTable from '../components/ClientesTable.vue';
import ClienteDialog from '../components/ClienteDialog.vue';
import ContatoDialog from '../components/ContatoDialog.vue';
import { Button } from 'primevue';

const apiBase = 'http://localhost:8000/api';

const clientes = ref([]);
const pagesInfo = ref({});
const loading = ref(false);

const dialogVisible = ref(false);
const dialogMode = ref('create');
const selectedCliente = ref(null);

const contatoDialogVisible = ref(false);
const contatoDialogMode = ref('create');
const selectedContato = ref(null);
const currentClienteId = ref(null);

const openPdfReport = () => {
  window.open(`${apiBase}/reports/clientes-with-contatos/pdf`, '_blank');
};

const loadClientes = async (page = 1, rows = 5) => {
  loading.value = true;
  try {
    const response = await fetch(`${apiBase}/reports/clientes-with-contatos?page=${page}&per_page=${rows}`);
    const data = await response.json();
    clientes.value = data.data;
    pagesInfo.value = {
      total: data.meta.total,
      per_page: data.meta.per_page,
      current_page: data.meta.current_page,
      last_page: data.meta.last_page
    };
  } catch (error) {
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

    await loadClientes();
  } catch (error) {

  }
};

const handleSaveCliente = async (clienteData) => {
  try {
    loading.value = true;
    const url = dialogMode.value === 'create'
      ? `${apiBase}/clientes`
      : `${apiBase}/clientes/${clienteData.id}`;

    const method = dialogMode.value === 'create' ? 'POST' : 'PUT';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteData)
    });



    dialogVisible.value = false;
    await loadClientes();
  } catch (error) {
  } finally {
    loading.value = false;
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
    await loadClientes();
  } catch (error) {
  }
};

const handleSaveContato = async (contatoData) => {
  try {
    loading.value = true;
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



    contatoDialogVisible.value = false;
    await loadClientes();
  } catch (error) {

  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadClientes();
});
</script>