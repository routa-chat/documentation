// Portuguese copy applied by build-openapi.mjs on top of the generated spec.
// Keep summaries short: Mintlify uses them as page titles.

const ID = (prefix) => `${prefix}_01J8ZK9M3Q7XABCDEFGHJKMNPQ`
const TS = '2026-09-04T13:22:41.031Z'

// Status copy shared by every `/v1/partner/*` operation. These routes answer to a partner key, not to a project key.
const PARTNER_STATUSES = {
  401: 'Chave de parceiro ausente, inválida, revogada, expirada ou fora da lista de IPs permitidos (`partner_key_invalid`). Uma chave de projeto também recebe este erro',
  403: 'A chave de parceiro não tem o escopo necessário (`insufficient_scope`)',
  404: 'O recurso não existe, não pertence à sua organização ou não foi criado pela API de parceiro. Também retorna `partner_api_not_available` quando o plano não inclui a API de parceiro',
  429: 'Limite de taxa excedido: 10 requisições por segundo, com rajadas de até 30, por organização. Veja o header `Retry-After`',
}

const PARTNER_LIMIT = { maximum: 200, default: 50 }
const PARTNER_PAGE_PARAMS = {
  limit: 'Quantidade de itens por página, de 1 a 200. O padrão é 50.',
  cursor: 'Valor de `next_cursor` da página anterior. Trate-o como opaco.',
}
const PARTNER_PROJECT_ID = 'Identificador do projeto (`proj_...`). Só vale para um projeto criado pela API de parceiro.'

