<template>
    <div class="bg-white rounded-lg p-6 shadow">
        <div class="flex justify-between items-center mb-6 ">
            <h2 class="text-2xl font-semibold!">Relatório de Clientes</h2>
            <Button label="Adicionar Cliente" icon="pi pi-plus" @click="$emit('add')" severity="contrast" 
            class="gap-2! bg-[#1c1f1b]! rounded-xl! px-3 py-2 text-white"/>
        </div>

        <DataTable :value="clientes" :loading="loading" v-model:expandedRows="expandedRows" dataKey="id" stripedRows>
            <Column expander style="width: 3rem" />

            <Column field="nome_completo" header="Nome Completo" />

            <Column field="data_registro" header="Data de Registro">
                <template #body="{ data }">
                    {{ formatDate(data.data_registro) }}
                </template>
            </Column>

            <Column field="emails" header="Emails">
                <template #body="{ data }">
                    {{ data.emails[0] }}
                    <span v-if="data.emails.length > 1" class="text-gray-600 text-sm ml-2">
                        +{{ data.emails.length - 1 }} mais
                    </span>
                </template>
            </Column>

            <Column field="telefones" header="Telefones">
                <template #body="{ data }">
                    {{ formatPhone(data.telefones[0]) }}
                    <span v-if="data.telefones.length > 1" class="text-gray-600 text-sm ml-2">
                        +{{ data.telefones.length - 1 }} mais
                    </span>
                </template>
            </Column>

            <Column header="Ações" style="width: 150px">
                <template #body="{ data }">
                    <div class="flex gap-3">
                        <Button icon="pi pi-pencil" size="small" text rounded @click="$emit('edit', data)"
                            v-tooltip.top="'Editar'" 
                            class="text-blue-400!"/>
                        <Button icon="pi pi-trash" size="small" text rounded severity="danger"
                            @click="confirmDelete(data)" v-tooltip.top="'Excluir'" 
                            class="text-red-900!"/>
                    </div>
                </template>
            </Column>

            <template #expansion="{ data }">
                <div class="p-6 bg-gray-50!">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg text-gray-600! m-0">Detalhes do Cliente: {{ data.nome_completo }}</h3>
                    </div>

                    <div class="grid grid-cols-2 gap-8 mb-6">
                        <div>
                            <h4 class="text-sm font-semibold! text-gray-700! mb-3">Endereços de Email:</h4>
                            <div v-for="(email, index) in data.emails" :key="index"
                                class="p-2 bg-white rounded-xl border border-gray-300! mb-2">
                                {{ email }}
                            </div>
                        </div>

                        <div>
                            <h4 class="text-sm font-semibold! text-gray-700! mb-3">Números de Telefone:</h4>
                            <div v-for="(telefone, index) in data.telefones" :key="index"
                                class="p-2 bg-white! rounded-xl border border-gray-300! mb-2">
                                {{ formatPhone(telefone) }}
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-300">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-base font-semibold m-0">Contatos Associados</h4>
                            <Button label="Adicionar Contato" icon="pi pi-plus" size="small"
                                @click="$emit('add-contato', data.id)" />
                        </div>

                        <DataTable v-if="data.contatos && data.contatos.length > 0" :value="data.contatos" size="small">
                            <Column field="nome_completo" header="Nome Completo" />

                            <Column field="emails" header="Emails">
                                <template #body="{ data: contato }">
                                    {{ contato.emails[0] }}
                                    <span v-if="contato.emails.length > 1" class="text-gray-600 text-sm ml-2">
                                        +{{ contato.emails.length - 1 }} mais
                                    </span>
                                </template>
                            </Column>

                            <Column field="telefones" header="Telefones">
                                <template #body="{ data: contato }">
                                    {{ formatPhone(contato.telefones[0]) }}
                                    <span v-if="contato.telefones.length > 1" class="text-gray-600 text-sm ml-2">
                                        +{{ contato.telefones.length - 1 }} mais
                                    </span>
                                </template>
                            </Column>

                            <Column header="Ações" style="width: 120px">
                                <template #body="{ data: contato }">
                                    <div class="flex gap-1 justify-center">
                                        <Button icon="pi pi-pencil" size="small" text rounded
                                            @click="$emit('edit-contato', contato, data.id)" v-tooltip.top="'Editar'" />
                                        <Button icon="pi pi-trash" size="small" text rounded severity="danger"
                                            @click="confirmDeleteContato(contato, data.id)" v-tooltip.top="'Excluir'" />
                                    </div>
                                </template>
                            </Column>
                        </DataTable>

                        <div v-else class="text-center py-8 text-gray-600! italic!">
                            <p>Nenhum contato associado</p>
                        </div>
                    </div>
                </div>
            </template>
        </DataTable>

       <ConfirmDialog></ConfirmDialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue';

const props = defineProps({
    clientes: Array,
    loading: Boolean
});

const emit = defineEmits([
    'add',
    'edit',
    'delete',
    'add-contato',
    'edit-contato',
    'delete-contato'
]);

const confirm = useConfirm();

const expandedRows = ref([]);
const expandedRowsContatos = ref([]);
const confirmDialogVisible = ref(false);
const confirmData = ref(null);

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    }
    return phone;
};

const confirmDelete = (cliente) => {

    confirm.require({
        message: `Tem certeza que deseja excluir o cliente ${cliente.nome_completo}?`,
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            emit('delete', cliente.id);
        },
    });
    confirmData.value = {
        type: 'cliente',
        data: cliente
    };
    confirmDialogVisible.value = true;
};

const confirmDeleteContato = (contato, clienteId) => {
    confirmData.value = {
        type: 'contato',
        data: contato,
        clienteId: clienteId
    };
    confirmDialogVisible.value = true;
};

const handleConfirmAccept = () => {
    if (confirmData.value.type === 'cliente') {
        emit('delete', confirmData.value.data.id);
    } else {
        emit('delete-contato', confirmData.value.data.id, confirmData.value.clienteId);
    }
    confirmDialogVisible.value = false;
};

const handleConfirmReject = () => {
    confirmDialogVisible.value = false;
    confirmData.value = null;
};
</script>