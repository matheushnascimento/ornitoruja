import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText,
    versionText,
    maxConnectionsText,
    openConnectionsText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    versionText = data.version;
    maxConnectionsText = data.max_connections;
    openConnectionsText = data.open_connections;
  }

  return (
    <div>
      <ul>
        <li>
          Última atualização: <strong>{updatedAtText}</strong>
        </li>
        <li>
          Versão do banco de dados: <strong>{versionText}</strong>
        </li>
        <li>
          Máximo de conexões: <strong>{maxConnectionsText}</strong>
        </li>
        <li>
          Conexões abertas: <strong>{openConnectionsText}</strong>
        </li>
      </ul>
    </div>
  );
}