export const COPY = {
  info: {
    title: 'API da Routa',
    description:
      'API REST para enviar e receber mensagens de WhatsApp, acompanhar a entrega e receber eventos normalizados por webhook.',
    version: '1',
  },

  tags: [
    { name: 'Mensagens', description: 'Envie, consulte e liste mensagens.' },
    { name: 'Eventos', description: 'Consulte o log de eventos normalizados.' },
    { name: 'Webhooks', description: 'Gerencie endpoints de webhook, segredos e entregas.' },
    { name: 'Templates', description: 'Submeta e consulte templates de WhatsApp.' },
    { name: 'Mídia', description: 'Envie e obtenha arquivos de mídia.' },
    { name: 'Uso', description: 'Consulte o uso medido do projeto.' },
    { name: 'Identidade', description: 'Identifique a chave de API em uso.' },
    {
      name: 'Parceiros',
      description:
        'Crie um projeto por cliente, emita a chave de cada projeto, acompanhe os canais e receba os eventos de todos os clientes em um só webhook. Estas rotas usam uma chave de parceiro (`rt_partner_...`). Veja [API de parceiro](/partners/overview).',
    },
  ],

  statuses: {
    200: 'Sucesso',
    201: 'Recurso criado',
    202: 'Aceito. O processamento é assíncrono',
    204: 'Sem conteúdo. A operação foi concluída',
    401: 'Chave de API ausente, inválida, revogada ou expirada (`api_key_invalid`)',
    402: 'Franquia ou limite do plano esgotado (`message_quota_exceeded`, `free_messages_exhausted`, `subscription_required`, `payment_failed`)',
    403: 'A chave não tem o escopo necessário (`insufficient_scope`)',
    404: 'O recurso não existe ou pertence a outro projeto',
    409: 'Conflito de idempotência ou de estado',
    422: 'Requisição inválida',
    429: 'Limite de taxa excedido. Veja o header `Retry-After`',
  },

  params: {
    id: 'Identificador do recurso.',
    limit: 'Quantidade de itens por página, de 1 a 100. O padrão é 20.',
    cursor: 'Valor de `next_cursor` da página anterior. Trate-o como opaco.',
    after: 'Retoma a listagem depois deste id de evento (`evt_...`).',
    type: 'Filtra por tipo de evento.',
    direction: 'Filtra pela direção da mensagem: `inbound` (recebida) ou `outbound` (enviada).',
    channel: 'Filtra pelo id do canal (`chan_...`).',
    state: 'Filtra pelo estado da entrega.',
    deliveryId: 'Identificador da entrega (`whd_...`).',
    from: 'Data UTC inicial, no formato `YYYY-MM-DD`, inclusiva.',
    to: 'Data UTC final, no formato `YYYY-MM-DD`, exclusiva. O intervalo tem no máximo 92 dias.',
  },

  operationOrder: [
    'POST /v1/messages',
    'GET /v1/messages',
    'GET /v1/messages/{id}',
    'POST /v1/messages/{id}/read',
    'GET /v1/events',
    'POST /v1/webhook_endpoints',
    'GET /v1/webhook_endpoints',
    'GET /v1/webhook_endpoints/{id}',
    'PATCH /v1/webhook_endpoints/{id}',
    'POST /v1/webhook_endpoints/{id}/rotate_secret',
    'POST /v1/webhook_endpoints/{id}/disable',
    'POST /v1/webhook_endpoints/{id}/enable',
    'GET /v1/webhook_endpoints/{id}/deliveries',
    'POST /v1/webhook_endpoints/{id}/deliveries/{deliveryId}/replay',
    'POST /v1/webhook_endpoints/{id}/deliveries/replay',
    'POST /v1/templates',
    'GET /v1/templates',
    'GET /v1/templates/{id}',
    'POST /v1/templates/media',
    'POST /v1/media',
    'GET /v1/media/{id}',
    'GET /v1/usage',
    'GET /v1/whoami',
    'POST /v1/partner/projects',
    'GET /v1/partner/projects',
    'GET /v1/partner/projects/{projectId}',
    'PATCH /v1/partner/projects/{projectId}',
    'DELETE /v1/partner/projects/{projectId}',
    'POST /v1/partner/projects/{projectId}/api_keys',
    'POST /v1/partner/projects/{projectId}/api_keys/{id}/rotate',
    'POST /v1/partner/projects/{projectId}/api_keys/{id}/revoke',
    'GET /v1/partner/channels',
    'DELETE /v1/partner/projects/{projectId}/channels/{channelId}',
    'GET /v1/partner/webhook',
    'PUT /v1/partner/webhook',
    'POST /v1/partner/webhook/rotate_secret',
  ],

  operations: {
    'POST /v1/messages': {
      id: 'sendMessage',
      tag: 'Mensagens',
      scope: 'messages:write',
      summary: 'Enviar mensagem',
      description:
        'Envia uma mensagem de texto ou de template por um canal.\n\nA resposta é `202 Accepted`: a mensagem foi gravada de forma durável, mas **ainda não foi entregue**. Acompanhe `sent`, `delivered`, `read` e `failed` por [webhooks](/webhooks/overview) ou por `GET /v1/messages/{id}`.\n\nInforme **exatamente um** entre `text` e `template`. Envie o header `Idempotency-Key` para repetir a requisição com segurança. Veja [Idempotência](/reliability/idempotency).\n\nA validação do canal, do destinatário e do template acontece no aceite e retorna `422` imediatamente. Um template importado e somente leitura retorna `template_not_sendable`.',
      headers: [
        {
          name: 'Idempotency-Key',
          in: 'header',
          required: false,
          description:
            'Chave única por mensagem lógica (um UUID v4, por exemplo). Repetir a requisição com a mesma chave e o mesmo corpo devolve a resposta original, com o header `Idempotent-Replay: true`. Uma chave reutilizada com outro corpo retorna `409 idempotency_key_reuse`. O registro é mantido por 24 horas.',
          schema: { type: 'string' },
          example: '6f0a9d9e-3c1f-4e56-9a64-2b7f6a5c1d10',
        },
      ],
      requestNotes: {
        channel: { description: 'Identificador do canal pelo qual enviar (`chan_...`).', example: 'chan_01J8ZK9M3Q7XABCDEFGHJKMNPQ' },
        to: { description: 'Destinatário em formato E.164, por exemplo `+5581999999999`. O `+` inicial é opcional. O formato é verificado aqui; se o número não pode existir no país indicado, a API retorna `invalid_recipient`.', example: '+5581999999999' },
        text: { description: 'Corpo da mensagem de texto. Não pode ser usado junto com `template`.', example: 'Olá! Seu pedido foi confirmado.' },
        template: 'Template aprovado a enviar. Não pode ser usado junto com `text`.',
        'template.id': { description: 'Identificador do template (`tmpl_...`). O template precisa estar `approved`.', example: 'tmpl_01J8ZK9M3Q7XABCDEFGHJKMNPQ' },
        'template.body_parameters': 'Valores posicionais para os placeholders `{{1}}`, `{{2}}`, … do corpo do template, na ordem. A quantidade precisa bater com a de variáveis do template.',
        metadata: 'Até 20 pares chave-valor de texto, de propriedade do cliente, com 1 KB no total. É devolvido na consulta e nos eventos.',
      },
      requestExample: {
        channel: 'chan_01J8ZK9M3Q7XABCDEFGHJKMNPQ',
        to: '+5581999999999',
        text: 'Olá! Seu pedido foi confirmado.',
        metadata: { order_id: '1234' },
      },
    },
    'GET /v1/messages': {
      id: 'listMessages',
      tag: 'Mensagens',
      scope: 'messages:read',
      summary: 'Listar mensagens',
      description:
        'Lista as mensagens do projeto, da mais recente para a mais antiga, com paginação por cursor. Filtre por `direction` para ver só as recebidas ou só as enviadas.\n\nEm um número conectado em modo de coexistência, a lista inclui as mensagens que a empresa enviou pelo app do WhatsApp Business (`origin: business_app`) e o histórico importado. Uma mensagem com conteúdo mais antigo que a retenção do plano vem com `content: null` e `content_redacted_at`.',
    },
    'GET /v1/messages/{id}': {
      id: 'retrieveMessage',
      tag: 'Mensagens',
      scope: 'messages:read',
      summary: 'Consultar mensagem',
      description:
        'Retorna uma mensagem com o status atual e os horários de cada etapa (`sent_at`, `delivered_at`, `read_at`, `failed_at`).',
      params: { id: 'Identificador da mensagem (`msg_...`).' },
    },
    'POST /v1/messages/{id}/read': {
      id: 'markMessageAsRead',
      tag: 'Mensagens',
      scope: 'messages:write',
      summary: 'Marcar mensagem como lida',
      description:
        'Marca uma mensagem **recebida** (`inbound`) como lida e envia a confirmação de leitura ao remetente. Para uma mensagem enviada por você, retorna `422` com o código `message_direction_invalid`.',
      params: { id: 'Identificador da mensagem recebida (`msg_...`).' },
    },
    'GET /v1/events': {
      id: 'listEvents',
      tag: 'Eventos',
      scope: 'events:read',
      summary: 'Listar eventos',
      description:
        'Lista os eventos do projeto em ordem crescente de `sequence`, do mais antigo para o mais recente. É o caminho de **reconciliação** para quem perdeu entregas de webhook: guarde o `id` do último evento processado e passe-o em `after`.\n\nOs eventos ficam disponíveis por 90 dias. Veja [Reconciliar eventos](/webhooks/reconciliation).\n\nCada evento traz o `external_ref` do projeto, que é `null` quando o projeto não tem um.',
      params: { type: 'Filtra por tipo de evento, por exemplo `message.delivered` ou `template.deleted`.' },
    },
    'POST /v1/webhook_endpoints': {
      id: 'createWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Criar endpoint de webhook',
      description:
        'Registra uma URL para receber eventos. A resposta inclui o `secret` de assinatura, **exibido uma única vez**. Guarde-o para [verificar as assinaturas](/webhooks/signatures).\n\nA URL deve usar HTTPS e não pode apontar para endereços privados. `http://localhost` é aceito apenas em projetos de teste. Cada projeto pode ter até 5 endpoints.',
      requestNotes: {
        url: { description: 'URL HTTPS que recebe os eventos. `http://` é aceito apenas para localhost em projetos de teste.', example: 'https://exemplo.com/webhooks/routa' },
        subscribed_types: { description: 'Tipos de evento ou curingas por recurso (`message.*`, `channel.*`, `template.*`). Pelo menos um.', example: ['message.*', 'channel.status_changed'] },
      },
      requestExample: {
        url: 'https://exemplo.com/webhooks/routa',
        subscribed_types: ['message.*', 'channel.status_changed'],
      },
    },
    'GET /v1/webhook_endpoints': {
      id: 'listWebhookEndpoints',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Listar endpoints de webhook',
      description:
        'Lista os endpoints de webhook do projeto (no máximo 5). O `secret` nunca é retornado nas listagens.',
    },
    'GET /v1/webhook_endpoints/{id}': {
      id: 'retrieveWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Consultar endpoint de webhook',
      description:
        'Retorna um endpoint, incluindo `status`, `consecutive_failures` e os horários do último sucesso e da última falha.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'PATCH /v1/webhook_endpoints/{id}': {
      id: 'updateWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Atualizar tipos assinados',
      description:
        'Substitui a lista de tipos de evento assinados pelo endpoint. A lista não pode ser vazia e aceita curingas como `message.*`.',
      requestNotes: {
        subscribed_types: { description: 'Nova lista de tipos ou curingas. Substitui a lista atual.', example: ['message.delivered', 'message.failed'] },
      },
      requestExample: { subscribed_types: ['message.delivered', 'message.failed'] },
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/rotate_secret': {
      id: 'rotateWebhookEndpointSecret',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Rotacionar segredo',
      description:
        'Gera um novo segredo de assinatura e o retorna. O segredo anterior continua válido por **24 horas**, e durante esse período as entregas são assinadas com os dois. Veja [Verificar assinaturas](/webhooks/signatures).',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/disable': {
      id: 'disableWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Desativar endpoint',
      description:
        'Pausa as entregas para o endpoint (`status: disabled_by_user`). Os eventos continuam sendo gravados no log.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/enable': {
      id: 'enableWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Reativar endpoint',
      description:
        'Reativa um endpoint desativado e **reenvia em lote** todas as entregas esgotadas. A resposta informa quantas foram reenviadas em `replayed_count`.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'GET /v1/webhook_endpoints/{id}/deliveries': {
      id: 'listWebhookDeliveries',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Listar entregas',
      description:
        'Lista as entregas de um endpoint, da mais recente para a mais antiga. Filtre por `state=exhausted` para ver as entregas que esgotaram as tentativas. As entregas ficam consultáveis por 30 dias.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/deliveries/{deliveryId}/replay': {
      id: 'replayWebhookDelivery',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Reenviar uma entrega',
      description:
        'Reenvia uma entrega no estado `exhausted`. Uma entrega em outro estado retorna `409` com o código `webhook_delivery_not_replayable`.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/deliveries/replay': {
      id: 'replayWebhookDeliveries',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Reenviar todas as entregas esgotadas',
      description:
        'Reenvia, de uma vez, todas as entregas esgotadas do endpoint. Retorna a quantidade reenviada.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/templates': {
      id: 'createTemplate',
      tag: 'Templates',
      scope: 'templates:write',
      summary: 'Submeter template',
      description:
        'Cria um template e o envia ao WhatsApp para aprovação. A aprovação é decidida pelo provedor, no tempo dele. Acompanhe pelos eventos `template.*` ou consultando o template.\n\nSomente templates `approved` podem ser usados em `POST /v1/messages`. Veja [Templates](/concepts/templates).\n\nA Routa recusa **na hora**, com `422`, o que o WhatsApp já é conhecido por recusar. Assim o erro chega no campo certo, em vez de um template `failed` minutos depois. O campo `error.param` diz qual parte da requisição falhou.\n\n| Regra | Erro e `error.param` |\n| --- | --- |\n| O nome usa só `a-z`, `0-9` e `_`, até 512 caracteres | `template_name_invalid`, `name` |\n| O corpo tem até 1024 caracteres | `template_components_invalid`, `body_text` |\n| O corpo não começa nem termina com uma variável `{{n}}` | `template_variables_invalid` |\n| O cabeçalho de texto tem até 60 caracteres e uma variável | `template_components_invalid`, `components.header` |\n| O rodapé tem até 60 caracteres | `template_components_invalid`, `components.footer` |\n| No máximo 10 botões, 1 de telefone e 2 de URL | `template_components_invalid`, `components.buttons` |\n| Os botões de resposta rápida ficam juntos, sem outros botões no meio | `template_components_invalid`, `components.buttons` |\n| O texto do botão tem até 25 caracteres, a URL até 2000 e o telefone até 20 | `template_components_invalid`, `components.buttons` |\n| A variável `{{1}}` de uma URL fica no fim dela, e a URL não aponta para `api.whatsapp.com` | `template_components_invalid`, `components.buttons` |\n| Um template `authentication` não aceita botões próprios | `template_components_invalid`, `components.buttons` |\n\nO WhatsApp decide a aprovação. Uma regra que a Routa não verifica ainda pode levar a `rejected` ou `failed`.',
      requestNotes: {
        channel: { description: 'Canal ao qual o template pertence (`chan_...`).', example: 'chan_01J8ZK9M3Q7XABCDEFGHJKMNPQ' },
        name: { description: 'Nome do template: só letras minúsculas, dígitos e `_` (`a-z`, `0-9`, `_`), até 512 caracteres.', example: 'confirmacao_pedido' },
        language: { description: 'Código de idioma, por exemplo `pt_BR` ou `en_US`.', example: 'pt_BR' },
        category: 'Categoria do template: `marketing`, `utility` ou `authentication`.',
        body_text: { description: 'Corpo do template, com placeholders posicionais `{{1}}`, `{{2}}`, …, até 1024 caracteres. Não pode começar nem terminar com uma variável.', example: 'Olá {{1}}! Seu pedido {{2}} foi confirmado.' },
        components: 'Componentes opcionais: cabeçalho de texto ou de mídia, rodapé e até 10 botões. Omita o campo para um template só de texto.',
        'components.header': 'Cabeçalho de texto (até 60 caracteres e uma variável) ou de mídia (um `media_id` de `POST /v1/templates/media`).',
        'components.footer': 'Rodapé em texto, com até 60 caracteres.',
        'components.buttons': 'Até 10 botões: no máximo 1 `phone_number` e 2 `url`. Os `quick_reply` ficam juntos, antes ou depois dos outros. O texto de cada botão tem até 25 caracteres. A URL de um botão `url` tem até 2000 caracteres e pode ter uma variável `{{1}}`, que só pode ficar no fim da URL.',
      },
      requestExample: {
        channel: 'chan_01J8ZK9M3Q7XABCDEFGHJKMNPQ',
        name: 'confirmacao_pedido',
        language: 'pt_BR',
        category: 'utility',
        body_text: 'Olá {{1}}! Seu pedido {{2}} foi confirmado.',
      },
    },
    'GET /v1/templates': {
      id: 'listTemplates',
      tag: 'Templates',
      scope: 'templates:read',
      summary: 'Listar templates',
      description:
        'Lista os templates do projeto com paginação por cursor. Filtre por canal com `channel`. A listagem inclui os templates importados do WhatsApp (`origin: provider`), inclusive os somente leitura (`read_only: true`), que não podem ser usados para enviar. Editar e excluir um template é feito no painel.',
    },
    'GET /v1/templates/{id}': {
      id: 'retrieveTemplate',
      tag: 'Templates',
      scope: 'templates:read',
      summary: 'Consultar template',
      description:
        'Retorna um template com o `status` de aprovação atual. Se ele foi rejeitado, `rejection_reason` indica o motivo. Se a Routa não conseguiu submetê-lo (`status: failed`), `failure_code` indica o motivo e `failure_detail` traz a frase do provedor, quando ele a deu. Pela API, é preciso criar o template de novo. No painel, um template `failed` ou `rejected` pode ser editado e reenviado.\n\nQuando uma exclusão feita no painel está em andamento, `deletion_requested` é `true` e o template não pode ser usado para enviar.',
      params: { id: 'Identificador do template (`tmpl_...`).' },
    },
    'POST /v1/templates/media': {
      id: 'uploadTemplateMedia',
      tag: 'Templates',
      scope: 'templates:write',
      summary: 'Enviar mídia de cabeçalho',
      description:
        'Envia uma imagem, um vídeo ou um documento para usar como cabeçalho de um template. Envie os bytes do arquivo **diretamente no corpo**, com o `Content-Type` do arquivo. O formato é deduzido do tipo.\n\n| Formato | Tipos aceitos | Tamanho máximo |\n| --- | --- | --- |\n| `image` | `image/jpeg`, `image/png` | 5 MB |\n| `video` | `video/mp4` | 16 MB |\n| `document` | `application/pdf` | 100 MB |\n\nUse o `id` retornado em `components.header.media_id` ao submeter o template.',
      requestBody: {
        required: true,
        description: 'Os bytes do arquivo, com o `Content-Type` do arquivo (por exemplo `image/png`).',
        content: {
          'application/octet-stream': { schema: { type: 'string', format: 'binary' } },
        },
      },
    },
    'POST /v1/media': {
      id: 'uploadMedia',
      tag: 'Mídia',
      scope: 'media:write',
      summary: 'Enviar ou hospedar mídia',
      description:
        'Armazena um arquivo de mídia sob custódia da Routa. Há duas formas, escolhidas pelo `Content-Type`:\n\n- **Bytes:** envie o arquivo no corpo, com o `Content-Type` do arquivo.\n- **URL:** envie `application/json` com `{ "source_url": "https://..." }` e a Routa baixa o arquivo. A URL precisa ser pública.\n\nOs tipos e os tamanhos aceitos seguem os limites do WhatsApp. Veja [Mídia](/concepts/media).',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['source_url'],
              properties: {
                source_url: {
                  type: 'string',
                  format: 'uri',
                  description: 'URL pública do arquivo que a Routa deve baixar.',
                  example: 'https://exemplo.com/imagem.png',
                },
              },
            },
          },
          'application/octet-stream': {
            schema: {
              type: 'string',
              format: 'binary',
              description: 'Os bytes do arquivo. Use o `Content-Type` real do arquivo, por exemplo `image/jpeg`.',
            },
          },
        },
      },
    },
    'GET /v1/media/{id}': {
      id: 'retrieveMedia',
      tag: 'Mídia',
      scope: 'media:read',
      summary: 'Consultar mídia',
      description:
        'Retorna o objeto de mídia com uma **URL assinada nova**, válida por 15 minutos, quando `status` é `ready`. Se estiver `pending`, repita a consulta em instantes.',
      params: { id: 'Identificador da mídia (`med_...`).' },
    },
    'GET /v1/usage': {
      id: 'retrieveUsage',
      tag: 'Uso',
      scope: 'usage:read',
      summary: 'Consultar uso',
      description:
        'Retorna o uso medido do projeto no período, com uma linha por combinação de métrica, tipo de canal e provedor. O dia corrente ainda aberto é lido ao vivo. O intervalo tem no máximo 92 dias.',
    },
    'GET /v1/whoami': {
      id: 'whoami',
      tag: 'Identidade',
      scope: undefined,
      summary: 'Identificar a chave de API',
      description:
        'Resolve a chave de API em uso para a organização, o projeto e os escopos que ela possui. Não tem efeitos colaterais e aceita qualquer chave válida, o que o torna ideal para verificar uma chave.',
    },

    'POST /v1/partner/projects': {
      id: 'createPartnerProject',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'projects:write',
      statuses: {
        200: 'Já existia um projeto com este `external_ref`. Ele é devolvido sem alteração',
        201: 'Projeto criado',
        402: 'O limite de projetos do plano foi atingido (`project_limit_exceeded`, com `error.details.limit`)',
        ...PARTNER_STATUSES,
        422: 'Requisição inválida (`invalid_project_name`, `invalid_external_ref`)',
      },
      summary: 'Criar projeto de um cliente',
      description:
        'Cria o projeto de um cliente seu. Use **um projeto por cliente**.\n\nO `external_ref` é o **seu** identificador do cliente. Ele é único na organização e não muda depois. Repetir a chamada com o mesmo `external_ref` não cria um segundo projeto: a API devolve o existente com `200`, e o `name` enviado é ignorado. A primeira chamada retorna `201`.\n\nCriar o projeto é opcional: o primeiro [link assinado](/partners/signed-link) de um cliente também o cria. O projeto sempre nasce em produção (`environment: live`).\n\nO plano limita o número de projetos. Ao atingir o limite, a API retorna `402 project_limit_exceeded`. Apagar um projeto de um cliente que saiu devolve a vaga.',
      requestNotes: {
        name: { description: 'Nome do projeto, de 1 a 200 caracteres. Aparece para o cliente na página de conexão. É um nome de exibição, não uma identidade.', example: 'Loja do Zé' },
        external_ref: { description: 'Seu identificador do cliente: de 1 a 128 caracteres entre `A-Z`, `a-z`, `0-9`, `.`, `_`, `:` e `-`. Nunca use e-mail, telefone ou nome. É único na organização e definido uma vez.', example: 'lead_123' },
      },
      requestExample: { name: 'Loja do Zé', external_ref: 'lead_123' },
    },
    'GET /v1/partner/projects': {
      id: 'listPartnerProjects',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'projects:read',
      statuses: { ...PARTNER_STATUSES, 422: 'Requisição inválida (`invalid_cursor`, `invalid_external_ref`)' },
      limit: PARTNER_LIMIT,
      summary: 'Listar projetos',
      description:
        'Lista os projetos criados pela API de parceiro, com paginação por cursor. Os projetos que a sua equipe criou no painel não aparecem.\n\nFiltre por `external_ref` para achar o projeto de um cliente, ou por `has_channel` para separar quem já conectou um número de quem ainda não conectou.',
      params: {
        external_ref: 'Devolve só o projeto que tem este `external_ref`. Uma página vazia quando nenhum projeto o tem.',
        has_channel: 'Use `false` para os projetos sem nenhum canal e `true` para os que têm algum, em qualquer estado. Um projeto que só tem canais desativados **não** é um projeto sem canal. Qualquer outro valor retorna `422`.',
        ...PARTNER_PAGE_PARAMS,
      },
    },
    'GET /v1/partner/projects/{projectId}': {
      id: 'retrievePartnerProject',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'projects:read',
      statuses: { ...PARTNER_STATUSES },
      summary: 'Consultar projeto',
      description:
        'Retorna o projeto com o seu `external_ref` e os canais dele (`id` e `status`).\n\nÉ **esta** consulta, e não o redirecionamento do link assinado, que confirma uma conexão. O redirecionamento é apenas uma dica: qualquer pessoa pode forjar uma requisição para o seu `redirect_url`. Veja o [guia de onboarding](/partners/onboarding).',
      params: { projectId: PARTNER_PROJECT_ID },
    },
    'PATCH /v1/partner/projects/{projectId}': {
      id: 'updatePartnerProject',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'projects:write',
      statuses: { ...PARTNER_STATUSES, 422: 'Requisição inválida (`invalid_project_name`, `external_ref_immutable`)' },
      summary: 'Renomear projeto',
      description:
        'Renomeia o projeto. O `external_ref` **não pode mudar**: enviar o valor atual é aceito, e qualquer outro valor retorna `422 external_ref_immutable`.',
      requestNotes: {
        name: { description: 'Novo nome de exibição, de 1 a 200 caracteres.', example: 'Loja do Zé Ltda' },
        external_ref: 'Aceito só para ser recusado. Envie o valor atual ou omita o campo.',
      },
      requestExample: { name: 'Loja do Zé Ltda' },
      params: { projectId: PARTNER_PROJECT_ID },
    },
    'DELETE /v1/partner/projects/{projectId}': {
      id: 'deletePartnerProject',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'projects:delete',
      statuses: {
        202: 'A exclusão ainda não terminou. Repita a chamada até receber `204`',
        204: 'O projeto foi apagado',
        ...PARTNER_STATUSES,
        409: 'O projeto não pode ser apagado (`project_not_deletable`). `error.details.reason` é `has_enabled_channel` ou `last_project`',
      },
      summary: 'Apagar projeto',
      description:
        'Apaga o projeto de um cliente e tudo o que ele contém, para devolver a vaga ao limite de projetos do plano. Um link abandonado ou um cliente que saiu continuam contando até você apagar o projeto.\n\nExige o escopo `projects:delete`, que **não** vem em uma chave nova. Vale só para um projeto criado pela API de parceiro.\n\nA API apaga mensagens, templates, eventos, contatos, chaves, endpoints de webhook, arquivos de mídia e os canais **desativados** do projeto. Os números desses canais ficam livres. O plano, a franquia, o registro de auditoria e as chaves de parceiro da organização não mudam. Nada muda no WhatsApp.\n\nO projeto não pode ser apagado quando ainda tem um canal que não está desativado (`has_enabled_channel`) nem quando é o último projeto da organização (`last_project`). Nos dois casos a resposta é `409 project_not_deletable`.\n\nA resposta é `204` quando o projeto sumiu. Em um projeto grande, a chamada pode apagar só uma parte e retornar `202` com `status: deleting`. O projeto continua lá, parcialmente apagado. **Repita a mesma chamada até receber `204`.**',
      params: { projectId: PARTNER_PROJECT_ID },
    },
    'POST /v1/partner/projects/{projectId}/api_keys': {
      id: 'createPartnerProjectApiKey',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'api_keys:write',
      statuses: {
        201: 'Chave criada. O `secret` aparece uma única vez',
        ...PARTNER_STATUSES,
        422: 'Requisição inválida (`invalid_api_key_name`)',
      },
      summary: 'Emitir chave de API do projeto',
      description:
        'Emite a chave de API de um projeto. É **esta** chave, e não a chave de parceiro, que o tráfego do cliente usa em `/v1/messages`, `/v1/templates` e nas demais rotas. A chave de parceiro nunca envia mensagens.\n\nO `secret` é exibido **uma única vez**, na resposta. Guarde-o com segurança.\n\nExige o escopo `api_keys:write`, que **não** vem em uma chave de parceiro nova. Uma chave de parceiro vazada com esse escopo pode emitir chaves que enviam mensagens para qualquer cliente seu. Restrinja-a aos endereços dos seus servidores e defina uma expiração.\n\nPeça o menor conjunto de escopos que funciona. Os escopos de uma chave de projeto estão em [Autenticação](/authentication). Valores desconhecidos são ignorados, e `scopes: []` gera uma chave que não pode fazer nada.',
      requestNotes: {
        name: { description: 'Como você chama esta chave, por exemplo `Backend do cliente 123`. No máximo 80 caracteres, depois de remover os espaços das pontas.', example: 'Loja do Zé' },
        scopes: { description: 'Escopos da chave do projeto. Peça apenas os necessários.', example: ['messages:write', 'messages:read'] },
        expires_at: 'Quando a chave expira, em ISO 8601. Sem este campo, a chave não expira.',
        ip_allowlist: 'Endereços IPv4 ou blocos CIDR IPv4 que podem usar a chave. Endereços IPv6 são comparados como texto exato. Uma lista vazia não restringe.',
      },
      requestExample: { name: 'Loja do Zé', scopes: ['messages:write', 'messages:read'] },
      params: { projectId: PARTNER_PROJECT_ID },
    },
    'POST /v1/partner/projects/{projectId}/api_keys/{id}/rotate': {
      id: 'rotatePartnerProjectApiKey',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'api_keys:write',
      statuses: { 201: 'Chave nova criada. O `secret` aparece uma única vez', ...PARTNER_STATUSES },
      summary: 'Rotacionar chave de API do projeto',
      description:
        'Cria uma chave de substituição para a chave informada. A chave original **continua ativa** até você revogá-la, então dá para trocar a chave no seu sistema sem interromper o envio. A resposta traz o `secret` da chave nova, exibido uma única vez.',
      params: {
        projectId: PARTNER_PROJECT_ID,
        id: 'Identificador da chave de API do projeto (`key_...`).',
      },
    },
    'POST /v1/partner/projects/{projectId}/api_keys/{id}/revoke': {
      id: 'revokePartnerProjectApiKey',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'api_keys:write',
      statuses: { 200: 'Chave revogada. O `revoked_at` indica quando', ...PARTNER_STATUSES },
      summary: 'Revogar chave de API do projeto',
      description:
        'Revoga a chave. Ela deixa de funcionar na hora. Use depois de [rotacionar](/api-reference/endpoint/partner/rotate-project-api-key) uma chave, ou quando um cliente sair.',
      params: {
        projectId: PARTNER_PROJECT_ID,
        id: 'Identificador da chave de API do projeto (`key_...`).',
      },
    },
    'GET /v1/partner/channels': {
      id: 'listPartnerChannels',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'projects:read',
      statuses: { ...PARTNER_STATUSES, 422: 'Requisição inválida (`status` desconhecido, `invalid_cursor`, `invalid_external_ref`)' },
      limit: PARTNER_LIMIT,
      summary: 'Listar canais dos clientes',
      description:
        'Lista, em uma chamada, os canais de todos os seus clientes, em qualquer estado (`pending`, `active`, `degraded` e `disabled`). Cada canal traz o `external_ref` do projeto dele.\n\nUm canal `disabled` impede que o projeto seja apagado e continua ocupando o número. Para liberar o número, [apague o canal](/api-reference/endpoint/partner/delete-channel).\n\nO item não traz credenciais nem dados do provedor.',
      params: {
        status: 'Devolve só os canais neste estado: `pending`, `active`, `degraded` ou `disabled`. Qualquer outro valor retorna `422`.',
        project_id: 'Devolve só os canais deste projeto (`proj_...`). Uma página vazia quando a organização não tem o projeto.',
        external_ref: 'Devolve só os canais do projeto que tem este `external_ref`. Uma página vazia quando nenhum projeto o tem.',
        ...PARTNER_PAGE_PARAMS,
      },
    },
    'DELETE /v1/partner/projects/{projectId}/channels/{channelId}': {
      id: 'deletePartnerChannel',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'channels:write',
      statuses: {
        204: 'O canal foi apagado',
        ...PARTNER_STATUSES,
        409: 'O canal não está desativado (`channel_not_disabled`)',
      },
      summary: 'Apagar canal desativado',
      description:
        'Apaga um canal **desativado** de um projeto seu, para liberar o número e o cliente poder conectá-lo de novo.\n\nExige o escopo `channels:write`, que **não** vem em uma chave de parceiro nova. Um canal em qualquer outro estado retorna `409 channel_not_disabled`.\n\nA API apaga o canal, a credencial e os templates dele. As mensagens, o uso e os eventos continuam citando o canal. Nada muda no WhatsApp.',
      params: {
        projectId: PARTNER_PROJECT_ID,
        channelId: 'Identificador do canal (`chan_...`).',
      },
    },
    'GET /v1/partner/webhook': {
      id: 'retrievePartnerWebhook',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'webhooks:write',
      statuses: { 200: 'Sucesso', ...PARTNER_STATUSES, 404: 'A organização ainda não configurou o webhook (`webhook_endpoint_not_found`), ou o plano não inclui a API de parceiro (`partner_api_not_available`)' },
      summary: 'Consultar webhook da organização',
      description:
        'Retorna o único endpoint de webhook da organização, com `status`, `consecutive_failures` e os horários do último sucesso e da última falha. O segredo nunca é retornado.\n\nNão existe um escopo só de leitura: a rota usa `webhooks:write`.',
    },
    'PUT /v1/partner/webhook': {
      id: 'setPartnerWebhook',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'webhooks:write',
      statuses: {
        200: 'Endpoint atualizado e reativado. A resposta não traz o segredo',
        201: 'Endpoint criado. O `secret` aparece uma única vez',
        ...PARTNER_STATUSES,
        422: 'Requisição inválida (`invalid_webhook_url`, `invalid_subscribed_types`)',
      },
      summary: 'Configurar webhook da organização',
      description:
        'Configura o **único** endpoint de webhook da organização, que recebe os eventos de **todos** os seus clientes. Cada evento traz o `project_id` e o `external_ref` do projeto, então você roteia pelo seu próprio identificador, sem manter uma tabela.\n\nA primeira chamada cria o endpoint e retorna `201` com o `secret` de assinatura, **exibido uma única vez**. As chamadas seguintes (`200`) substituem a URL e os tipos assinados, reativam o endpoint e não retornam o segredo.\n\nAs assinaturas e as tentativas seguem as regras dos [webhooks](/webhooks/overview) de um projeto. Você pode manter também endpoints em projetos individuais: nesse caso, recebe as duas entregas.\n\nUm endpoint que carrega muitos clientes é o gargalo de todos eles. Ele tem no máximo 32 entregas simultâneas (8 em um endpoint de projeto), então responda rápido e enfileire o trabalho do seu lado. Veja [Webhook da organização](/partners/webhook).',
      requestNotes: {
        url: { description: 'URL HTTPS que recebe os eventos de todos os projetos da organização. O endereço precisa resolver para um host público.', example: 'https://crm.exemplo.com/routa' },
        subscribed_types: { description: 'Tipos de evento ou curingas por recurso (`message.*`, `channel.*`, `template.*`). Pelo menos um. O curinga `*` sozinho não é aceito.', example: ['message.*', 'channel.status_changed'] },
      },
      requestExample: { url: 'https://crm.exemplo.com/routa', subscribed_types: ['message.*', 'channel.status_changed'] },
    },
    'POST /v1/partner/webhook/rotate_secret': {
      id: 'rotatePartnerWebhookSecret',
      tag: 'Parceiros',
      auth: 'partner',
      scope: 'webhooks:write',
      statuses: { 201: 'Segredo novo gerado. Ele aparece uma única vez', ...PARTNER_STATUSES, 404: 'A organização ainda não configurou o webhook (`webhook_endpoint_not_found`), ou o plano não inclui a API de parceiro (`partner_api_not_available`)' },
      summary: 'Rotacionar segredo do webhook',
      description:
        'Gera um novo segredo de assinatura e o retorna, **uma única vez**. O segredo anterior continua assinando as entregas por **24 horas**, então você troca o segredo no seu sistema sem perder eventos. Veja [Verificar assinaturas](/webhooks/signatures).',
    },
  },

  schemas: {
    Error: {
      error: 'Detalhes do erro.',
      'error.type': {
        description:
          'Categoria do erro: `invalid_request_error`, `authentication_error`, `permission_error`, `not_found_error`, `conflict_error`, `rate_limit_error`, `billing_error` ou `api_error`.',
        example: 'invalid_request_error',
      },
      'error.code': {
        description: 'Código estável e legível por máquina. Veja [Códigos de erro](/errors/error-codes).',
        example: 'channel_inactive',
      },
      'error.message': {
        description: 'Texto para humanos, em inglês. Pode mudar, então não faça parse dele.',
        example: 'Channel chan_01J8... is not active and cannot send messages.',
      },
      'error.param': { description: 'O campo da requisição com problema, quando se aplica. Hoje vem preenchido nos erros de template: `name` em `template_name_invalid`, e `body_text`, `components.header`, `components.footer` ou `components.buttons` em `template_components_invalid`. É o componente, não o item dentro dele.', example: 'components.buttons' },
      'error.doc_url': 'Link para a documentação do código, quando disponível.',
      'error.details': 'Valores acionáveis, como `limit`, `used` e `resets_at` em `message_quota_exceeded`, ou `limit` e `used` em `free_messages_exhausted`.',
      'error.request_id': {
        description: 'Identificador da requisição. Informe-o ao falar com o suporte.',
        example: 'req_01J8ZK9M3Q7XABCDEFGHJKMNPQ',
      },
    },
    Message: {
      id: { description: 'Identificador da mensagem.', example: ID('msg') },
      channel: { description: 'Identificador do canal usado.', example: ID('chan') },
      direction: 'Direção da mensagem: `outbound` (saiu do número do canal, pela API ou pelo app do WhatsApp Business) ou `inbound` (recebida).',
      origin: { description: 'De onde veio uma mensagem `outbound`: `api` (enviada pela Routa) ou `business_app` (a empresa enviou pelo app do WhatsApp Business, em um número conectado em modo de coexistência). Uma mensagem `business_app` não é cobrada nem entra no uso. É `null` em uma mensagem `inbound`.', example: 'api' },
      from: { description: 'Endereço de origem, em E.164.', example: '+5581988888888' },
      to: { description: 'Endereço de destino, em E.164. Em uma mensagem `business_app`, pode ser um identificador do provedor quando o número do destinatário não é conhecido.', example: '+5581999999999' },
      content: 'Conteúdo da mensagem. O campo `type` indica o formato. É `null` depois que a retenção remove o conteúdo; nesse caso `content_redacted_at` traz o momento da remoção.',
      content_redacted_at: { description: 'Quando a retenção removeu o conteúdo da mensagem. `null` enquanto a mensagem ainda tem o conteúdo.', example: null },
      status: 'Estado atual no ciclo de vida. O status nunca retrocede.',
      failure_code: { description: 'Motivo da falha, de um conjunto fechado de códigos da Routa, nunca um código do provedor. `null` até a mensagem falhar.', example: null },
      metadata: 'Até 20 pares chave-valor de texto, de propriedade do cliente.',
      accepted_at: { description: 'Quando a Routa aceitou a mensagem.', example: TS },
      sent_at: { description: 'Quando o provedor aceitou a mensagem. `null` se ainda não ocorreu.', example: TS },
      delivered_at: { description: 'Quando a entrega foi confirmada. `null` se ainda não ocorreu.', example: TS },
      read_at: { description: 'Quando o destinatário leu. `null` se ainda não ocorreu.', example: null },
      failed_at: { description: 'Quando a mensagem falhou. `null` se não falhou.', example: null },
    },
    MessageList: {
      data: 'Mensagens da página.',
      has_more: 'Indica se existem mais páginas.',
      next_cursor: 'Cursor da próxima página, ou `null` na última.',
    },
    Event: {
      id: { description: 'Identificador do evento. É a chave de deduplicação.', example: ID('evt') },
      type: 'Tipo do evento, no formato `recurso.ação_no_passado`.',
      api_version: { description: 'Versão do formato público do recurso em `data`.', example: 'v1' },
      schema_version: { description: 'Versão do envelope do evento.', example: 1 },
      project_id: { description: 'Projeto dono do evento.', example: ID('proj') },
      external_ref: { description: 'O `external_ref` do projeto (o identificador do cliente na plataforma parceira), ou `null` em um projeto que não tem um. Definido uma vez e nunca muda.', example: null },
      sequence: 'Número monotônico, útil para detectar lacunas. Não é uma promessa de ordem de entrega.',
      occurred_at: { description: 'Quando o fato ocorreu.', example: TS },
      recorded_at: { description: 'Quando a Routa registrou o evento.', example: TS },
      data: 'O recurso completo no estado atual, não um diff. Para eventos de mensagem é a mensagem, para eventos de template é o template.',
    },
    EventList: {
      data: 'Eventos da página.',
      has_more: 'Indica se existem mais eventos.',
      next_cursor: 'Id do último evento da página, ou `null` na última. Use-o em `after`.',
    },
    Template: {
      id: { description: 'Identificador do template.', example: ID('tmpl') },
      channel: { description: 'Canal ao qual o template pertence.', example: ID('chan') },
      name: { description: 'Nome do template.', example: 'confirmacao_pedido' },
      language: { description: 'Código de idioma.', example: 'pt_BR' },
      category: 'Categoria: `marketing`, `utility` ou `authentication`.',
      body_text: { description: 'O corpo do template, com os placeholders `{{1}}`, `{{2}}`, … É `null` só em um template importado e somente leitura (`read_only`), que a Routa não consegue reproduzir.', example: 'Olá {{1}}! Seu pedido {{2}} foi confirmado.' },
      variables: 'Placeholders posicionais do corpo (`{{1}}`, `{{2}}`, …).',
      components: 'Cabeçalho, rodapé e botões do template. O campo é omitido, não vazio, em um template só com corpo.',
      status: 'Estado de aprovação. Somente `approved` permite enviar. `rejected` indica que o provedor analisou e recusou o template. `failed` indica que a Routa não conseguiu submetê-lo. Um template `failed` ou `rejected` pode ser editado e reenviado no painel, e então volta a `submitted`.',
      rejection_reason: 'Motivo da rejeição, quando `status` é `rejected`.',
      failure_code: { description: 'Motivo da falha de submissão, quando `status` é `failed`. `null` nos demais status.', example: null },
      failure_detail: { description: 'Só quando `status` é `failed` e o provedor explicou o motivo: a frase dele, escrita para uma pessoa e muitas vezes no idioma da conta. É texto informativo. Nunca compare com ele, use `failure_code`. `null` nos demais casos.', example: null },
      deletion_requested: { description: '`true` desde que uma exclusão foi aceita (feita no painel) até a Routa terminar de apagar o template no WhatsApp. Nesse intervalo o template não pode ser usado para enviar e uma mensagem que o cita retorna `422 template_not_sendable`. `false` nos demais casos.', example: false },
      deletion_failure_detail: { description: 'Por que a última exclusão terminou sem apagar o template, na frase do provedor quando ele a deu. É texto informativo. `null` quando nenhuma exclusão falhou.', example: null },
      origin: { description: 'Quem criou o template: `routa` para um template submetido pela Routa, `provider` para um que já existia no WhatsApp e foi importado.', example: 'routa' },
      read_only: { description: '`true` para um template importado que a Routa não consegue reproduzir. Enviar uma mensagem com ele retorna `422 template_not_sendable`. Sempre `false` quando `origin` é `routa`.', example: false },
      unsupported_components: { description: 'Componentes de um template importado que a Routa não consegue reproduzir. Vazia quando `read_only` é `false`.', example: [] },
      created_at: { description: 'Quando o template foi criado.', example: TS },
      updated_at: { description: 'Quando o template foi atualizado pela última vez.', example: TS },
    },
    TemplateList: {
      data: 'Templates da página.',
      has_more: 'Indica se existem mais páginas.',
      next_cursor: 'Cursor da próxima página, ou `null` na última.',
    },
    WebhookEndpoint: {
      id: { description: 'Identificador do endpoint.', example: ID('whe') },
      url: { description: 'URL que recebe os eventos.', example: 'https://exemplo.com/webhooks/routa' },
      subscribed_types: 'Tipos de evento assinados, incluindo curingas como `message.*`.',
      api_version: 'Versão da API fixada na criação do endpoint.',
      status: 'Estado do endpoint: `enabled`, `disabled_by_user` ou `disabled_by_system`.',
      consecutive_failures: 'Falhas consecutivas de entrega. Zera a cada sucesso.',
      last_success_at: 'Último sucesso de entrega, ou `null`.',
      last_failure_at: 'Última falha de entrega, ou `null`.',
      created_at: { description: 'Quando o endpoint foi criado.', example: TS },
    },
    WebhookEndpointWithSecret: {
      id: { description: 'Identificador do endpoint.', example: ID('whe') },
      url: { description: 'URL que recebe os eventos.', example: 'https://exemplo.com/webhooks/routa' },
      subscribed_types: 'Tipos de evento assinados, incluindo curingas como `message.*`.',
      api_version: 'Versão da API fixada na criação do endpoint.',
      status: 'Estado do endpoint: `enabled`, `disabled_by_user` ou `disabled_by_system`.',
      consecutive_failures: 'Falhas consecutivas de entrega. Zera a cada sucesso.',
      last_success_at: 'Último sucesso de entrega, ou `null`.',
      last_failure_at: 'Última falha de entrega, ou `null`.',
      created_at: { description: 'Quando o endpoint foi criado.', example: TS },
      secret: {
        description: 'Segredo de assinatura. Exibido apenas na criação e na rotação. Guarde-o com segurança.',
        example: 'whsec_...',
      },
    },
    WebhookEndpointList: {
      data: 'Endpoints do projeto.',
      has_more: 'Indica se existem mais páginas. Hoje é sempre `false`.',
      next_cursor: 'Sempre `null`. A listagem retorna todos os endpoints de uma vez.',
    },
    WebhookDelivery: {
      id: { description: 'Identificador da entrega.', example: ID('whd') },
      event_id: { description: 'Evento entregue.', example: ID('evt') },
      event_type: { description: 'Tipo do evento entregue.', example: 'message.delivered' },
      state: 'Estado da entrega: `pending`, `in_flight`, `retrying`, `succeeded` ou `exhausted`.',
      attempt_count: 'Tentativas realizadas.',
      next_attempt_at: 'Quando ocorre a próxima tentativa.',
      last_response_status: 'Status HTTP da última resposta do seu servidor, ou `null`.',
      last_error_code: 'Código do último erro, como timeout ou falha de conexão, ou `null`.',
      succeeded_at: 'Quando a entrega teve sucesso, ou `null`.',
      exhausted_at: 'Quando esgotou as tentativas, ou `null`.',
      created_at: { description: 'Quando a entrega foi criada.', example: TS },
    },
    WebhookDeliveryList: {
      data: 'Entregas da página.',
      has_more: 'Indica se existem mais páginas.',
      next_cursor: 'Cursor da próxima página, ou `null` na última.',
    },
    ReplayResult: {
      replayed_count: { description: 'Quantidade de entregas reenviadas.', example: 12 },
    },
    Media: {
      id: { description: 'Identificador da mídia.', example: ID('med') },
      content_type: { description: 'Tipo MIME do arquivo.', example: 'image/jpeg' },
      status: 'Estado: `pending`, `ready` ou `unavailable`.',
      url: 'URL assinada com validade de 15 minutos. Presente apenas quando `status` é `ready`.',
    },
    TemplateMedia: {
      id: { description: 'Identificador da mídia de cabeçalho. Use-o em `components.header.media_id`.', example: ID('tmedia') },
      format: 'Formato: `image`, `video` ou `document`.',
      size_bytes: 'Tamanho do arquivo, em bytes.',
      content_type: { description: 'Tipo MIME do arquivo.', example: 'image/png' },
      created_at: { description: 'Quando o arquivo foi enviado.', example: TS },
    },
    Usage: {
      from_date: { description: 'Início do período (inclusivo).', example: '2026-09-01' },
      to_date: { description: 'Fim do período (exclusivo).', example: '2026-10-01' },
      data: 'Uma linha por combinação de métrica, tipo de canal e provedor.',
      'data.[].metric': { description: 'Métrica medida.', example: 'message.sent' },
      'data.[].channel_type': { description: 'Tipo do canal, ou `null`.', example: 'whatsapp' },
      'data.[].provider': { description: 'Provedor, ou `null`.', example: 'whatsapp_cloud' },
      'data.[].quantity': { description: 'Quantidade no período.', example: 1840 },
      'data.[].unit': { description: 'Unidade da métrica.', example: 'message' },
    },
    Whoami: {
      organization_id: { description: 'Organização dona da chave.', example: ID('org') },
      project_id: { description: 'Projeto ao qual a chave pertence.', example: ID('proj') },
      api_key_id: { description: 'Identificador da chave.', example: ID('key') },
      scopes: 'Escopos concedidos à chave.',
    },
    PartnerProject: {
      id: { description: 'Identificador do projeto.', example: ID('proj') },
      name: { description: 'Nome de exibição do projeto.', example: 'Loja do Zé' },
      external_ref: { description: 'Seu identificador do cliente. Único na organização e definido uma vez.', example: 'lead_123' },
      environment: { description: 'Ambiente do projeto. Os projetos da API de parceiro sempre são `live`.', example: 'live' },
      created_at: { description: 'Quando o projeto foi criado.', example: TS },
    },
    PartnerProjectList: {
      data: 'Projetos da página.',
      has_more: 'Indica se existem mais páginas.',
      next_cursor: 'Cursor da próxima página, ou `null` na última.',
    },
    PartnerProjectDetail: {
      id: { description: 'Identificador do projeto.', example: ID('proj') },
      name: { description: 'Nome de exibição do projeto.', example: 'Loja do Zé' },
      external_ref: { description: 'Seu identificador do cliente.', example: 'lead_123' },
      environment: { description: 'Ambiente do projeto.', example: 'live' },
      created_at: { description: 'Quando o projeto foi criado.', example: TS },
      channels: 'Canais do projeto, em qualquer estado. Um canal `active` indica que o cliente concluiu a conexão.',
      'channels.[].id': { description: 'Identificador do canal.', example: ID('chan') },
      'channels.[].status': { description: 'Estado do canal: `pending`, `active`, `degraded` ou `disabled`.', example: 'active' },
    },
    PartnerProjectDeleting: {
      project_id: { description: 'Projeto que está sendo apagado.', example: ID('proj') },
      status: { description: 'Sempre `deleting`. O projeto continua lá, parcialmente apagado. Repita a chamada até receber `204`.', example: 'deleting' },
    },
    PartnerChannelList: {
      data: 'Canais da página.',
      has_more: 'Indica se existem mais páginas.',
      next_cursor: 'Cursor da próxima página, ou `null` na última.',
      'data.[].id': { description: 'Identificador do canal.', example: ID('chan') },
      'data.[].project_id': { description: 'Projeto dono do canal.', example: ID('proj') },
      'data.[].external_ref': { description: 'O `external_ref` do projeto.', example: 'lead_123' },
      'data.[].address': { description: 'Endereço do canal, em E.164.', example: '+5581988888888' },
      'data.[].status': { description: 'Estado do canal: `pending`, `active`, `degraded` ou `disabled`.', example: 'active' },
      'data.[].status_reason_code': { description: 'Por que o canal está `degraded` ou `disabled`: `provider_auth_repeated_failure` (`degraded`), `disconnected_by_customer` ou `offboarded` (`disabled`). `null` nos demais casos.', example: null },
      'data.[].connection_mode': { description: 'Como o número foi conectado: `cloud_api` ou `coexistence` (o número continua no app do WhatsApp Business).', example: 'cloud_api' },
      'data.[].disconnection_reason': { description: 'O motivo que o provedor deu para a desconexão: `account_disconnected`, `business_downgrade`, `change_number`, `companion_inactivity`, `primary_inactivity`, `user_re_registered` ou `unknown`. `null` quando não houve desconexão.', example: null },
      'data.[].created_at': { description: 'Quando o canal foi criado.', example: TS },
    },
    PartnerProjectApiKey: {
      id: { description: 'Identificador da chave.', example: ID('key') },
      project_id: { description: 'Projeto ao qual a chave pertence.', example: ID('proj') },
      name: { description: 'Nome que você deu à chave, ou `null`.', example: 'Loja do Zé' },
      key_prefix: { description: 'Primeiros caracteres da chave, seguros para exibir.', example: 'rt_live_abc' },
      last_four: { description: 'Últimos quatro caracteres da chave.', example: 'k3xQ' },
      scopes: 'Escopos concedidos à chave do projeto.',
      expires_at: 'Quando a chave expira, ou `null` se ela não expira.',
      ip_allowlist: 'Endereços IP ou blocos CIDR permitidos. Uma lista vazia não restringe.',
      created_at: { description: 'Quando a chave foi criada.', example: TS },
      revoked_at: 'Quando a chave foi revogada, ou `null` enquanto está ativa.',
      last_used_at: 'Último uso da chave, arredondado para o minuto, ou `null`.',
    },
    PartnerProjectApiKeyWithSecret: {
      id: { description: 'Identificador da chave.', example: ID('key') },
      project_id: { description: 'Projeto ao qual a chave pertence.', example: ID('proj') },
      name: { description: 'Nome que você deu à chave, ou `null`.', example: 'Loja do Zé' },
      key_prefix: { description: 'Primeiros caracteres da chave, seguros para exibir.', example: 'rt_live_abc' },
      last_four: { description: 'Últimos quatro caracteres da chave.', example: 'k3xQ' },
      scopes: 'Escopos concedidos à chave do projeto.',
      expires_at: 'Quando a chave expira, ou `null` se ela não expira.',
      ip_allowlist: 'Endereços IP ou blocos CIDR permitidos. Uma lista vazia não restringe.',
      created_at: { description: 'Quando a chave foi criada.', example: TS },
      revoked_at: 'Quando a chave foi revogada, ou `null` enquanto está ativa.',
      last_used_at: 'Último uso da chave, arredondado para o minuto, ou `null`.',
      secret: { description: 'A chave de API completa. Exibida **apenas agora**. Guarde-a com segurança.', example: 'rt_live_...' },
    },
  },
}
