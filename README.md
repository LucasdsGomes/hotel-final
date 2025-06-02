# 🏨 Sistema de Gestão Hoteleira 
Um sistema completo para gerenciamento de hotéis, incluindo CRUD de clientes, quartos e reservas, com controle de check-in/check-out.

# ✨ Funcionalidades
- Cadastro de Clientes
- Nome e e-mail dos hóspedes
- Histórico de reservas
- Gestão de Quartos
- Cadastro com número, tipo e preço
- Status de disponibilidade
- Filtro por tipo e preço
- Sistema de Reservas
- Check-in/check-out com controle de datas
- Verificação de disponibilidade em tempo real
- Relacionamento entre clientes e quartos
- Dashboard Administrativo
- Visão geral das ocupações
- Relatórios de faturamento
- Controle operacional simplificado

# 🛠️ Tecnologias Utilizadas
- Frontend
- React.js
- Next.js
- Bootstrap 5
- CSS Modules
- Backend
- Node.js
- Prisma ORM
- SQLite (ou outro banco de dados)
- Ferramentas
- Font Awesome (ícones)
- Date-fns (manipulação de datas)
- React Hook Form (formulários)

# 🚀 Como Executar o Projeto
** Pré-requisitos **
- Node.js (v16 ou superior)
      npm ou yarn
- Banco de dados configurado (SQLite, PostgreSQL, etc.)
- 
# Instalação
Clone o repositório:

git clone https://github.com/LucasdsGomes/hotel-final.git
cd hotel-final

# Instale as dependências:
npm install
# ou
yarn install

Execute as migrações do Prisma:
- npx prisma migrate dev

Inicie o servidor de desenvolvimento:
- npm run dev
# ou
yarn dev

Acesse no navegador:
http://localhost:3000


# 📦 Estrutura do Projeto
hotel-final/
├── prisma/
│   └── schema.prisma       # Modelos do banco de dados
├── src/
│   ├── pages/
│   │   ├── api/            # Endpoints da API
│   │   ├── clientes/        # Páginas de clientes
│   │   ├── quartos/         # Páginas de quartos
│   │   └── reservas/        # Páginas de reservas
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Utilitários e configurações
│   └── styles/              # Estilos globais
├── .env.example             # Modelo de variáveis de ambiente
├── package.json
└── README.md

# 📝 Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

# 🤝 Como Contribuir
Faça um fork do projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📧 Contato
Lucas Gomes - dsglucass@gmail.com

Link do Projeto: https://github.com/LucasdsGomes/hotel-final

# 🌟 Recursos Adicionais
- Documentação do Prisma

- Documentação do Next.js

- Bootstrap 5 Documentation
