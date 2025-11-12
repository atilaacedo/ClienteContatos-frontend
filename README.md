# ClienteContatos Frontend

Interface web moderna desenvolvida em Vue 3 para gerenciamento de clientes e seus contatos associados, implementada como parte do desafio técnico fullstack.

## 📋 Sobre o Projeto

Aplicação frontend que consome a API RESTful de gerenciamento de clientes e contatos, oferecendo uma interface intuitiva e responsiva para todas as operações CRUD, visualização de relatórios e gerenciamento individual de emails e telefones.

## 🚀 Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript progressivo
- **Vite** - Build tool e dev server
- **PrimeVue 4** - Biblioteca de componentes UI
- **Tailwind CSS** - Framework CSS utility-first
- **JavaScript** (Composition API)

## ✨ Funcionalidades

### Gerenciamento de Clientes
- ✅ Listagem paginada de clientes
- ✅ Cadastro de novos clientes
- ✅ Edição de clientes existentes
- ✅ Exclusão de clientes com confirmação
- ✅ Visualização expandida com todos os detalhes
- ✅ Múltiplos emails e telefones por cliente

### Gerenciamento de Contatos
- ✅ Listagem de contatos por cliente
- ✅ Cadastro de contatos vinculados
- ✅ Edição de contatos existentes
- ✅ Exclusão de contatos com confirmação
- ✅ Visualização expandida com todos os detalhes
- ✅ Múltiplos emails e telefones por contato

