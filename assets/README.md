# Pasta de assets

| Arquivo | Onde aparece |
|---|---|
| `residencial/ceu.jpg` | Placa no céu — abertura do site e card do "Saiba mais" |
| `residencial/flutuando.jpg` | Placa acima dos trilhos — início da jornada |
| `residencial/instalada.jpg` | Placa encaixada — final da jornada |
| `corporativo/telhado.jpg` | Laje do galpão — jornada corporativa |

**Regra de ouro:** para trocar uma foto, gere a nova A PARTIR da atual, pedindo
"mantenha exatamente o mesmo enquadramento, câmera e luz". É o enquadramento
idêntico entre `flutuando.jpg` e `instalada.jpg` que faz a dissolução ficar invisível.

## Melhoria pendente (opcional)
A foto do galpão ainda é de um amanhecer alaranjado e destoa das novas, que têm
céu azul. Para deixar tudo no mesmo clima, gere duas imagens novas do galpão
(uma com as placas flutuando, outra com elas instaladas), no mesmo estilo das
residenciais, e salve como `corporativo/flutuando.jpg` e `corporativo/instalada.jpg`.
Depois troque as `camadas` da seção corporativa em `content.js`.
