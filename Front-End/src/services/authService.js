
const ADMIN_EMAIL = "ma3109278@gmail.com";

const STORAGE_KEYS = {
  USERS: "ccm_users",
  REQUESTS: "ccm_access_requests",
  SESSION: "ccm_session",
};

export const PAGINAS_DISPONIVEIS = [
  "Home",
  "Calculadora",
  "Orçamento",
  "Materiais",
  "Máquinas",
  "Operações",
  "Configurações",
  "Perfil",
];

export const PERMISSOES_PADRAO = {
  Operador: [
    "Home",
    "Calculadora",
    "Materiais",
    "Máquinas",
    "Operações",
    "Configurações",
    "Perfil",
  ],

  Financeiro: [...PAGINAS_DISPONIVEIS],

  Administrador: [...PAGINAS_DISPONIVEIS],
};

// =====================================
// FUNÇÕES AUXILIARES
// =====================================

function readStorage(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function hashPassword(password) {
  if (!crypto.subtle) {
    throw new Error(
      "Não foi possível proteger a senha neste navegador."
    );
  }

  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function validarSenha(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

export function getPaginasUsuario(user) {
  if (
    Array.isArray(user?.paginasPermitidas)
  ) {
    return user.paginasPermitidas.filter((pagina) =>
      PAGINAS_DISPONIVEIS.includes(pagina)
    );
  }

  return [...(PERMISSOES_PADRAO[user?.role] || [])];
}

// =====================================
// CONSULTAS
// =====================================

export function getUsers() {
  return readStorage(STORAGE_KEYS.USERS);
}

export function getRequests() {
  return readStorage(STORAGE_KEYS.REQUESTS);
}

export function getSession() {
  return readStorage(STORAGE_KEYS.SESSION, null);
}

// =====================================
// PRIMEIRO ADMINISTRADOR
// =====================================

export async function createInitialAdmin({
  nome,
  email,
  password,
}) {
  const emailNormalizado = normalizarEmail(email);

  if (emailNormalizado !== ADMIN_EMAIL) {
    throw new Error(
      `O primeiro administrador deve utilizar o e-mail ${ADMIN_EMAIL}.`
    );
  }

  const users = getUsers();

  if (users.some((user) => user.role === "Administrador")) {
    throw new Error("O administrador inicial já foi cadastrado.");
  }

  if (!validarSenha(password)) {
    throw new Error(
      "A senha deve ter 8 caracteres, maiúscula, minúscula, número e caractere especial."
    );
  }

  const admin = {
    id: generateId(),
    nome: nome.trim(),
    email: emailNormalizado,
    passwordHash: await hashPassword(password),
    role: "Administrador",
    paginasPermitidas: [...PAGINAS_DISPONIVEIS],
    status: "ativo",
    criadoEm: new Date().toISOString(),
  };

  writeStorage(STORAGE_KEYS.USERS, [...users, admin]);

  return {
    id: admin.id,
    nome: admin.nome,
    email: admin.email,
    role: admin.role,
  };
}

// =====================================
// SOLICITAÇÃO DE ACESSO
// =====================================

export async function requestAccess({
  nome,
  email,
  password,
  role,
}) {
  const emailNormalizado = normalizarEmail(email);

  if (!["Operador", "Financeiro"].includes(role)) {
    throw new Error("Função solicitada inválida.");
  }

  if (!nome.trim() || !emailNormalizado) {
    throw new Error("Preencha todos os campos.");
  }

  if (!validarSenha(password)) {
    throw new Error(
      "A senha deve ter 8 caracteres, maiúscula, minúscula, número e caractere especial."
    );
  }

  const users = getUsers();
  const requests = getRequests();

  if (
    users.some((user) => user.email === emailNormalizado)
  ) {
    throw new Error("Este e-mail já possui cadastro.");
  }

  if (
    requests.some(
      (request) =>
        request.email === emailNormalizado &&
        request.status === "Pendente"
    )
  ) {
    throw new Error(
      "Já existe uma solicitação pendente para este e-mail."
    );
  }

  const solicitacao = {
    id: generateId(),
    nome: nome.trim(),
    email: emailNormalizado,
    passwordHash: await hashPassword(password),
    role,
    status: "Pendente",
    criadoEm: new Date().toISOString(),
  };

  writeStorage(STORAGE_KEYS.REQUESTS, [
    ...requests,
    solicitacao,
  ]);

  return solicitacao;
}

// =====================================
// VERIFICAÇÃO DO ADMINISTRADOR
// =====================================

function verificarAdministrador() {
  const session = getSession();

  if (
    !session ||
    session.role !== "Administrador" ||
    session.email !== ADMIN_EMAIL
  ) {
    throw new Error(
      "Apenas o administrador principal pode realizar esta ação."
    );
  }

  return session;
}

// =====================================
// APROVAR SOLICITAÇÃO
// =====================================

export function approveRequest(requestId) {
  verificarAdministrador();

  const requests = getRequests();
  const users = getUsers();

  const request = requests.find(
    (item) => item.id === requestId
  );

  if (!request || request.status !== "Pendente") {
    throw new Error(
      "Solicitação não encontrada ou já processada."
    );
  }

  if (users.some((user) => user.email === request.email)) {
    throw new Error("Este e-mail já possui cadastro.");
  }

  const novoUsuario = {
    id: generateId(),
    nome: request.nome,
    email: request.email,
    passwordHash: request.passwordHash,
    role: request.role,
    paginasPermitidas: [
      ...(PERMISSOES_PADRAO[request.role] || []),
    ],
    status: "ativo",
    criadoEm: new Date().toISOString(),
  };

  const requestsAtualizadas = requests.map((item) =>
    item.id === requestId
      ? { ...item, status: "Aprovada" }
      : item
  );

  writeStorage(STORAGE_KEYS.USERS, [
    ...users,
    novoUsuario,
  ]);

  writeStorage(STORAGE_KEYS.REQUESTS, requestsAtualizadas);

  return novoUsuario;
}

// =====================================
// RECUSAR SOLICITAÇÃO
// =====================================

export function rejectRequest(requestId) {
  verificarAdministrador();

  const requests = getRequests();

  const request = requests.find(
    (item) => item.id === requestId
  );

  if (!request || request.status !== "Pendente") {
    throw new Error(
      "Solicitação não encontrada ou já processada."
    );
  }

  const atualizadas = requests.map((item) =>
    item.id === requestId
      ? { ...item, status: "Recusada" }
      : item
  );

  writeStorage(STORAGE_KEYS.REQUESTS, atualizadas);
}

// =====================================
// EDITAR USUÁRIO
// =====================================

export function updateUser(userId, dados) {
  verificarAdministrador();

  const users = getUsers();

  const usuario = users.find((user) => user.id === userId);

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  if (
    usuario.email === ADMIN_EMAIL ||
    usuario.role === "Administrador"
  ) {
    throw new Error(
      "A conta do administrador principal não pode ser modificada por esta tela."
    );
  }

  const nome = dados.nome?.trim();
  const email = normalizarEmail(dados.email || "");
  const role = dados.role;

  if (!nome || !email) {
    throw new Error("Nome e e-mail são obrigatórios.");
  }

  if (!["Operador", "Financeiro"].includes(role)) {
    throw new Error("Função inválida.");
  }

  if (
    users.some(
      (user) => user.id !== userId && user.email === email
    )
  ) {
    throw new Error("Este e-mail já está sendo utilizado.");
  }

  const paginas = Array.isArray(dados.paginasPermitidas)
    ? [...new Set(dados.paginasPermitidas)].filter((pagina) =>
        PAGINAS_DISPONIVEIS.includes(pagina)
      )
    : getPaginasUsuario(usuario);

  const atualizados = users.map((user) =>
    user.id === userId
      ? {
          ...user,
          nome,
          email,
          role,
          paginasPermitidas: paginas,
          atualizadoEm: new Date().toISOString(),
        }
      : user
  );

  writeStorage(STORAGE_KEYS.USERS, atualizados);

  return atualizados.find((user) => user.id === userId);
}

// =====================================
// DESATIVAR / REATIVAR USUÁRIO
// =====================================

export function setUserStatus(userId, status) {
  verificarAdministrador();

  if (!["ativo", "inativo"].includes(status)) {
    throw new Error("Status inválido.");
  }

  const users = getUsers();

  const usuario = users.find((user) => user.id === userId);

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  if (
    usuario.email === ADMIN_EMAIL ||
    usuario.role === "Administrador"
  ) {
    throw new Error(
      "Não é permitido desativar o administrador principal."
    );
  }

  const atualizados = users.map((user) =>
    user.id === userId
      ? { ...user, status }
      : user
  );

  writeStorage(STORAGE_KEYS.USERS, atualizados);

  return true;
}

// =====================================
// REMOVER USUÁRIO
// =====================================

export function removeUser(userId) {
  verificarAdministrador();

  const users = getUsers();

  const usuario = users.find((user) => user.id === userId);

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  if (
    usuario.email === ADMIN_EMAIL ||
    usuario.role === "Administrador"
  ) {
    throw new Error(
      "Não é permitido remover o administrador principal."
    );
  }

  const atualizados = users.filter(
    (user) => user.id !== userId
  );

  writeStorage(STORAGE_KEYS.USERS, atualizados);

  return true;
}

// =====================================
// LOGIN
// =====================================

export async function login({ email, password }) {
  const emailNormalizado = normalizarEmail(email);
  const users = getUsers();

  const user = users.find(
    (item) => item.email === emailNormalizado
  );

  if (!user || user.status !== "ativo") {
    throw new Error(
      "Usuário não encontrado ou sem acesso aprovado."
    );
  }

  const passwordHash = await hashPassword(password);

  if (passwordHash !== user.passwordHash) {
    throw new Error("E-mail ou senha incorretos.");
  }

  const session = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    paginasPermitidas: getPaginasUsuario(user),
  };

  writeStorage(STORAGE_KEYS.SESSION, session);

  return session;
}

// =====================================
// LOGOUT
// =====================================

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}
