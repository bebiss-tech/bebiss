export const currentSituationMapper = {
  green: {
    color: "bg-green-600 hover:bg-green-700 transition-colors",
    label: "Meta alcançada",
    value: "green",
  },
  yellow: {
    color: "bg-yellow-500 hover:bg-yellow-600 transition-colors",
    label: "Dentro dos limites",
    value: "yellow",
  },
  red: {
    color: "bg-red-600 hover:bg-red-700 transition-colors",
    label: "Meta não alcançada",
    value: "red",
  },
  grey: {
    color: "bg-slate-400 hover:bg-slate-500 transition-colors",
    label: "Sem lançamento",
    value: "grey",
  },
  orange: {
    color: "bg-orange-600 hover:bg-orange-700 transition-colors",
    label: "Não mensurado",
    value: "orange",
  },
  purple: {
    color: "bg-purple-600 hover:bg-purple-700 transition-colors",
    label: "Direção da seta não se aplica",
    value: "purple",
  },
};

export const badges = {
  A: {
    color: "bg-green-50 border-green-500 text-green-700 hover:bg-green-100",
    label: "Ativo",
    value: "A",
  },
  I: {
    color: "bg-red-50 border-red-500 text-red-700 hover:bg-red-100",
    label: "Inativo",
    value: "I",
  },
};

export const frequency = {
  M: {
    label: "Mensal",
    value: "M",
  },
  B: {
    label: "Bimestral",
    value: "B",
  },
  T: {
    label: "Trimestral",
    value: "T",
  },
  Q: {
    label: "Quadrimestral",
    value: "Q",
  },
  S: {
    label: "Semestral",
    value: "S",
  },
  A: {
    label: "Anual",
    value: "A",
  },
};

export const status = {
  Conectado: {
    label: "Conectado",
    value: "Conectado",
  },
  Desconectado: {
    label: "Desconectado",
    value: "Desconectado",
  },
};
