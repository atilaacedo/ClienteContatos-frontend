<template>
    <div class="bg-white rounded-lg p-6 shadow">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold">Relatório de Clientes</h2>
            <Button label="Adicionar Cliente" icon="pi pi-plus" @click="$emit('add')" severity="contrast"
                class="gap-2 bg-[#1c1f1b] rounded-xl px-3 py-2 text-white" />
        </div>

        <DataTable :value="clientes" :loading="loading" paginator :rows="rows" :rowsPerPageOptions="[5, 10, 20]" lazy
            @page="onPageChange"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            :totalRecords="pages.total" currentPageReportTemplate="{first} to {last} of {totalRecords}"
            v-model:expandedRows="expandedRows" dataKey="id" stripedRows>
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
                            v-tooltip.top="'Editar'" class="text-blue-400" />
                        <Button icon="pi pi-trash" size="small" text rounded severity="danger"
                            @click="confirmDelete(data)" v-tooltip.top="'Excluir'" class="text-red-900" />
                    </div>
                </template>
            </Column>

            <template #expansion="{ data }">
                <div class="p-6 bg-gray-50">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg text-gray-600 m-0">Detalhes do Cliente: {{ data.nome_completo }}</h3>
                    </div>

                    <div class="grid grid-cols-2 gap-8 mb-6">
                        <div>
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">Endereços de Email:</h4>
                            <div v-for="(email, index) in data.emails" :key="index"
                                class="p-2 bg-white rounded-xl border border-gray-300 mb-2">
                                {{ email }}
                            </div>
                        </div>

                        <div>
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">Números de Telefone:</h4>
                            <div v-for="(telefone, index) in data.telefones" :key="index"
                                class="p-2 bg-white rounded-xl border border-gray-300 mb-2">
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

                        <DataTable v-if="data.contatos && data.contatos.length > 0" :value="data.contatos"
                            v-model:expandedRows="expandedRowsContatos" dataKey="id" size="small" stripedRows>
                            <Column expander style="width: 3rem" />

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

                            <template #expansion="{ data: contato }">
                                <div class="p-6 bg-gray-100">
                                    <div class="flex justify-between items-center mb-4">
                                        <h4 class="text-base text-gray-600 m-0">Detalhes do Contato: {{
                                            contato.nome_completo }}</h4>
                                    </div>

                                    <div class="grid grid-cols-2 gap-8">
                                        <div>
                                            <h5 class="text-sm font-semibold text-gray-700 mb-3">Endereços de Email:
                                            </h5>
                                            <div v-for="(email, index) in contato.emails" :key="index"
                                                class="p-2 bg-white rounded-xl border border-gray-300 mb-2">
                                                {{ email }}
                                            </div>
                                        </div>

                                        <div>
                                            <h5 class="text-sm font-semibold text-gray-700 mb-3">Números de Telefone:
                                            </h5>
                                            <div v-for="(telefone, index) in contato.telefones" :key="index"
                                                class="p-2 bg-white rounded-xl border border-gray-300 mb-2">
                                                {{ formatPhone(telefone) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </DataTable>

                        <div v-else class="text-center py-8 text-gray-600 italic">
                            <p>Nenhum contato associado</p>
                        </div>
                    </div>
                </div>
            </template>
        </DataTable>

        <ConfirmDialog />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

const props = defineProps({
    clientes: Array,
    loading: Boolean,
    pages: Object
});

const emit = defineEmits([
    'page-change',
    'add',
    'edit',
    'delete',
    'add-contato',
    'edit-contato',
    'delete-contato'
]);

const confirm = useConfirm();
const rows = ref(5);
const expandedRows = ref([]);
const expandedRowsContatos = ref([]);

const onPageChange = (event) => {
    rows.value = event.rows;
    emit('page-change', event.page + 1, event.rows);
};

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
        }
    });
};

const confirmDeleteContato = (contato, clienteId) => {
    confirm.require({
        message: `Tem certeza que deseja excluir o contato ${contato.nome_completo}?`,
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            emit('delete-contato', contato.id, clienteId);
        }
    });
};
</script>