### Interface e UX
- ✅ Design moderno e responsivo
- ✅ Diálogos de confirmação para ações destrutivas
- ✅ Loading states durante requisições
- ✅ Validação de formulários em tempo real
- ✅ Máscaras de input para telefones
- ✅ Paginação com controle de itens por página
- ✅ Tabelas expansíveis (clientes e contatos)

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ ou superior
- npm ou yarn
- API backend rodando (veja [ClienteContatos-api](https://github.com/atilaacedo/ClienteContatos-api))

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/atilaacedo/ClienteContatos-frontend.git
cd ClienteContatos-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**

Crie um arquivo `.env` na raiz do projeto (opcional):
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Ou edite diretamente no arquivo `src/pages/ClientesPage.vue`:
```javascript
const apiBase = 'http://localhost:8000/api';
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`


## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ClientesTable.vue      # Tabela de clientes com paginação e expansão
│   ├── ClienteDialog.vue      # Modal de cadastro/edição de clientes
│   └── ContatoDialog.vue      # Modal de cadastro/edição de contatos
├── pages/
│   └── ClientesPage.vue       # Página principal com lógica de negócio
├── assets/                     # Arquivos estáticos
├── main.js                     # Ponto de entrada da aplicação
└── App.vue                     # Componente raiz
```

## 🎨 Componentes Principais

### ClientesPage.vue
Componente principal que gerencia:
- Estado global da aplicação
- Comunicação com a API
- Controle de modais
- Paginação de dados

### ClientesTable.vue
Tabela interativa que exibe:
- Lista paginada de clientes
- Expansão para visualizar detalhes completos
- Tabela aninhada de contatos associados
- Ações de editar e excluir
- Formatação de datas e telefones

### ClienteDialog.vue
Modal para gestão de clientes:
- Formulário com validação
- Campos dinâmicos para múltiplos emails
- Campos dinâmicos para múltiplos telefones
- Máscara de input para telefones
- Modo criação e edição

### ContatoDialog.vue
Modal para gestão de contatos:
- Formulário com validação
- Campos dinâmicos para múltiplos emails
- Campos dinâmicos para múltiplos telefones
- Máscara de input para telefones
- Modo criação e edição
- Vinculação automática ao cliente

## 🎯 Fluxo de Uso

### Cadastrar Cliente
1. Clique em "Adicionar Cliente"
2. Preencha nome completo
3. Adicione um ou mais emails
4. Adicione um ou mais telefones
5. Clique em "Salvar"

![alt text](/cliente-contato-front/screenshots/image.png)

### Visualizar Detalhes do Cliente
1. Clique na seta de expansão na linha do cliente
2. Visualize todos os emails e telefones
3. Veja os contatos associados

![alt text](/cliente-contato-front/screenshots/image-1.png)

### Editar Cliente
1. Clique no ícone de lápis na linha do cliente
2. Modifique os campos desejados
3. Adicione/remova emails e telefones
4. Clique em "Salvar"

![alt text](/cliente-contato-front/screenshots/image-2.png)


### Excluir Cliente
1. Clique no ícone de lixeira na linha do cliente
2. Confirme a ação no diálogo
3. O cliente e todos os seus contatos serão removidos

![alt text](/cliente-contato-front/screenshots/image-3.png)

### Gerenciar Contatos
1. Expanda um cliente
2. Clique em "Adicionar Contato"
3. Preencha os dados do contato
4. O contato ficará vinculado ao cliente
5. Use as ações de editar/excluir conforme necessário

![alt text](/cliente-contato-front/screenshots/image-4.png)

### Visualizar Detalhes do Contato
1. Expanda um cliente
2. Clique na seta de expansão na linha do contato
3. Visualize todos os emails e telefones do contato

![alt text](/cliente-contato-front/screenshots/image-5.png)

## 🎨 Personalização de Tema

O projeto utiliza PrimeVue 4 com tema Aura. Para personalizar as cores primárias, edite o arquivo CSS principal:

```css
:root {
  --p-primary-50: #f0f9ff;
  --p-primary-100: #e0f2fe;
  --p-primary-200: #bae6fd;
  --p-primary-300: #7dd3fc;
  --p-primary-400: #38bdf8;
  --p-primary-500: #0ea5e9;
  --p-primary-600: #0284c7;
  --p-primary-700: #0369a1;
  --p-primary-800: #075985;
  --p-primary-900: #0c4a6e;
  --p-primary-950: #082f49;
}
```

## 🔌 Integração com a API

A aplicação consome os seguintes endpoints:

### Clientes
- `GET /api/reports/clientes-with-contatos?page={page}&per_page={rows}` - Lista clientes com contatos
- `POST /api/clientes` - Cria novo cliente
- `PUT /api/clientes/{id}` - Atualiza cliente
- `DELETE /api/clientes/{id}` - Remove cliente

### Contatos
- `POST /api/contatos` - Cria novo contato
- `PUT /api/contatos/{id}` - Atualiza contato
- `DELETE /api/contatos/{id}` - Remove contato

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se de que a API está configurada para aceitar requisições da origem do frontend (geralmente `http://localhost:5173`).

### API não encontrada
Verifique se:
1. A API está rodando em `http://localhost:8000`
2. O `apiBase` está configurado corretamente
3. Não há firewall bloqueando as requisições

### Componentes PrimeVue sem estilo
Certifique-se de que os imports do PrimeVue estão corretos no `main.js`:
```javascript
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
```

### Tailwind não aplicando cores
O Tailwind pode conflitar com estilos do PrimeVue. Use classes com prefixo `!` para forçar aplicação:
```vue
<div class="bg-blue-500!">
```


## 📦 Dependências Principais

```json
{
  "vue": "^3.4.0",
  "vite": "^5.0.0",
  "primevue": "^4.0.0",
  "primeicons": "^7.0.0",
  "tailwindcss": "^3.4.0"
}
```

## 🎓 Decisões Técnicas

### Por que Vue 3 + Composition API?
- API mais moderna e flexível
- Melhor TypeScript support (se necessário no futuro)
- Lógica reutilizável com composables
- Performance superior

### Por que PrimeVue?
- Componentes robustos e prontos para produção
- DataTable com recursos avançados (paginação, expansão, lazy loading)
- Excelente documentação
- Tema personalizável

### Por que Tailwind CSS?
- Desenvolvimento rápido com utility classes
- Tamanho final otimizado
- Fácil customização
- Integração perfeita com Vue


## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 👨‍💻 Autor

**Átila Macedo**
- GitHub: [@atilaacedo](https://github.com/atilaacedo)

## 🔗 Links Relacionados

- [Backend da Aplicação](https://github.com/atilaacedo/ClienteContatos-api)
- [Desafio Original](https://github.com/Casa-de-Apostas-Tecnologia/fullstack-challenge)

## 📸 Screenshots

*[Adicionar capturas de tela da aplicação em uso]*

---

Desenvolvido com ❤️ usando Vue 3 e PrimeVue