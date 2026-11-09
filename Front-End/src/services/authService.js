
const ADMIN_EMAIL = "ma3109278@gmail.com";

const STORAGE_KEYS = {
  USERS: "ccm_users",
  REQUESTS: "ccm_access_requests",
  SESSION: "ccm_session",
};

// ==============================
// FUNÇÕES AUXILIARES
// ==============================

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

// ==============================
// CONSULTAS
// ==============================

export function getUsers() {
  return readStorage(STORAGE_KEYS.USERS);
}

export function getRequests() {
  return readStorage(STORAGE_KEYS.REQUESTS);
}

export function getSession() {
  return readStorage(STORAGE_KEYS.SESSION, null);
}

// ==============================
// CADASTRO DO PRIMEIRO ADMINISTRADOR
// ==============================

export async function createInitialAdmin({
  nome,
  email,
  password,
}) {
  const emailNormalizado = email.trim().toLowerCase();

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

// ==============================
// SOLICITAÇÃO DE ACESSO
// ==============================

export async function requestAccess({
  nome,
  email,
  password,
  role,
}) {
  const emailNormalizado = email.trim().toLowerCase();

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

  const emailJaCadastrado = users.some(
    (user) => user.email === emailNormalizado
  );

  if (emailJaCadastrado) {
    throw new Error("Este e-mail já possui cadastro.");
  }

  const solicitacaoExistente = requests.some(
    (request) =>
      request.email === emailNormalizado &&
      request.status === "Pendente"
  );

  if (solicitacaoExistente) {
    throw new Error("Já existe uma solicitação pendente para este e-mail.");
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

// ==============================
// APROVAÇÃO DE CADASTROS
// ==============================

function verificarAdministrador() {
  const session = getSession();

  if (
    !session ||
    session.role !== "Administrador" ||
    session.email !== ADMIN_EMAIL
  ) {
    throw new Error("Apenas o administrador pode realizar esta ação.");
  }
}

export function approveRequest(requestId) {
  verificarAdministrador();

  const requests = getRequests();
  const users = getUsers();

  const request = requests.find(
    (item) => item.id === requestId
  );

  if (!request || request.status !== "Pendente") {
    throw new Error("Solicitação não encontrada ou já processada.");
  }

  const novoUsuario = {
    id: generateId(),
    nome: request.nome,
    email: request.email,
    passwordHash: request.passwordHash,
    role: request.role,
    status: "ativo",
    criadoEm: new Date().toISOString(),
  };

  const requestsAtualizadas = requests.map((item) =>
    item.id === requestId
      ? { ...item, status: "Aprovada" }
      : item
  );

  writeStorage(STORAGE_KEYS.USERS, [...users, novoUsuario]);
  writeStorage(STORAGE_KEYS.REQUESTS, requestsAtualizadas);

  return novoUsuario;
}

export function rejectRequest(requestId) {
  verificarAdministrador();

  const requests = getRequests();

  const request = requests.find(
    (item) => item.id === requestId
  );

  if (!request || request.status !== "Pendente") {
    throw new Error("Solicitação não encontrada ou já processada.");
  }

  const atualizadas = requests.map((item) =>
    item.id === requestId
      ? { ...item, status: "Recusada" }
      : item
  );

  writeStorage(STORAGE_KEYS.REQUESTS, atualizadas);
}

// ==============================
// LOGIN
// ==============================

export async function login({ email, password }) {
  const emailNormalizado = email.trim().toLowerCase();
  const users = getUsers();

  const user = users.find(
    (item) => item.email === emailNormalizado
  );

  if (!user || user.status !== "ativo") {
    throw new Error("Usuário não encontrado ou sem acesso aprovado.");
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
  };

  writeStorage(STORAGE_KEYS.SESSION, session);

  return session;
}

// ==============================
// LOGOUT
// ==============================

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}
